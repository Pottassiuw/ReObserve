// src/helpers/supabase-helpers.ts

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

const BUCKET_NAME = "Lancamentos";
export const uploadImagemAoStorage = async (file: File): Promise<string> => {
  const fileExtension = file.name.split(".").pop();
  const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600", // 1 hora de cache
      upsert: false, // Não sobrescrever
    });

  if (uploadError) {
    console.error("Erro no upload do Supabase:", uploadError);
    throw new Error(`Falha ao subir imagem: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
