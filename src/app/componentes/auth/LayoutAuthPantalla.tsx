import type { ReactNode } from "react";
import ContenedorPantalla from "@/app/componentes/layout/ContenedorPantalla";
import LogoAuth from "./LogoAuth";

type Props = {
  children: ReactNode;
};

export default function LayoutAuthPantalla({ children }: Props) {
  return (
    <ContenedorPantalla className="flex min-h-screen items-center">
      <div className="w-full">
        <LogoAuth />
        {children}
      </div>
    </ContenedorPantalla>
  );
}