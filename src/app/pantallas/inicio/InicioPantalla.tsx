import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDestinoStore } from "@/app/store/useDestinoStore";
import { ciudadesInicio } from "@/app/datos/mock/inicioDescubrimiento";
import ContenedorPantallaPrincipal from "@/app/componentes/layout/ContenedorPantallaPrincipal";
import ModalRestauracionLocal from "@/app/componentes/inicio/ModalRestauracionLocal";
import type { DestinoId } from "@/app/datos/mock/destinos";

const detallesComunidad: Record<string, { resumen: string; apoyo: string }> = {
  Andalucía: {
    resumen: "Ciudades monumentales, costa y patrimonio con identidad propia.",
    apoyo: "Ideal para mezclar cultura, naturaleza y gastronomía.",
  },
  Asturias: {
    resumen: "Naturaleza, pueblos del norte y mar con ritmo pausado.",
    apoyo: "Perfecta para paisajes verdes, cultura y escapadas con encanto.",
  },
  Baleares: {
    resumen: "Calas, patrimonio y paisajes mediterráneos de gran fuerza visual.",
    apoyo: "Muy buena para viajes relajados, costa y rincones singulares.",
  },
  Canarias: {
    resumen: "Volcanes, playas y arquitectura singular en territorios insulares.",
    apoyo: "Combina mar, naturaleza y rutas escénicas únicas.",
  },
  Cantabria: {
    resumen: "Costa, montaña, cuevas y patrimonio muy equilibrado.",
    apoyo: "Encaja en viajes de naturaleza y rutas con variedad.",
  },
  Cataluña: {
    resumen: "Barcelona, costa y arquitectura mediterránea con mucho contenido.",
    apoyo: "Potente para city break, cultura y escapadas cercanas.",
  },
  "Comunidad Valenciana": {
    resumen: "Mediterráneo, arquitectura y experiencias urbanas con mucha luz.",
    apoyo: "Equilibrada entre ciudad, costa y planes relajados.",
  },
  Madrid: {
    resumen: "Capital cultural con barrios históricos y espacios emblemáticos.",
    apoyo: "Ideal para museos, gastronomía y recorridos flexibles.",
  },
};

function AccionInicioCard({
  etiqueta,
  titulo,
  descripcion,
  icono,
  onClick,
}: {
  etiqueta: string;
  titulo: string;
  descripcion: string;
  icono: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[190px] flex-col justify-between rounded-[30px] bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#98a2b3]">{etiqueta}</p>
        <h3 className="mt-3 text-xl font-black leading-7 text-[#111827]">{titulo}</h3>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#667085]">{descripcion}</p>
      </div>
      <div className="mt-5 grid h-11 w-11 place-items-center rounded-2xl bg-[#fff4ef] text-xl transition group-hover:bg-[#ff5a36] group-hover:text-white">
        {icono}
      </div>
    </button>
  );
}

export default function InicioPantalla() {
  const navigate = useNavigate();
  const setDestinoSeleccionado = useDestinoStore((state) => state.setDestinoSeleccionado);
  const [restauracionAbierta, setRestauracionAbierta] = useState(false);

  const seleccionarDestino = (destinoId: DestinoId) => {
    setDestinoSeleccionado(destinoId);
    navigate("/mapa");
  };

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <ContenedorPantallaPrincipal className="pb-28 pt-3">
        <section className="overflow-hidden rounded-[34px] border border-[#eceae5] bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#fff7f4] via-white to-[#f8f6ff] p-6 md:p-8">
            <p className="text-[12px] font-black uppercase tracking-[0.26em] text-[#ff5a36]">SpainWay</p>
            <h1 className="mt-3 max-w-[760px] text-[34px] font-black leading-[38px] tracking-[-0.05em] text-black md:text-[44px] md:leading-[48px]" style={{ fontFamily: "var(--font-family-display)" }}>
              Planifica, explora y resuelve lo práctico del viaje en un solo sitio
            </h1>
            <p className="mt-4 max-w-[720px] text-[15px] font-semibold leading-7 text-[#667085] md:text-[16px]">
              Elige destino, crea rutas, consulta favoritos y busca restaurantes reales cuando los necesites. Menos texto y más acciones útiles para preparar la escapada.
            </p>
          </div>
        </section>

        <section className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AccionInicioCard
            etiqueta="Crear"
            titulo="Nuevo itinerario"
            descripcion="Genera una ruta personalizada con fechas, ritmo, transporte y zona base."
            icono="✦"
            onClick={() => navigate("/itinerarios/crear")}
          />
          <AccionInicioCard
            etiqueta="Favoritos"
            titulo="POIs guardados"
            descripcion="Revisa los lugares que has marcado y vuelve a abrirlos en mapa o detalle."
            icono="☆"
            onClick={() => navigate("/favoritos")}
          />
          <AccionInicioCard
            etiqueta="Agenda"
            titulo="Calendario"
            descripcion="Consulta tus viajes por fecha y prepara mejor cada tramo del itinerario."
            icono="📅"
            onClick={() => navigate("/calendario")}
          />
          <AccionInicioCard
            etiqueta="Restauración"
            titulo="Dónde comer"
            descripcion="Busca restaurantes por ciudad, fecha y tipo usando Google Local, Maps y Tripadvisor."
            icono="🍽️"
            onClick={() => setRestauracionAbierta(true)}
          />
        </section>

        <section className="mt-9">
          <div className="mb-5">
            <h2 className="text-[28px] font-black tracking-[-0.04em] text-black md:text-[34px]">Comunidades para explorar</h2>
            <p className="mt-2 max-w-[760px] text-[14px] font-semibold leading-6 text-[#7c6b69]">
              Selecciona una comunidad para entrar al mapa con contexto preparado. La información detallada aparece después, justo donde aporta valor.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {ciudadesInicio.map((ciudad) => {
              const detalle = detallesComunidad[ciudad.nombre] ?? {
                resumen: ciudad.subtitulo,
                apoyo: "Una buena base para descubrir lugares relevantes.",
              };

              return (
                <button
                  key={ciudad.id}
                  type="button"
                  onClick={() => seleccionarDestino(ciudad.id)}
                  className="group overflow-hidden rounded-[34px] bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-[260px] overflow-hidden sm:h-[300px] md:h-[320px]">
                    <img src={ciudad.imagen} alt={ciudad.nombre} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                      <h3 className="text-[30px] font-black leading-tight drop-shadow-sm md:text-[42px]">{ciudad.nombre}</h3>
                      <p className="mt-3 max-w-[620px] text-[14px] font-bold leading-[23px] text-white/95 sm:text-[16px] sm:leading-[26px]">{detalle.resumen}</p>
                      <p className="mt-2 max-w-[620px] text-[13px] font-semibold leading-5 text-white/82 sm:text-[14px] sm:leading-6">{detalle.apoyo}</p>
                      <div className="mt-5 inline-flex items-center rounded-full bg-white px-4 py-2 text-[14px] font-black text-black transition group-hover:bg-[#fff6f1]">
                        Explorar en el mapa
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </ContenedorPantallaPrincipal>

      <ModalRestauracionLocal abierto={restauracionAbierta} onClose={() => setRestauracionAbierta(false)} />
    </div>
  );
}
