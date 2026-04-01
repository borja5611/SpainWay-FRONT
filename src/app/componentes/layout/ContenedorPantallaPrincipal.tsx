import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function ContenedorPantallaPrincipal({
  children,
  className = "",
}: Props) {
  return (
    <main className={`mx-auto w-full max-w-[980px] px-4 pt-4 pb-40 ${className}`}>
      {children}
    </main>
  );
}