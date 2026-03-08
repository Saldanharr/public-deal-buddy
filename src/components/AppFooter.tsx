import logoSAS from "@/assets/logo_SAS_color.png";

const AppFooter = () => {
  return (
    <footer className="border-t border-border bg-card px-6 py-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          © 2026 — Administração Pública Municipal
        </p>
        <img src={logoSAS} alt="SAS - Superintendência de Análise de Sistema" className="h-10 object-contain" />
      </div>
    </footer>
  );
};

export default AppFooter;
