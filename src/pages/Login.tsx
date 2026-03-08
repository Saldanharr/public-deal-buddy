import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, LogIn } from "lucide-react";
import logoImg from "@/assets/logo-pactus.png";
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
          <img src={logoImg} alt="PACTUS - Plataforma de Acompanhamento de Contratos" className="h-20 object-contain" />
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
    </div>
  );
};

export default Login;
