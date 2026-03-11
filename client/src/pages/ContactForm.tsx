import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const DISTRITOS_PORTUGAL = [
  "Aveiro",
  "Beja",
  "Braga",
  "Bragança",
  "Castelo Branco",
  "Coimbra",
  "Évora",
  "Faro",
  "Guarda",
  "Leiria",
  "Lisboa",
  "Portalegre",
  "Porto",
  "Santarém",
  "Setúbal",
  "Viana do Castelo",
  "Vila Real",
  "Viseu",
];

function DistrictDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative" data-testid="district-dropdown">
      {/* Trigger button */}
      <div
        onClick={() => setOpen(!open)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs cursor-pointer transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value || "Selecione um distrito"}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown list */}
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-input bg-white shadow-lg animate-in fade-in-0 zoom-in-95">
          {DISTRITOS_PORTUGAL.map((distrito) => (
            <div
              key={distrito}
              onClick={() => {
                onChange(distrito);
                setOpen(false);
              }}
              className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors hover:bg-blue-50 hover:text-blue-700 ${
                value === distrito
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-700"
              }`}
              role="option"
              aria-selected={value === distrito}
            >
              {distrito}
              {value === distrito && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    district: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const submitLeadMutation = trpc.forms.submitLead.useMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDistrictChange = (district: string) => {
    setFormData((prev) => ({
      ...prev,
      district,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    if (!formData.district) {
      toast.error("Por favor, selecione um distrito");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Por favor, preencha a mensagem");
      return;
    }

    try {
      await submitLeadMutation.mutateAsync(formData);
      toast.success(
        "Obrigado pelo seu contacto. A nossa equipa irá responder brevemente."
      );
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        district: "",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("[LeadForm] Erro na submissão:", error);
      toast.error("Erro ao enviar o formulário. Por favor, tente novamente.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Obrigado!</h2>
          <p className="text-slate-600">
            Obrigado pelo seu contacto. A nossa equipa irá responder brevemente.
          </p>
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
            Preencha o formulário abaixo e a nossa equipa entrará em contacto
            brevemente.
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
            <Label>Distrito *</Label>
            <DistrictDropdown
              value={formData.district}
              onChange={handleDistrictChange}
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
            className="w-full"
          >
            {submitLeadMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Mensagem"
            )}
          </Button>
        </form>

        <p className="text-xs text-slate-500 mt-4 text-center">
          Os seus dados serão utilizados apenas para responder ao seu contacto.
        </p>
      </Card>
    </div>
  );
}
