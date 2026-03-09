export interface ParsedNFeData {
  numero: string;
  dataEmissao: string;
  valor: number | null;
  rawContent: string;
}

function normalizeTagName(tagName: string): string {
  return tagName.split(":").pop() || tagName;
}

function getElementsByTagNameLocal(doc: Document, tagNames: string[]): Element[] {
  const targets = new Set(tagNames.map((tag) => normalizeTagName(tag)));
  return Array.from(doc.getElementsByTagName("*")).filter((element) =>
    targets.has(normalizeTagName(element.tagName || element.nodeName)),
  );
}

function getFirstTagText(doc: Document, tagNames: string[]): string | null {
  const element = getElementsByTagNameLocal(doc, tagNames).find(
    (node) => node.textContent?.trim(),
  );

  return element?.textContent?.trim() || null;
}

function sanitizeNFeNumber(value: string): string {
  return value.replace(/\D/g, "");
}

function parseEmissionDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (/^\d{8}$/.test(trimmed)) {
    const year = trimmed.slice(0, 4);
    const month = trimmed.slice(4, 6);
    const day = trimmed.slice(6, 8);
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
  }

  const parsedDate = new Date(trimmed);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
}

function parseValue(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const normalized = value
    .trim()
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

function ensureValidXmlDocument(xmlContent: string): Document {
  const parser = new DOMParser();
  const document = parser.parseFromString(xmlContent, "application/xml");
  const parserError = document.querySelector("parsererror");

  if (parserError) {
    throw new Error("Arquivo XML inválido ou malformado.");
  }

  return document;
}

export function parseNFeXmlContent(xmlContent: string): ParsedNFeData {
  const trimmedContent = xmlContent.trim();

  if (!trimmedContent) {
    throw new Error("Arquivo XML está vazio.");
  }

  const document = ensureValidXmlDocument(trimmedContent);
  const numero = sanitizeNFeNumber(getFirstTagText(document, ["nNF"]) || "");

  if (!numero) {
    throw new Error("Número da NFe não encontrado no XML.");
  }

  const dataEmissao =
    parseEmissionDate(getFirstTagText(document, ["dhEmi", "dEmi"])) ||
    new Date().toISOString();

  return {
    numero,
    dataEmissao,
    valor: parseValue(getFirstTagText(document, ["vNF"])),
    rawContent: trimmedContent,
  };
}

export async function parseNFeXmlFile(file: File): Promise<ParsedNFeData> {
  const xmlContent = await file.text();
  return parseNFeXmlContent(xmlContent);
}
