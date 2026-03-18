"use client";
import { useAuth } from "@/_core/hooks/useAuth";
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
import { Search, Mail, Phone, MapPin, Calendar, TrendingUp, Users, CheckCircle2, Archive, Download, Loader2, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
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

  const handleExportExcel = () => {
    try {
      setIsExporting(true);
      if (!quotes || quotes.length === 0) {
        toast.error("Nenhum orçamento para exportar");
        setIsExporting(false);
        return;
      }

      const quotesData = quotes.map(q => ({
        ID: q.id,
        Nome: q.name,
        Email: q.email,
        Telefone: q.phone,
        Distrito: q.city,
        Status: q.status === 'new' ? 'Novo' : q.status === 'contacted' ? 'Contactado' : q.status === 'converted' ? 'Convertido' : 'Arquivado',
        Notas: q.notes || "",
        "Data de Criacao": new Date(q.createdAt).toLocaleString('pt-PT'),
      }));

      const worksheet = XLSX.utils.json_to_sheet(quotesData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orcamentos");
      
      const colWidths = [
        { wch: 8 },
        { wch: 20 },
        { wch: 25 },
        { wch: 15 },
        { wch: 20 },
        { wch: 12 },
        { wch: 30 },
        { wch: 20 },
      ];
      worksheet["!cols"] = colWidths;

      XLSX.writeFile(workbook, `Orcamentos_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Orçamentos exportados com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar orçamentos");
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
            {user?.role === "admin" && (
              <Button 
                onClick={handleExportExcel} 
                disabled={isExporting || !quotes || quotes.length === 0}
                className="bg-green-600 hover:bg-green-700"
                title="Exportar todos os orçamentos para Excel"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    A exportar...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Exportar Excel
                  </>
                )}
              </Button>
            )}
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

        {/* Search and Filter */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Procurar por nome, email, telefone ou localidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="new">Novo</SelectItem>
              <SelectItem value="contacted">Contactado</SelectItem>
              <SelectItem value="converted">Convertido</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Localidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredQuotes && filteredQuotes.length > 0 ? (
                  filteredQuotes.map((quote) => (
                    <TableRow key={quote.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{quote.name}</TableCell>
                      <TableCell className="text-sm text-slate-600">{quote.email}</TableCell>
                      <TableCell className="text-sm">{quote.phone}</TableCell>
                      <TableCell className="text-sm">{quote.city}</TableCell>
                      <TableCell>{getStatusBadge(quote.status)}</TableCell>
                      <TableCell className="text-sm text-slate-500">{formatDate(quote.createdAt)}</TableCell>
                      <TableCell>
                        <Select value={quote.status} onValueChange={(newStatus) => handleStatusChange(quote.id, newStatus)}>
                          <SelectTrigger className="w-32">
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      Nenhum orçamento encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
