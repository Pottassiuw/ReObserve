import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Camera, Plus, X, Upload, FileText, BarChart3 } from "lucide-react";

export default function ReleasePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    photos: [],
    nfNumber: "",
    value: "",
    xml: null,
  });

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleXmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.name.endsWith(".xml")) {
      setFormData((prev) => ({ ...prev, xml: file }));
    }
  };

  const handleSubmit = () => {
    if (!formData.nfNumber || formData.photos.length === 0) return;
    console.log("Lançamento criado:", formData);
    setIsModalOpen(false);
    setFormData({ photos: [], nfNumber: "", value: "", xml: null });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Novo Lançamento</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas notas fiscais de forma simples e eficiente
        </p>
      </div>

      {/* Botão principal de criar lançamento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <div className="rounded-xl border-2 border-dashed border-muted-foreground/25 p-16 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
            <div className="flex h-20 w-20 mx-auto mb-4 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Plus className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Criar Lançamento</h3>
            <p className="text-muted-foreground">
              Clique para registrar uma nova nota fiscal
            </p>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Novo Lançamento de NF-e
            </DialogTitle>
            <DialogDescription>
              Preencha as informações da nota fiscal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            {/* Fotos */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Fotos da Nota Fiscal *
              </label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handlePhotoCapture}
                className="hidden"
                id="camera-input"
              />
              <label
                htmlFor="camera-input"
                className="flex items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent hover:border-primary/50 transition-colors"
              >
                <Camera className="h-5 w-5" />
                <span className="text-sm font-medium">Tirar Foto</span>
              </label>

              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-28 object-cover rounded-lg border-2"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Número NF */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Número da NF-e *</label>
              <input
                type="text"
                placeholder="Ex: 123456"
                value={formData.nfNumber}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nfNumber: e.target.value }))
                }
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor (opcional)</label>
              <input
                type="text"
                placeholder="R$ 0,00"
                value={formData.value}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, value: e.target.value }))
                }
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {/* XML */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Arquivo XML (opcional)
              </label>
              <input
                type="file"
                accept=".xml"
                onChange={handleXmlUpload}
                className="hidden"
                id="xml-input"
              />
              <label
                htmlFor="xml-input"
                className="flex items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent hover:border-primary/50 transition-colors"
              >
                <Upload className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {formData.xml ? formData.xml.name : "Selecionar XML"}
                </span>
              </label>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 border-2 rounded-lg font-medium hover:bg-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!formData.nfNumber || formData.photos.length === 0}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Criar Lançamento
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Estatísticas do Dia
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Lançamentos hoje</span>
              <span className="font-semibold text-lg">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total do dia</span>
              <span className="font-semibold text-lg text-primary">
                R$ 12.450,00
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Últimos Lançamentos
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">NF-e 12347</span>
              <span className="font-semibold">R$ 2.500,00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">NF-e 12346</span>
              <span className="font-semibold">R$ 1.200,00</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm md:col-span-2 lg:col-span-1">
          <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Este Mês
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total de notas</span>
              <span className="font-semibold text-lg">284</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Valor total</span>
              <span className="font-semibold text-lg text-primary">
                R$ 1.234.567,89
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
