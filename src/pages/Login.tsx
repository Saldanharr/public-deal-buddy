import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Lock, User, LogIn } from "lucide-react";
import logoSAS from "@/assets/logo_SAS_color.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/modulos");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-secondary/5" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">PACTUS</h1>
            <p className="text-sm text-muted-foreground">Plataforma de Acompanhamento de Contratos</p>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Usuário</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="seu.email@gov.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" size="lg">
              <LogIn className="h-4 w-4" />
              Entrar
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Esqueceu a senha? Contate o administrador do sistema.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 — Administração Pública Municipal
        </p>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur px-6 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <p className="text-xs text-muted-foreground">
            Mais inteligência na gestão municipal
          </p>
          <img src={logoSAS} alt="SAS - Superintendência de Análise de Sistema" className="h-10 object-contain" />
        </div>
      </footer>
    </div>
  );
};

export default Login;
