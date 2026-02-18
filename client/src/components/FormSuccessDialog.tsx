import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, Mail, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formType: "quote" | "contact";
}

export function FormSuccessDialog({ open, onOpenChange, formType }: FormSuccessDialogProps) {
  const title = formType === "quote" 
    ? "Pedido de Orçamento Recebido!" 
    : "Mensagem Enviada com Sucesso!";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#6cca7d] flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Obrigado pelo seu interesse! A sua mensagem foi enviada com sucesso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Próximos Passos */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground">Próximos Passos:</h3>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3ac6ff]/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#3ac6ff]" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">1. Análise do Pedido</h4>
                <p className="text-sm text-muted-foreground">
                  A nossa equipa irá analisar o seu pedido nas próximas 24 horas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6cca7d]/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#6cca7d]" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">2. Contacto Telefónico</h4>
                <p className="text-sm text-muted-foreground">
                  Entraremos em contacto por telefone para esclarecer detalhes e agendar uma visita técnica.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d7e028]/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#d7e028]" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">3. Proposta Personalizada</h4>
                <p className="text-sm text-muted-foreground">
                  Receberá uma proposta detalhada por email com simulação de poupança e retorno do investimento.
                </p>
              </div>
            </div>
          </div>

          {/* Informação de Contacto */}
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground text-center">
              Tem alguma dúvida urgente? Entre em contacto connosco:
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <a 
                href="tel:+351938719773" 
                className="text-sm font-medium text-[#3ac6ff] hover:underline"
              >
                +351 938 719 773
              </a>
              <span className="text-muted-foreground">|</span>
              <a 
                href="mailto:geral@bluemagnitude.pt" 
                className="text-sm font-medium text-[#3ac6ff] hover:underline"
              >
                geral@bluemagnitude.pt
              </a>
            </div>
          </div>

          {/* Botão de Fechar */}
          <Button 
            onClick={() => onOpenChange(false)} 
            className="w-full bg-[#6cca7d] hover:bg-[#5bb96d] text-white"
            size="lg"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
