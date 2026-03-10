import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const submitLeadMutation = trpc.forms.submitLead.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.name.trim()) {
      toast.error("Por favor, preencha o nome");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Por favor, preencha o email");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Por favor, preencha o telefone");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Por favor, preencha a mensagem");
      return;
    }

    try {
      await submitLeadMutation.mutateAsync(formData);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      // Mostrar mensagem de sucesso por 5 segundos
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error: any) {
      const errorMessage = error?.message || "Erro ao enviar formulário";
      toast.error(errorMessage);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
            <h2 className="text-2xl font-bold text-slate-900">Obrigado!</h2>
            <p className="text-slate-600 text-center">
              Obrigado pelo seu contacto. A nossa equipa irá responder brevemente.
            </p>
            <p className="text-sm text-slate-500 text-center mt-4">
              Redirecionando em breve...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Contacte-nos</h1>
          <p className="text-slate-600 mt-2">
            Preencha o formulário abaixo e a nossa equipa entrará em contacto brevemente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="912345678"
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Mensagem *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Descreva o seu interesse ou dúvida..."
              rows={5}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={submitLeadMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {submitLeadMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                A enviar...
              </>
            ) : (
              "Enviar Mensagem"
            )}
          </Button>

          {submitLeadMutation.isError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-600">
                {submitLeadMutation.error?.message || "Erro ao enviar formulário"}
              </p>
            </div>
          )}
        </form>

        <p className="text-xs text-slate-500 text-center mt-6">
          Os seus dados serão utilizados apenas para responder ao seu contacto.
        </p>
      </Card>
    </div>
  );
}
