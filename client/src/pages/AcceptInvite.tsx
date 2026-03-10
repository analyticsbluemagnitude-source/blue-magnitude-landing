import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AcceptInvite() {
  const { token } = useParams<{ token: string }>();
  const [, navigate] = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteValid, setInviteValid] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Verify invite token
    const verifyInvite = async () => {
      try {
        const response = await fetch(`/api/verify-invite/${token}`);
        if (!response.ok) {
          setError("Convite inválido ou expirado");
          setInviteValid(false);
          return;
        }
        
        const data = await response.json();
        setEmail(data.email);
        setInviteValid(true);
      } catch (err) {
        setError("Erro ao verificar convite");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyInvite();
    }
  }, [token]);

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Token de convite não encontrado");
      return;
    }

    try {
      setSubmitting(true);
      
      // Accept the invite and redirect to OAuth login
      const response = await fetch(`/api/accept-invite/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Erro ao aceitar convite");
      }

      toast.success("Convite aceite! Redirecionando para login...");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = `/api/oauth/login?returnPath=${encodeURIComponent("/dashboard")}`;
      }, 1500);
    } catch (err) {
      toast.error("Erro ao aceitar convite");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-slate-600">A verificar convite...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !inviteValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
            <h1 className="text-xl font-bold text-slate-900">Convite Inválido</h1>
            <p className="text-slate-600 text-center">{error || "Este convite não é válido ou já expirou."}</p>
            <Button asChild className="w-full mt-4">
              <a href="/">Voltar ao Site</a>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-4 mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
          <h1 className="text-2xl font-bold text-slate-900">Bem-vindo!</h1>
          <p className="text-slate-600 text-center">Você foi convidado para aceder ao Dashboard de Leads da Blue Magnitude</p>
        </div>

        <form onSubmit={handleAcceptInvite} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-slate-100"
            />
            <p className="text-xs text-slate-500 mt-1">Este email foi convidado para aceder ao Dashboard</p>
          </div>

          <Button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                A processar...
              </>
            ) : (
              "Aceitar Convite e Fazer Login"
            )}
          </Button>

          <Button asChild variant="outline" className="w-full">
            <a href="/">Cancelar</a>
          </Button>
        </form>

        <p className="text-xs text-slate-500 text-center mt-6">
          Após aceitar o convite, será redirecionado para fazer login com a sua conta.
        </p>
      </Card>
    </div>
  );
}
