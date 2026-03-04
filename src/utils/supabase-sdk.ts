import { createClient } from "@supabase/supabase-js";
import { base64ToBlob } from "./formatters";
import { v4 as uuidV4 } from "uuid";
import { logInfo } from "./logger";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_PUBLISHABLE_KEY as string;
const BUCKET_NAME = "Imagens";
let customToken: string | null = null;

export function setAuthToken(token: string) {
  customToken = token;
  logInfo("Auth token updated", {
    hasToken: !!token,
    tokenLength: token?.length || 0,
  });
}

// Função de diagnóstico para testar conectividade
export async function diagnosticarSupabase(): Promise<void> {
  console.log("🔍 Iniciando diagnóstico do Supabase...");

  try {
    const supabase = getSupabaseClient();

    // Teste 1: Listar buckets
    console.log("📋 Teste 1: Listando buckets...");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error("❌ Erro ao listar buckets:", bucketsError);
    } else {
      console.log(
        "✅ Buckets encontrados:",
        buckets?.map((b) => b.name),
      );
    }

    // Teste 2: Verificar se bucket específico existe
    console.log(`📂 Teste 2: Verificando bucket '${BUCKET_NAME}'...`);
    const { data: files, error: filesError } = await supabase.storage
      .from(BUCKET_NAME)
      .list("", { limit: 1 });

    if (filesError) {
      console.error(`❌ Erro ao acessar bucket '${BUCKET_NAME}':`, filesError);
    } else {
      console.log(
        `✅ Bucket '${BUCKET_NAME}' acessível. Arquivos encontrados:`,
        files?.length || 0,
      );
    }

    console.log("🎉 Diagnóstico concluído!");
  } catch (error) {
    console.error("💥 Erro no diagnóstico:", error);
  }
}
export function getSupabaseClient() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: customToken
        ? { Authorization: `Bearer ${customToken}` }
        : undefined,
    },
    db: {
      schema: "public",
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    realtime: {
      timeout: 30000, // 30 segundos
    },
  });

  console.log("🔧 Cliente Supabase configurado", {
    url: SUPABASE_URL,
    hasToken: !!customToken,
    tokenType: customToken ? "custom" : "anon",
  });

  return client;
}
export const uploadImagens = async (
  imagens: (File | string)[],
): Promise<string[]> => {
  if (!customToken) {
    throw new Error("Token de autenticação não definido. Faça login primeiro.");
  }

  console.log("🔍 Iniciando upload de imagens", {
    quantidade: imagens.length,
    tokenExiste: !!customToken,
    tokenPrefix: customToken.substring(0, 20) + "...",
  });

  const supabase = getSupabaseClient();
  const urls: string[] = [];

  for (let i = 0; i < imagens.length; i++) {
    const imagem = imagens[i];

    try {
      console.log(`📤 Processando imagem ${i + 1}/${imagens.length}`);

      const blob = typeof imagem === "string" ? base64ToBlob(imagem) : imagem;
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.jpg`;
      const identifierUUID = uuidV4();
      const filePath = `${identifierUUID}/${fileName}`;

      console.log(`📂 Fazendo upload para: ${filePath}`);

      const { error, data: uploadData } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, blob, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error(`❌ Erro no upload da imagem ${i + 1}:`, error);
        console.error("Detalhes do erro:", {
          message: error.message,
          name: error.name,
        });
        throw new Error(`Falha ao subir imagem ${i + 1}: ${error.message}`);
      }

      console.log(`✅ Upload da imagem ${i + 1} concluído:`, uploadData);

      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);
      urls.push(data.publicUrl);

      console.log(`🔗 URL pública gerada: ${data.publicUrl}`);
    } catch (error) {
      console.error(`💥 Erro ao processar imagem ${i + 1}:`, error);
      throw error;
    }
  }

  console.log("🎉 Todas as imagens foram enviadas com sucesso!", urls);
  return urls;
};
