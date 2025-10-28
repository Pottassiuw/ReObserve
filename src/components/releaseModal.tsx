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
import { Camera, Upload, Trash2, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Lancamento, CriarLancamentoDTO } from "@/types/index";
import { uploadImagens } from "@/utils/supabase-sdk";

interface ReleaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  release: Lancamento | null;
  mode: "view" | "edit" | "create";
  onSave: (data: CriarLancamentoDTO) => void;
  usuarioId: number;
  empresaId: number;
}

const validationSchema = z.object({
  numeroNotaFiscal: z.string().min(1, "Número da nota é obrigatório"),
  valor: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Digite um valor válido maior que zero",
    }),
  dataEmissao: z.string().min(1, "Data de emissão é obrigatória"),
  imagens: z
    .array(z.any())
    .min(1, "Adicione pelo menos uma imagem da nota fiscal"),
});

const ReleaseModal = ({
  open,
  onOpenChange,
  release,
  mode,
  onSave,
  usuarioId,
  empresaId,
}: ReleaseModalProps) => {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    numeroNotaFiscal: "",
    valor: "",
    dataEmissao: "",
    xmlPath: "",
  });

  const [images, setImages] = useState<(File | string)[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar dados do lançamento
  useEffect(() => {
    if (release) {
      setFormData({
        numeroNotaFiscal: release.notaFiscal?.numero || "",
        valor: release.notaFiscal?.valor?.toString() || "",
        dataEmissao: release.notaFiscal?.dataEmissao
          ? new Date(release.notaFiscal.dataEmissao).toISOString().split("T")[0]
          : "",
        xmlPath: release.notaFiscal?.xmlPath || "",
      });

      if (release.imagens && release.imagens.length > 0) {
        const urls = release.imagens.map((img) => img.url);
        setImages(urls);
        setPreviews(urls);
      }
    } else {
      resetForm();
    }
  }, [release, open]);

  // Cleanup ao fechar
  useEffect(() => {
    if (!open) {
      stopCamera();
      cleanupPreviews();
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      numeroNotaFiscal: "",
      valor: "",
      dataEmissao: "",
      xmlPath: "",
    });
    setImages([]);
    setPreviews([]);
    setErrors({});
    setIsCameraActive(false);
  };

  const cleanupPreviews = () => {
    previews.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });
  };

  // Câmera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
      toast.error("Não foi possível acessar a câmera");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");

    if (context) {
      context.drawImage(videoRef.current, 0, 0);
      const base64 = canvas.toDataURL("image/jpeg", 0.8);
      setImages((prev) => [...prev, base64]);
      setPreviews((prev) => [...prev, base64]);
      stopCamera();
      toast.success("Foto capturada!");
    }
  };

  // Upload de arquivos
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        setImages((prev) => [...prev, file]);
        setPreviews((prev) => [...prev, URL.createObjectURL(file)]);
      }
    });

    event.target.value = "";
  };

  const handleXmlUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        xmlPath: e.target?.result as string,
      }));
      toast.success("XML carregado!");
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    if (previews[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(previews[index]);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Salvar
  const handleSave = async () => {
    setErrors({});

    try {
      validationSchema.parse({ ...formData, imagens: images });

      setIsUploading(true);
      const toastId = toast.loading("Fazendo upload das imagens...");

      try {
        const imageUrls = await uploadImagens(images);
        toast.success("Upload concluído!", { id: toastId });

        const latitude = -23.5505 + (Math.random() - 0.5) * 0.01;
        const longitude = -46.6333 + (Math.random() - 0.5) * 0.01;

        const data: CriarLancamentoDTO = {
          numeroNotaFiscal: formData.numeroNotaFiscal,
          valor: parseFloat(formData.valor),
          dataEmissao: new Date(formData.dataEmissao),
          xmlPath: formData.xmlPath || undefined,
          latitude,
          longitude,
          data_lancamento: new Date(),
          imagensUrls: imageUrls,
          usuarioId,
          empresaId,
        };

        onSave(data);
        resetForm();
        onOpenChange(false);
      } catch (uploadError: any) {
        console.error("Erro no upload:", uploadError);
        toast.error(uploadError.message || "Erro ao fazer upload", {
          id: toastId,
        });
      } finally {
        setIsUploading(false);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            validationErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(validationErrors);
      }
    }
  };

  const getTitle = () => {
    if (isViewMode) return "Detalhes do Lançamento";
    if (isEditMode) return "Editar Lançamento";
    return "Novo Lançamento";
  };

  const getDescription = () => {
    if (isViewMode) return "Visualize os dados da nota fiscal";
    return "Preencha os dados da nota fiscal e adicione fotos";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-indigo-600">
            {getTitle()}
          </DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dados da Nota Fiscal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroNotaFiscal">Nº da Nota Fiscal</Label>
              <Input
                id="numeroNotaFiscal"
                value={formData.numeroNotaFiscal}
                onChange={(e) =>
                  setFormData({ ...formData, numeroNotaFiscal: e.target.value })
                }
                disabled={isViewMode}
                className={errors.numeroNotaFiscal ? "border-red-500" : ""}
              />
              {errors.numeroNotaFiscal && (
                <p className="text-sm text-red-600">
                  {errors.numeroNotaFiscal}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                value={formData.valor}
                onChange={(e) =>
                  setFormData({ ...formData, valor: e.target.value })
                }
                disabled={isViewMode}
                className={errors.valor ? "border-red-500" : ""}
              />
              {errors.valor && (
                <p className="text-sm text-red-600">{errors.valor}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataEmissao">Data de Emissão</Label>
              <Input
                id="dataEmissao"
                type="date"
                value={formData.dataEmissao}
                onChange={(e) =>
                  setFormData({ ...formData, dataEmissao: e.target.value })
                }
                disabled={isViewMode}
                className={errors.dataEmissao ? "border-red-500" : ""}
              />
              {errors.dataEmissao && (
                <p className="text-sm text-red-600">{errors.dataEmissao}</p>
              )}
            </div>
          </div>

          {/* XML Upload */}
          {!isViewMode && (
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
          )}

          {/* Seção de Imagens */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Fotos da Nota Fiscal</Label>
              <span className="text-sm text-gray-500">
                {images.length} foto(s)
              </span>
            </div>

            {/* Botões de Ação - apenas em modo de edição/criação */}
            {!isViewMode && (
              <>
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
                    onClick={isCameraActive ? stopCamera : startCamera}
                    className="flex-1"
                    disabled={isUploading}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {isCameraActive ? "Fechar Câmera" : "Usar Câmera"}
                  </Button>
                </div>

                {errors.imagens && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.imagens}</AlertDescription>
                  </Alert>
                )}
              </>
            )}

            {/* Preview da Câmera */}
            {isCameraActive && (
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
                      onClick={capturePhoto}
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
                      {!isViewMode && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(index)}
                            disabled={isUploading}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                          </Button>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Estado Vazio */}
            {previews.length === 0 && !isCameraActive && (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-12 text-center">
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2 font-medium">
                    Nenhuma imagem adicionada
                  </p>
                  {!isViewMode && (
                    <p className="text-sm text-gray-500">
                      Adicione fotos da nota fiscal usando a câmera ou
                      selecionando arquivos
                    </p>
                  )}
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
            {isViewMode ? "Fechar" : "Cancelar"}
          </Button>
          {!isViewMode && (
            <Button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-32"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>{isEditMode ? "Atualizar" : "Salvar"} Lançamento</>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReleaseModal;
