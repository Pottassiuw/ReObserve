import { createClient } from "@supabase/supabase-js";
import { base64ToBlob } from "./formatters";
import { v4 as uuidV4 } from "uuid";
import { logInfo, logDebug, logError } from "./logger";
import { STORAGE_CONFIG } from "@/config";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_PUBLISHABLE_KEY as string;
const IMAGE_BUCKET_NAME = STORAGE_CONFIG.IMAGE_BUCKET_NAME;
const XML_BUCKET_NAME = STORAGE_CONFIG.XML_BUCKET_NAME;
const IMAGE_FOLDER = STORAGE_CONFIG.IMAGE_FOLDER;
const XML_FOLDER = STORAGE_CONFIG.XML_FOLDER;
let customToken: string | null = null;

export function setAuthToken(token: string) {
  customToken = token;
  logInfo("Auth token updated", {
    hasToken: !!token,
    tokenLength: token?.length || 0,
  });
}

export async function diagnosticarSupabase(): Promise<void> {
  logDebug("Iniciando diagnóstico do Supabase");

  try {
    const supabase = getSupabaseClient();
    logDebug("Teste 1: Listando buckets");
    const { data: buckets, error: bucketsError } =
      await supabase.storage.listBuckets();

    if (bucketsError) {
      logError("Erro ao listar buckets", bucketsError);
    } else {
      logDebug("Buckets encontrados", {
        buckets: buckets?.map((b) => b.name),
      });
    }

    for (const bucketName of [IMAGE_BUCKET_NAME, XML_BUCKET_NAME]) {
      logDebug(`Verificando bucket '${bucketName}'`);
      const { data: files, error: filesError } = await supabase.storage
        .from(bucketName)
        .list("", { limit: 5 });

      if (filesError) {
        logError(`Erro ao acessar bucket '${bucketName}'`, {
          message: filesError.message,
          name: filesError.name,
        });
      } else {
        logDebug(`Bucket '${bucketName}' acessível`, {
          fileCount: files?.length || 0,
          files,
        });
      }
    }

    logDebug("Diagnóstico concluído");
  } catch (error) {
    logError("Erro no diagnóstico do Supabase", error);
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
      timeout: 30000,
    },
  });

  logDebug("Cliente Supabase configurado", {
    url: SUPABASE_URL,
    hasToken: !!customToken,
    tokenType: customToken ? "custom" : "anon",
  });

  return client;
}

function isRemoteImageUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function isBase64Image(value: string): boolean {
  return /^data:image\//i.test(value);
}

async function uploadFileToBucket(
  bucketName: string,
  filePath: string,
  file: Blob,
  contentType: string,
): Promise<string> {
  if (!customToken) {
    throw new Error("Token de autenticação não definido. Faça login primeiro.");
  }

  const supabase = getSupabaseClient();
  logDebug("Iniciando upload para o Supabase Storage", {
    bucketName,
    filePath,
    contentType,
    fileSize: file.size,
  });

  const { error } = await supabase.storage.from(bucketName).upload(filePath, file, {
    contentType,
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    logError("Falha no upload para o Supabase Storage", {
      bucketName,
      filePath,
      contentType,
      message: error.message,
      name: error.name,
    });

    throw new Error(
      `Upload falhou no bucket '${bucketName}' para '${filePath}': ${error.message}`,
    );
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  logDebug("Upload concluído no Supabase Storage", {
    bucketName,
    filePath,
    publicUrl: data.publicUrl,
  });
  return data.publicUrl;
}

export const uploadImagens = async (
  imagens: (File | string)[],
): Promise<string[]> => {
  if (!customToken) {
    throw new Error("Token de autenticação não definido. Faça login primeiro.");
  }

  logDebug("Iniciando upload de imagens", {
    quantidade: imagens.length,
    tokenExiste: !!customToken,
  });

  const urls: string[] = [];

  for (let i = 0; i < imagens.length; i++) {
    const imagem = imagens[i];

    try {
      logDebug(`Processando imagem ${i + 1}/${imagens.length}`);

      if (typeof imagem === "string") {
        if (isRemoteImageUrl(imagem)) {
          urls.push(imagem);
          continue;
        }

        if (!isBase64Image(imagem)) {
          throw new Error(
            `Formato de imagem inválido na posição ${i + 1}. Use uma imagem válida ou URL já enviada.`,
          );
        }
      }

      const blob = typeof imagem === "string" ? base64ToBlob(imagem) : imagem;
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.jpg`;
      const identifierUUID = uuidV4();
      const filePath = `${IMAGE_FOLDER}/${identifierUUID}/${fileName}`;

      logDebug(`Fazendo upload para: ${filePath}`);

      const publicUrl = await uploadFileToBucket(
        IMAGE_BUCKET_NAME,
        filePath,
        blob,
        "image/jpeg",
      );

      urls.push(publicUrl);
      logDebug(`URL pública gerada: ${publicUrl}`);
    } catch (error) {
      logError(`Erro ao processar imagem ${i + 1}`, error);
      throw error;
    }
  }

  logInfo("Todas as imagens foram enviadas com sucesso", { urls });
  return urls;
};

export const uploadXmlFile = async (file: File): Promise<string | undefined> => {
  const extension = file.name.split(".").pop()?.toLowerCase() || "xml";
  const identifierUUID = uuidV4();
  const filePath = `${XML_FOLDER}/${identifierUUID}/${Date.now()}.${extension}`;
  const xmlContent = await file.text();

  const attempts: Array<{ bucketName: string; contentType: string }> = [
    { bucketName: XML_BUCKET_NAME, contentType: "application/xml" },
    { bucketName: XML_BUCKET_NAME, contentType: "text/plain" },
  ];

  let lastError: Error | null = null;

  for (const attempt of attempts) {
    try {
      const xmlBlob = new Blob([xmlContent], { type: attempt.contentType });
      return await uploadFileToBucket(
        attempt.bucketName,
        filePath,
        xmlBlob,
        attempt.contentType,
      );
    } catch (error: any) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logError("Erro ao enviar XML para o bucket", {
        bucket: attempt.bucketName,
        contentType: attempt.contentType,
        message: lastError.message,
      });
    }
  }

  throw lastError || new Error("Não foi possível enviar o XML para o storage.");
};
