import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type { Lancamento, CriarLancamentoDTO } from "@/types/index";
import { uploadImagens } from "@/utils/supabase-sdk";

interface ModalLancamentoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lancamento: Lancamento | null;
  onSalvar: (dados: CriarLancamentoDTO) => void;
  usuarioId: number;
  empresaId: number;
}

// Schema de validação com Zod
const lancamentoSchema = z.object({
  numeroNotaFiscal: z.string().min(1, "Número da nota fiscal é obrigatório"),
  valor: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Digite um valor válido maior que zero",
    }),
  dataEmissao: z.string().min(1, "Data de emissão é obrigatória"),
  xmlPath: z.string().optional(),
  imagens: z
    .array(z.any())
    .min(1, "Adicione pelo menos uma imagem da nota fiscal"),
});

const ModalLancamento = ({
  open,
  onOpenChange,
  lancamento,
  onSalvar,
  usuarioId,
  empresaId,
}: ModalLancamentoProps) => {
  const [formData, setFormData] = useState({
    numeroNotaFiscal: "",
    valor: "",
    dataEmissao: "",
    xmlPath: "",
  });

  const [imagens, setImagens] = useState<(File | string)[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [modoCamera, setModoCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lancamento) {
      setFormData({
        numeroNotaFiscal: lancamento.notaFiscal.numero || "",
        valor: lancamento.notaFiscal.valor?.toString() || "",
        dataEmissao: lancamento.notaFiscal.dataEmissao
          ? new Date(lancamento.notaFiscal.dataEmissao)
              .toISOString()
              .split("T")[0]
          : "",
        xmlPath: lancamento.notaFiscal.xmlPath || "",
      });

      // Carregar imagens existentes
      if (lancamento.imagens && lancamento.imagens.length > 0) {
        const urls = lancamento.imagens.map((img) => img.url);
        setImagens(urls);
        setPreviews(urls);
      }
    } else {
      resetForm();
    }
  }, [lancamento, open]);

  useEffect(() => {
    if (!open) {
      pararCamera();
      // Limpar object URLs
      previews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      numeroNotaFiscal: "",
      valor: "",
      dataEmissao: "",
      xmlPath: "",
    });
    setImagens([]);
    setPreviews([]);
    setValidationErrors({});
    setModoCamera(false);
  };

  const iniciarCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setModoCamera(true);
    } catch (error) {
      console.error("Erro ao acessar a câmera:", error);
      toast.error(
        "Não foi possível acessar a câmera. Verifique as permissões.",
      );
    }
  };

  const pararCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setModoCamera(false);
  };

  const capturarFoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");

      if (context) {
        context.drawImage(videoRef.current, 0, 0);
        const base64 = canvas.toDataURL("image/jpeg", 0.8);

        setImagens((prev) => [...prev, base64]);
        setPreviews((prev) => [...prev, base64]);
        pararCamera();
        toast.success("Foto capturada!");
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        setImagens((prev) => [...prev, file]);
        setPreviews((prev) => [...prev, URL.createObjectURL(file)]);
      }
    });

    event.target.value = "";
  };

  const handleXmlUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          xmlPath: e.target?.result as string,
        }));
        toast.success("XML carregado!");
      };
      reader.readAsText(file);
    }
    event.target.value = "";
  };

  const removerImagem = (index: number) => {
    if (previews[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(previews[index]);
    }

    setImagens((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSalvar = async () => {
    setValidationErrors({});

    try {
      // Validar com Zod
      lancamentoSchema.parse({
        ...formData,
        imagens,
      });

      setIsUploading(true);
      const toastId = toast.loading("Fazendo upload das imagens...");

      try {
        // Upload das imagens para o Supabase
        const imageUrls = await uploadImagens(imagens);

        toast.success("Upload concluído!", { id: toastId });

        // Obter localização (você pode usar geolocation API aqui)
        const latitude = -23.5505 + (Math.random() - 0.5) * 0.01;
        const longitude = -46.6333 + (Math.random() - 0.5) * 0.01;

        // Criar DTO para enviar ao backend
        const dados: CriarLancamentoDTO = {
          // Dados da nota fiscal
          numeroNotaFiscal: formData.numeroNotaFiscal,
          valor: parseFloat(formData.valor),
          dataEmissao: new Date(formData.dataEmissao),
          xmlPath: formData.xmlPath || undefined,

          // Dados do lançamento
          latitude,
          longitude,
          data_lancamento: new Date(),

          // URLs das imagens
          imagensUrls: imageUrls,

          // IDs relacionados
          usuarioId,
          empresaId,
        };

        onSalvar(dados);
        resetForm();
        onOpenChange(false);
        toast.success("Lançamento salvo com sucesso!");
      } catch (uploadError: any) {
        console.error("Erro no upload:", uploadError);
        toast.error(uploadError.message || "Erro ao fazer upload das imagens", {
          id: toastId,
        });
      } finally {
        setIsUploading(false);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            errors[error.path[0] as string] = error.message;
          }
        });
        setValidationErrors(errors);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-600">
            {lancamento ? "Editar Lançamento" : "Novo Lançamento"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da nota fiscal e adicione fotos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dados da Nota Fiscal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroNotaFiscal">Nº da Nota Fiscal *</Label>
              <Input
                id="numeroNotaFiscal"
                type="text"
                value={formData.numeroNotaFiscal}
                onChange={(e) =>
                  setFormData({ ...formData, numeroNotaFiscal: e.target.value })
                }
                placeholder="Ex: 123456"
                className={
                  validationErrors.numeroNotaFiscal ? "border-red-500" : ""
                }
              />
              {validationErrors.numeroNotaFiscal && (
                <p className="text-sm text-red-600">
                  {validationErrors.numeroNotaFiscal}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                id="valor"
                type="text"
                value={formData.valor}
                onChange={(e) =>
                  setFormData({ ...formData, valor: e.target.value })
                }
                placeholder="0.00"
                className={validationErrors.valor ? "border-red-500" : ""}
              />
              {validationErrors.valor && (
                <p className="text-sm text-red-600">{validationErrors.valor}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataEmissao">Data de Emissão *</Label>
              <Input
                id="dataEmissao"
                type="date"
                value={formData.dataEmissao}
                onChange={(e) =>
                  setFormData({ ...formData, dataEmissao: e.target.value })
                }
                className={validationErrors.dataEmissao ? "border-red-500" : ""}
              />
              {validationErrors.dataEmissao && (
                <p className="text-sm text-red-600">
                  {validationErrors.dataEmissao}
                </p>
              )}
            </div>
          </div>

          {/* XML Upload */}
          <div className="space-y-2">
            <Label htmlFor="xml">XML da Nota Fiscal (Opcional)</Label>
            <div className="flex gap-2">
              <Input
                id="xml"
                value={formData.xmlPath ? "Arquivo XML carregado ✓" : ""}
                placeholder="Faça upload do arquivo XML"
                readOnly
                className="flex-1 cursor-pointer"
                onClick={() => document.getElementById("xmlFile")?.click()}
              />
              <input
                type="file"
                id="xmlFile"
                accept=".xml"
                onChange={handleXmlUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("xmlFile")?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload XML
              </Button>
            </div>
          </div>

          {/* Seção de Imagens */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Fotos da Nota Fiscal *</Label>
              <span className="text-sm text-gray-500">
                {imagens.length} foto(s) adicionada(s)
              </span>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Selecionar Arquivos
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={modoCamera ? pararCamera : iniciarCamera}
                className="flex-1"
                disabled={isUploading}
              >
                <Camera className="w-4 h-4 mr-2" />
                {modoCamera ? "Fechar Câmera" : "Usar Câmera"}
              </Button>
            </div>

            {validationErrors.imagens && (
              <Alert variant="destructive">
                <AlertDescription>{validationErrors.imagens}</AlertDescription>
              </Alert>
            )}

            {/* Preview da Câmera */}
            {modoCamera && (
              <Card className="border-2 border-indigo-200">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-80 object-cover rounded-lg bg-black"
                    />
                    <Button
                      onClick={capturarFoto}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      size="lg"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Capturar Foto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Grid de Imagens */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <Card key={index} className="relative group overflow-hidden">
                    <CardContent className="p-0">
                      <img
                        src={preview}
                        alt={`Nota fiscal ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removerImagem(index)}
                          className="gap-2"
                          disabled={isUploading}
                        >
                          <Trash2 className="w-4 h-4" />
                          Remover
                        </Button>
                      </div>
                      <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Estado Vazio */}
            {previews.length === 0 && !modoCamera && (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-12 text-center">
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2 font-medium">
                    Nenhuma imagem adicionada
                  </p>
                  <p className="text-sm text-gray-500">
                    Adicione fotos da nota fiscal usando a câmera ou
                    selecionando arquivos
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 justify-end pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              resetForm();
            }}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSalvar}
            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-32"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>{lancamento ? "Atualizar" : "Salvar"} Lançamento</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalLancamento;
