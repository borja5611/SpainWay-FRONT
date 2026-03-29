type Props = {
  abierto: boolean;
  onCerrar: () => void;
};

const items = [
  {
    titulo: "Cuenta y perfil",
    descripcion: "Editar tus datos personales y preferencias",
  },
  {
    titulo: "Destinos favoritos",
    descripcion: "Gestiona tus ciudades y lugares guardados",
  },
  {
    titulo: "Itinerarios guardados",
    descripcion: "Consulta tus viajes e itinerarios creados",
  },
  {
    titulo: "Notificaciones",
    descripcion: "Controla avisos, recordatorios y novedades",
  },
  {
    titulo: "Privacidad",
    descripcion: "Gestiona permisos y visibilidad de tu cuenta",
  },
  {
    titulo: "Ayuda y soporte",
    descripcion: "Contacta con soporte o revisa preguntas frecuentes",
  },
  {
    titulo: "Acerca de SpainWay",
    descripcion: "Información general sobre la aplicación",
  },
  {
    titulo: "Cerrar sesión",
    descripcion: "Salir de tu cuenta actual",
  },
];

export default function MenuConfiguracionGlobal({
  abierto,
  onCerrar,
}: Props) {
  if (!abierto) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/35 backdrop-blur-[2px]"
        onClick={onCerrar}
      />

      <aside className="fixed right-0 top-0 z-[70] h-full w-[340px] max-w-[92vw] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="border-b border-[#ececec] bg-white px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[26px] font-bold text-black">Configuración</h2>
              <p className="mt-1 text-[13px] text-[#6d6d6d]">
                Personaliza tu experiencia en SpainWay
              </p>
            </div>

            <button
              type="button"
              onClick={onCerrar}
              className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#f5f5f5] text-[20px] transition hover:bg-[#ebebeb]"
              aria-label="Cerrar menú"
            >
              ×
            </button>
          </div>
        </div>

        <div className="h-[calc(100%-92px)] overflow-y-auto px-4 py-4">
          <div className="space-y-3">
            {items.map((item, index) => (
              <button
                key={item.titulo}
                type="button"
                className={`w-full rounded-[18px] border px-4 py-4 text-left transition ${
                  index === 0
                    ? "border-[#f0d6d2] bg-[#fff7f5]"
                    : "border-[#efefef] bg-white hover:bg-[#fafafa]"
                }`}
              >
                <p className="text-[16px] font-semibold text-black">{item.titulo}</p>
                <p className="mt-1 text-[13px] leading-[20px] text-[#6d6d6d]">
                  {item.descripcion}
                </p>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}