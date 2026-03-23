import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  className?: string;
  sinPadding?: boolean;
  conNavegacionInferior?: boolean;
};

export default function ContenedorPantalla({
  children,
  className,
  sinPadding = false,
  conNavegacionInferior = false,
}: Props) {
  return (
    <main
      className={clsx(
        "min-h-screen w-full bg-white",
        !sinPadding && "px-4 py-4",
        conNavegacionInferior && "pb-24",
        className
      )}
    >
      <div className="mx-auto w-full max-w-md">{children}</div>
    </main>
  );
}