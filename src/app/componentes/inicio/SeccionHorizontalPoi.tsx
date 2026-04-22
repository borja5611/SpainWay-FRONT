import type { ReactNode } from "react";

type Props = {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
};

export default function SeccionHorizontalPoi({
  titulo,
  subtitulo,
  children,
}: Props) {
  return (
    <section className="mt-10">
      <div className="mb-4">
        <h2 className="text-[30px] font-bold text-black">{titulo}</h2>
        <p className="mt-1 text-[14px] leading-[24px] text-[#7c6b69]">
          {subtitulo}
        </p>
      </div>

      <div className="overflow-x-auto overflow-y-hidden pb-3">
        <div className="flex w-max gap-5">{children}</div>
      </div>
    </section>
  );
}