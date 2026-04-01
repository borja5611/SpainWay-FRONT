type Props = {
  titulo: string;
  descripcion: string;
};

export default function BloqueInfoInicio({ titulo, descripcion }: Props) {
  return (
    <div className="rounded-[22px] border border-[#eceae5] bg-white p-4 shadow-sm">
      <h3 className="text-[18px] font-semibold text-black">{titulo}</h3>
      <p className="mt-2 text-[14px] leading-[24px] text-[#6d6d6d]">
        {descripcion}
      </p>
    </div>
  );
}