import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Lock,
  Unlock,
  Calendar,
  DollarSign,
  FileText,
  Image,
  X,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface ViewPeriodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period: any;
}

const ViewPeriodModal = ({
  open,
  onOpenChange,
  period,
}: ViewPeriodModalProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!period) return null;

  const openImageGallery = (images: string[], startIndex = 0) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
    setImageModalOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < selectedImages.length - 1 ? prev + 1 : 0,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : selectedImages.length - 1,
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold text-indigo-600">
                  Detalhes do Período
                </DialogTitle>
                <DialogDescription>
                  Visualize todas as notas fiscais e imagens deste período
                </DialogDescription>
              </div>
              <Badge
                variant={period.fechado ? "secondary" : "default"}
                className={
                  period.fechado
                    ? "bg-gray-100 text-gray-700"
                    : "bg-green-100 text-green-700"
                }
              >
                {period.fechado ? (
                  <>
                    <Lock className="w-3 h-3 mr-1" />
                    Fechado
                  </>
                ) : (
                  <>
                    <Unlock className="w-3 h-3 mr-1" />
                    Aberto
                  </>
                )}
              </Badge>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {/* Informações do Período */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-indigo-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Período</p>
                      <p className="font-semibold">
                        {new Date(period.dataInicio).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                      <p className="text-sm text-gray-600">até</p>
                      <p className="font-semibold">
                        {new Date(period.dataFim).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Valor Total</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(period.valorTotal || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Total de Notas</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {period.lancamentos?.length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data de Fechamento */}
            {period.fechado && period.dataFechamento && (
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Data de Fechamento
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(period.dataFechamento).toLocaleString("pt-BR")}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Observações */}
            {period.observacoes && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-amber-800 mb-2">
                    Observações
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {period.observacoes}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Lista de Notas Fiscais */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Notas Fiscais ({period.lancamentos?.length || 0})
              </h3>

              {!period.lancamentos || period.lancamentos.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">
                      Nenhuma nota fiscal neste período
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Accordion type="single" collapsible className="space-y-2">
                  {period.lancamentos.map((lancamento: any, index: number) => (
                    <AccordionItem
                      key={lancamento.id}
                      value={`item-${lancamento.id}`}
                      className="border rounded-lg"
                    >
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="font-mono">
                              #{index + 1}
                            </Badge>
                            <div className="text-left">
                              <p className="font-semibold">
                                NF: {lancamento.notaFiscal?.numero}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(
                                  lancamento.data_lancamento,
                                ).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary">
                              <Image className="w-3 h-3 mr-1" />
                              {lancamento.imagens?.length || 0}
                            </Badge>
                            <p className="font-bold text-green-600">
                              {formatCurrency(lancamento.notaFiscal?.valor || 0)}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4 pt-2">
                          {/* Informações da Nota */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-xs text-gray-500">
                                Número da Nota
                              </p>
                              <p className="font-semibold">
                                {lancamento.notaFiscal?.numero}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Valor</p>
                              <p className="font-semibold text-green-600">
                                {formatCurrency(lancamento.notaFiscal?.valor || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Data Emissão
                              </p>
                              <p className="font-medium">
                                {new Date(
                                  lancamento.notaFiscal?.dataEmissao,
                                ).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Lançado por
                              </p>
                              <p className="font-medium">
                                {lancamento.usuarios?.nome || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Galeria de Imagens */}
                          {lancamento.imagens &&
                            lancamento.imagens.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold mb-2">
                                  Imagens da Nota Fiscal (
                                  {lancamento.imagens.length})
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {lancamento.imagens.map(
                                    (imagem: any, imgIndex: number) => (
                                      <Card
                                        key={imagem.id}
                                        className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group"
                                        onClick={() =>
                                          openImageGallery(
                                            lancamento.imagens.map(
                                              (img: any) => img.url,
                                            ),
                                            imgIndex,
                                          )
                                        }
                                      >
                                        <CardContent className="p-0 relative">
                                          <img
                                            src={imagem.url}
                                            alt={`Nota ${lancamento.notaFiscal?.numero} - Imagem ${imgIndex + 1}`}
                                            className="w-full h-32 object-cover"
                                          />
                                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white text-sm font-semibold">
                                              Clique para ampliar
                                            </p>
                                          </div>
                                          <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                                            {imgIndex + 1}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Localização */}
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs text-blue-600 font-semibold mb-1">
                              Localização do Lançamento
                            </p>
                            <p className="text-sm text-gray-700">
                              Lat: {lancamento.latitude?.toFixed(6)}, Lng:{" "}
                              {lancamento.longitude?.toFixed(6)}
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>

          <div className="border-t pt-4 flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Galeria de Imagens */}
      <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                Galeria de Imagens ({currentImageIndex + 1} de{" "}
                {selectedImages.length})
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImageModalOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedImages.length > 0 && (
            <div className="space-y-4">
              {/* Imagem Principal */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <img
                  src={selectedImages[currentImageIndex]}
                  alt={`Imagem ${currentImageIndex + 1}`}
                  className="w-full h-[60vh] object-contain"
                />

                {/* Navegação */}
                {selectedImages.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                      onClick={prevImage}
                    >
                      ←
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                      onClick={nextImage}
                    >
                      →
                    </Button>
                  </>
                )}

                {/* Indicador */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedImages.length}
                </div>
              </div>

              {/* Miniaturas */}
              {selectedImages.length > 1 && (
                <div className="grid grid-cols-6 gap-2 max-h-24 overflow-y-auto">
                  {selectedImages.map((url, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer overflow-hidden ${
                        index === currentImageIndex
                          ? "ring-2 ring-indigo-600"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <CardContent className="p-0">
                        <img
                          src={url}
                          alt={`Miniatura ${index + 1}`}
                          className="w-full h-16 object-cover"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <p className="text-sm text-gray-500">
              Use as setas ← → para navegar entre as imagens
            </p>
            <Button variant="outline" onClick={() => setImageModalOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewPeriodModal;
