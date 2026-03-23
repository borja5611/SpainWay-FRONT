import type { ReactNode } from "react";

type Props = {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
};

export default function AuthCard({ titulo, subtitulo, children }: Props) {
  return (
    <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{titulo}</h1>
        {subtitulo ? (
          <p className="mt-2 text-sm text-gray-500">{subtitulo}</p>
        ) : null}
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}