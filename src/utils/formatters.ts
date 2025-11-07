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

// Formatação monetária brasileira
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Formatar valor monetário no input (aceita vírgula)
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

// Converter string com vírgula para número
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

// Formatar número para exibição com vírgula
export const formatNumberBR = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
