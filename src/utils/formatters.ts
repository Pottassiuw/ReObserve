/**
 * Formats a CNPJ string to the standard Brazilian format (XX.XXX.XXX/XXXX-XX)
 * @param value - The CNPJ string to format (can contain non-numeric characters)
 * @returns Formatted CNPJ string or original value if invalid
 */
export const formatCNPJ = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 14) {
    return cleaned
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return value;
};

/**
 * Formats a CPF string to the standard Brazilian format (XXX.XXX.XXX-XX)
 * @param value - The CPF string to format (can contain non-numeric characters)
 * @returns Formatted CPF string or original value if invalid
 */
export const formatCPF = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 11) {
    return cleaned
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1-$2");
  }
  return value;
};

/**
 * Converts a base64 string to a Blob object
 * Useful for handling image data in forms
 * @param base64 - The base64 encoded string (can include data URI prefix)
 * @returns Blob object with proper MIME type
 */
export const base64ToBlob = (base64: string): Blob => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
};

/**
 * Formats a number as Brazilian currency (BRL)
 * @param value - The numeric value to format
 * @returns Formatted currency string (e.g., "R$ 1.234,56")
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * Formats currency input for form fields
 * Accepts both commas and dots as decimal separators (Brazilian convention)
 * Automatically handles thousand separators
 * @param value - The input string from user (can contain various formats)
 * @returns Cleaned number string with at most 2 decimal places
 * @example
 * formatCurrencyInput("1.234,56") => "1234.56"
 * formatCurrencyInput("1,5") => "1.5"
 */
export const formatCurrencyInput = (value: string): string => {
  // Remove tudo que não é número, vírgula ou ponto
  let cleaned = value.replace(/[^\d,\.]/g, "");

  // Se tiver vírgula, converte para ponto para processamento
  if (cleaned.includes(",")) {
    // Se tiver ponto e vírgula, assume que ponto é separador de milhares
    if (cleaned.includes(".") && cleaned.includes(",")) {
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      // Só vírgula, converte para ponto
      cleaned = cleaned.replace(",", ".");
    }
  }

  // Remove pontos extras (mantém apenas o último)
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts.slice(0, -1).join("") + "." + parts[parts.length - 1];
  }

  // Limita a 2 casas decimais
  if (cleaned.includes(".")) {
    const [integer, decimal] = cleaned.split(".");
    cleaned = integer + "." + decimal.slice(0, 2);
  }

  return cleaned;
};

/**
 * Parses a Brazilian currency string to a number
 * Handles both Brazilian (vírgula) and international (ponto) decimal formats
 * @param value - The currency string (can include "R$" symbol)
 * @returns Parsed number value
 * @example
 * parseCurrencyBR("R$ 1.234,56") => 1234.56
 * parseCurrencyBR("1,5") => 1.5
 */
export const parseCurrencyBR = (value: string): number => {
  if (!value) return 0;

  // Remove espaços e símbolos de moeda
  let cleaned = value.replace(/[R$\s]/g, "");

  // Se tiver vírgula, trata como decimal brasileiro
  if (cleaned.includes(",")) {
    // Se tiver ponto e vírgula, assume padrão brasileiro (ponto = milhares, vírgula = decimal)
    if (cleaned.includes(".") && cleaned.includes(",")) {
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      // Só vírgula, converte para ponto
      cleaned = cleaned.replace(",", ".");
    }
  }

  return parseFloat(cleaned) || 0;
};

/**
 * Formats a number for display in Brazilian locale
 * Always shows 2 decimal places
 * @param value - The numeric value to format
 * @returns Formatted string with locale-specific separators (e.g., "1.234,56")
 */
export const formatNumberBR = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
