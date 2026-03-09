import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, MapPin, Calendar, TrendingUp, Users, CheckCircle2, Archive, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);

  const { data: quotes, isLoading, refetch } = trpc.quotes.list.useQuery();
  const updateStatusMutation = trpc.quotes.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      refetch();
    },
    onError: () => {
      toast.error("Erro ao atualizar status");
    },
  });

  const filteredQuotes = quotes?.filter((quote) => {
    const matchesSearch =
      searchTerm === "" ||
      quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.phone.includes(searchTerm) ||
      quote.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: quotes?.length || 0,
    new: quotes?.filter((q) => q.status === "new").length || 0,
    contacted: quotes?.filter((q) => q.status === "contacted").length || 0,
    converted: quotes?.filter((q) => q.status === "converted").length || 0,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      new: { variant: "default", label: "Novo" },
      contacted: { variant: "secondary", label: "Contactado" },
      converted: { variant: "outline", label: "Convertido" },
      archived: { variant: "destructive", label: "Arquivado" },
    };

    const config = variants[status] || variants.new;
    return (
      <Badge variant={config.variant} className="font-medium">
        {config.label}
      </Badge>
    );
  };

  const handleStatusChange = (quoteId: number, newStatus: string) => {
    updateStatusMutation.mutate({
      id: quoteId,
      status: newStatus as "new" | "contacted" | "converted" | "archived",
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const response = await fetch("/api/export/leads");
      if (!response.ok) {
        throw new Error("Erro ao exportar leads");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads_bluemagnitude_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Leads exportados com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar leads");
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard de Leads</h1>
            <p className="text-slate-600 mt-1">Gerir pedidos de orçamento</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleExportExcel} 
              disabled={isExporting || !quotes || quotes.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  A exportar...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Excel
                </>
              )}
            </Button>
            <Button asChild variant="outline">
              <a href="/">← Voltar ao Site</a>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Leads</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Novos</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.new}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Contactados</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.contacted}</p>
              </div>
              <Phone className="w-10 h-10 text-yellow-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Convertidos</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.converted}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-purple-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Pesquisar por nome, email, telefone ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="new">Novos</SelectItem>
                <SelectItem value="contacted">Contactados</SelectItem>
                <SelectItem value="converted">Convertidos</SelectItem>
                <SelectItem value="archived">Arquivados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">A carregar...</div>
          ) : filteredQuotes && filteredQuotes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-bold">Nome</TableHead>
                  <TableHead className="font-bold">Contacto</TableHead>
                  <TableHead className="font-bold">Localidade</TableHead>
                  <TableHead className="font-bold">Data</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{quote.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <a href={`mailto:${quote.email}`} className="text-blue-600 hover:underline">
                            {quote.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <a href={`tel:${quote.phone}`} className="text-blue-600 hover:underline">
                            {quote.phone}
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {quote.city}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(quote.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(quote.status)}</TableCell>
                    <TableCell>
                      <Select
                        value={quote.status}
                        onValueChange={(value) => handleStatusChange(quote.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Novo</SelectItem>
                          <SelectItem value="contacted">Contactado</SelectItem>
                          <SelectItem value="converted">Convertido</SelectItem>
                          <SelectItem value="archived">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center">
              <Archive className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-medium">Nenhum lead encontrado</p>
              <p className="text-slate-400 text-sm mt-2">
                {searchTerm || statusFilter !== "all"
                  ? "Tente ajustar os filtros de pesquisa"
                  : "Os pedidos de orçamento aparecerão aqui"}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
