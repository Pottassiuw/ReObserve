// src/pages/LancamentosPage.tsx
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Camera,
  FileText,
  MapPin,
  Calendar,
} from "lucide-react";
import ReleaseModal from "@/components/releaseModal";

export interface Lancamento {
  id: number;
  data_lancamento: Date;
  latitude: number;
  longitude: number;
  dataCriacao: Date;
  dataAtualizacao: Date;
  periodoId?: number;
  notaFiscalId: number;
  usuarioId: number;
  empresaId: number;
  valor?: number;
  xml?: string;
  imagem?: string;
}

export default function ReleasePage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lancamentoEditando, setLancamentoEditando] =
    useState<Lancamento | null>(null);

  // Mock data - na aplicação real, viria da API
  useEffect(() => {
    const mockLancamentos: Lancamento[] = [
      {
        id: 1,
        data_lancamento: new Date("2024-01-15"),
        latitude: -23.5505,
        longitude: -46.6333,
        dataCriacao: new Date("2024-01-15"),
        dataAtualizacao: new Date("2024-01-15"),
        notaFiscalId: 12345,
        usuarioId: 1,
        empresaId: 1,
        valor: 1500.75,
      },
      {
        id: 2,
        data_lancamento: new Date("2024-01-16"),
        latitude: -23.5489,
        longitude: -46.6388,
        dataCriacao: new Date("2024-01-16"),
        dataAtualizacao: new Date("2024-01-16"),
        notaFiscalId: 12346,
        usuarioId: 1,
        empresaId: 1,
        valor: 2300.5,
      },
    ];
    setLancamentos(mockLancamentos);
  }, []);

  const handleNovoLancamento = () => {
    setLancamentoEditando(null);
    setIsModalOpen(true);
  };

  const handleEditarLancamento = (lancamento: Lancamento) => {
    setLancamentoEditando(lancamento);
    setIsModalOpen(true);
  };

  const handleSalvarLancamento = (dados: Partial<Lancamento>) => {
    if (lancamentoEditando) {
      // Editar existente
      setLancamentos((prev) =>
        prev.map((l) =>
          l.id === lancamentoEditando.id
            ? { ...l, ...dados, dataAtualizacao: new Date() }
            : l,
        ),
      );
    } else {
      // Novo lançamento
      const novoLancamento: Lancamento = {
        id: Math.max(0, ...lancamentos.map((l) => l.id)) + 1,
        data_lancamento: new Date(),
        latitude: dados.latitude || 0,
        longitude: dados.longitude || 0,
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
        notaFiscalId: dados.notaFiscalId || 0,
        usuarioId: 1, // Do contexto
        empresaId: 1, // Do contexto
        valor: dados.valor,
        xml: dados.xml,
        imagem: dados.imagem,
      };
      setLancamentos((prev) => [...prev, novoLancamento]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lançamentos</h1>
            <p className="text-gray-600 mt-2">
              Gerencie seus lançamentos de notas fiscais
            </p>
          </div>
          <Button
            onClick={handleNovoLancamento}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Lançamento
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {lancamentos.length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Este Mês</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      lancamentos.filter(
                        (l) =>
                          new Date(l.data_lancamento).getMonth() ===
                          new Date().getMonth(),
                      ).length
                    }
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Valor Total
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    R${" "}
                    {lancamentos
                      .reduce((acc, l) => acc + (l.valor || 0), 0)
                      .toFixed(2)}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Lançamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Lançamentos</CardTitle>
            <CardDescription>
              Todos os lançamentos de notas fiscais realizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Nota Fiscal</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lancamentos.map((lancamento) => (
                  <TableRow key={lancamento.id}>
                    <TableCell className="font-medium">
                      {lancamento.id}
                    </TableCell>
                    <TableCell>
                      {new Date(lancamento.data_lancamento).toLocaleDateString(
                        "pt-BR",
                      )}
                    </TableCell>
                    <TableCell>#{lancamento.notaFiscalId}</TableCell>
                    <TableCell>
                      {lancamento.valor
                        ? `R$ ${lancamento.valor.toFixed(2)}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {lancamento.latitude.toFixed(4)},{" "}
                      {lancamento.longitude.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditarLancamento(lancamento)}
                          >
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modal */}
        <ReleaseModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          lancamento={lancamentoEditando}
          onSalvar={handleSalvarLancamento}
        />
      </div>
    </div>
  );
}
