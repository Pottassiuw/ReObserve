import { createClient } from "@supabase/supabase-js";
import { base64ToBlob } from "./formatters";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const BUCKET_NAME = "Imagens";

let customToken: string | null = null;

export function setAuthToken(token: string) {
  customToken = token;
}
export function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: customToken
        ? { Authorization: `Bearer ${customToken}` }
        : undefined,
    },
  });
}
export const uploadImagens = async (
  imagens: (File | string)[],
): Promise<string[]> => {
  if (!customToken) {
    throw new Error("Token de autenticação não definido. Faça login primeiro.");
  }

  const supabase = getSupabaseClient();
  const urls: string[] = [];

  for (const imagem of imagens) {
    const blob = typeof imagem === "string" ? base64ToBlob(imagem) : imagem;
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.jpg`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, blob, {
        contentType: "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erro no upload:", error);
      throw new Error(`Falha ao subir imagem: ${error.message}`);
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    urls.push(data.publicUrl);
  }

  return urls;
};
