// src/components/ModalLancamento.tsx
import { useState, useRef, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, RotateCcw, Upload, X } from "lucide-react";
import Release from "@/pages/features/create.release";

interface ModalLancamentoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lancamento: Lancamento | null;
  onSalvar: (dados: Partial<Lancamento>) => void;
}

const ModalLancamento = ({
  open,
  onOpenChange,
  lancamento,
  onSalvar,
}: ModalLancamentoProps) => {
  const [valor, setValor] = useState("");
  const [notaFiscalId, setNotaFiscalId] = useState("");
  const [xml, setXml] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [modoCamera, setModoCamera] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (lancamento) {
      setValor(lancamento.valor?.toString() || "");
      setNotaFiscalId(lancamento.notaFiscalId.toString());
      setXml(lancamento.xml || "");
      setImagem(lancamento.imagem || null);
    } else {
      resetForm();
    }
  }, [lancamento, open]);

  const resetForm = () => {
    setValor("");
    setNotaFiscalId("");
    setXml("");
    setImagem(null);
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
      alert("Não foi possível acessar a câmera. Verifique as permissões.");
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
        const imageData = canvas.toDataURL("image/jpeg");
        setImagem(imageData);
        pararCamera();
      }
    }
  };

  const handleSalvar = () => {
    // Simular obtenção de localização
    const latitude = -23.5505 + (Math.random() - 0.5) * 0.01;
    const longitude = -46.6333 + (Math.random() - 0.5) * 0.01;

    const dados: Partial<Lancamento> = {
      valor: parseFloat(valor) || 0,
      notaFiscalId: parseInt(notaFiscalId) || 0,
      xml: xml || undefined,
      imagem: imagem || undefined,
      latitude,
      longitude,
    };

    onSalvar(dados);
    resetForm();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setXml(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lancamento ? "Editar Lançamento" : "Novo Lançamento"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do lançamento da nota fiscal
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna 1: Dados Básicos */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notaFiscalId">Nº da Nota Fiscal</Label>
              <Input
                id="notaFiscalId"
                type="number"
                value={notaFiscalId}
                onChange={(e) => setNotaFiscalId(e.target.value)}
                placeholder="Digite o número da nota fiscal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="xml">XML da Nota Fiscal (Opcional)</Label>
              <div className="flex gap-2">
                <Input
                  id="xml"
                  value={xml}
                  onChange={(e) => setXml(e.target.value)}
                  placeholder="Cole o XML ou faça upload"
                  className="flex-1"
                />
                <input
                  type="file"
                  id="xmlFile"
                  accept=".xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Label htmlFor="xmlFile" asChild>
                  <Button type="button" variant="outline" className="shrink-0">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </Label>
              </div>
            </div>
          </div>

          {/* Coluna 2: Captura de Imagem */}
          <div className="space-y-4">
            <Label>Foto da Nota Fiscal</Label>

            {!modoCamera && !imagem && (
              <Card className="border-2 border-dashed border-gray-300">
                <CardContent className="p-6 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Capture uma foto da nota fiscal
                  </p>
                  <Button
                    onClick={iniciarCamera}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Usar Câmera
                  </Button>
                </CardContent>
              </Card>
            )}

            {modoCamera && (
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={capturarFoto}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Capturar Foto
                      </Button>
                      <Button onClick={pararCamera} variant="outline">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {imagem && !modoCamera && (
              <Card>
                <CardContent className="p-4">
                  <div className="relative">
                    <img
                      src={imagem}
                      alt="Nota fiscal capturada"
                      className="w-full h-64 object-contain rounded-lg bg-gray-100"
                    />
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => setImagem(null)}
                        variant="outline"
                        className="flex-1"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Refazer Foto
                      </Button>
                      <Button onClick={iniciarCamera} variant="outline">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
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
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSalvar}
            disabled={!notaFiscalId || !valor || !imagem}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {lancamento ? "Atualizar" : "Salvar"} Lançamento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalLancamento;
