import type { ReactNode } from "react";

type Props = {
  titulo: string;
  children: ReactNode;
};

export default function SeccionInicio({ titulo, children }: Props) {
  return (
    <section className="mt-8">
      <h2 className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-black mb-4">
        {titulo}
      </h2>
      {children}
    </section>
  );
}