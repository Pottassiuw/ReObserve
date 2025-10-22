import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

import { base64ToBlob } from "./formatters";
const BUCKET_NAME = "Lancamentos";

// Upload de múltiplas imagens
const user = await supabase.auth.getUser();
console.log("Usuário autenticado supabase: ", user);
export const uploadImagens = async (
  imagens: (File | string)[],
): Promise<string[]> => {
  const urls: string[] = [];

  for (const imagem of imagens) {
    // Se for string (base64), converte para Blob
    const blob = typeof imagem === "string" ? base64ToBlob(imagem) : imagem;

    // Gerar nome único
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`;
    const filePath = `images/${fileName}`;

    // Upload para o Supabase
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

    // Pegar URL pública
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    urls.push(data.publicUrl);
  }

  return urls;
};

export { supabase };
