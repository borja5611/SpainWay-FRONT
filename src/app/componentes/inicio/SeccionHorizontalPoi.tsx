import type { ReactNode } from "react";

type Props = {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
};

export default function SeccionHorizontalPoi({
  titulo,
  subtitulo,
  children,
}: Props) {
  return (
    <section className="mt-10">
      <div className="mb-4 px-4">
        <h2 className="text-[30px] font-bold text-black">{titulo}</h2>
        {subtitulo && (
          <p className="mt-1 text-[14px] text-[#7c6b69]">{subtitulo}</p>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto px-4 pb-2">{children}</div>
    </section>
  );
}