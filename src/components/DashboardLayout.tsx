import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import AppFooter from "./AppFooter";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
        <AppFooter />
      </div>
    </div>
  );
};

export default DashboardLayout;
