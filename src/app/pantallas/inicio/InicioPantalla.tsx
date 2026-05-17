import { useNavigate } from "react-router-dom";
import { useDestinoStore } from "@/app/store/useDestinoStore";
import { ciudadesInicio } from "@/app/datos/mock/inicioDescubrimiento";
import BloqueInfoInicio from "@/app/componentes/inicio/BloqueInfoInicio";
import ContenedorPantallaPrincipal from "@/app/componentes/layout/ContenedorPantallaPrincipal";
import type { DestinoId } from "@/app/datos/mock/destinos";

const detallesComunidad: Record<
  string,
  {
    etiqueta: string;
    resumen: string;
    apoyo: string;
  }
> = {
  Andalucía: {
    etiqueta: "Costa, cultura y escapadas largas",
    resumen:
      "Ciudades monumentales, costa, arte y experiencias con identidad propia.",
    apoyo:
      "Ideal para mezclar patrimonio, naturaleza, gastronomía y rutas con mucho recorrido.",
  },
  Asturias: {
    etiqueta: "Naturaleza y tradición del norte",
    resumen:
      "Naturaleza, pueblos del norte, mar y una forma de viajar mucho más pausada.",
    apoyo:
      "Perfecta para combinar paisajes verdes, visitas culturales y escapadas con encanto.",
  },
  Baleares: {
    etiqueta: "Islas mediterráneas",
    resumen:
      "Patrimonio, calas y escapadas visuales en destinos con muchísima fuerza paisajística.",
    apoyo:
      "Muy buena opción para viajes relajados, costa, miradores y rincones singulares.",
  },
  Canarias: {
    etiqueta: "Volcanes y costa atlántica",
    resumen:
      "Volcanes, playas, arquitectura singular y paisajes únicos en territorios insulares.",
    apoyo:
      "Pensada para combinar mar, naturaleza, pueblos con identidad y rutas escénicas.",
  },
  Cantabria: {
    etiqueta: "Mar, montaña y patrimonio",
    resumen:
      "Cuevas, costa, montaña y patrimonio natural y cultural muy equilibrado.",
    apoyo:
      "Encaja muy bien en viajes de naturaleza, escapadas tranquilas y rutas con variedad.",
  },
  Cataluña: {
    etiqueta: "Ciudad, costa y arquitectura",
    resumen:
      "Barcelona, costa, arquitectura y vida urbana mediterránea con mucho contenido.",
    apoyo:
      "Muy potente para combinar city break, cultura, gastronomía y escapadas cercanas.",
  },
  "Comunidad Valenciana": {
    etiqueta: "Mediterráneo y contraste urbano",
    resumen:
      "Mediterráneo, cultura, arquitectura y experiencias urbanas con mucha luz.",
    apoyo:
      "Funciona muy bien para viajes equilibrados entre ciudad, costa y planes relajados.",
  },
  Madrid: {
    etiqueta: "Capital cultural",
    resumen:
      "Gran capital cultural, barrios históricos y espacios emblemáticos para descubrir.",
    apoyo:
      "Muy buena para escapadas urbanas, museos, gastronomía y recorridos con ritmo flexible.",
  },
};

export default function InicioPantalla() {
  const navigate = useNavigate();
  const setDestinoSeleccionado = useDestinoStore(
    (state) => state.setDestinoSeleccionado
  );

  const seleccionarDestino = (destinoId: DestinoId) => {
    setDestinoSeleccionado(destinoId);
    navigate("/mapa");
  };

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <ContenedorPantallaPrincipal className="pt-3">
        <section>
          <div className="overflow-hidden rounded-[34px] border border-[#eceae5] bg-white shadow-sm">
            <div className="bg-gradient-to-br from-[#fff7f4] via-white to-[#f8f6ff] p-7 md:p-8">
              <div className="max-w-[780px]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#d65d3f]">
                  SpainWay
                </p>

                <h1
                  className="mt-3 text-[34px] font-bold leading-[38px] text-black md:text-[42px] md:leading-[46px]"
                  style={{ fontFamily: "var(--font-family-display)" }}
                >
                  Explora comunidades y encuentra la escapada que mejor encaja
                  contigo
                </h1>

                <p className="mt-4 max-w-[700px] text-[15px] leading-[27px] text-[#6d6d6d] md:text-[16px]">
                  Descubre destinos de forma visual, entra al mapa con una idea
                  más clara y empieza a construir viajes mucho más coherentes
                  desde el primer clic.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-[22px] border border-[#f1ece7] bg-white/90 p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#c37a5d]">
                    Más visual
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-[#5f5f5f]">
                    Elige primero una comunidad con contexto suficiente para
                    empezar mejor la exploración.
                  </p>
                </div>

                <div className="rounded-[22px] border border-[#f1ece7] bg-white/90 p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#c37a5d]">
                    Más claro
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-[#5f5f5f]">
                    Reducimos ruido en la home para que no tengas una pantalla
                    interminable antes de entrar al mapa.
                  </p>
                </div>

                <div className="rounded-[22px] border border-[#f1ece7] bg-white/90 p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#c37a5d]">
                    Más directo
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-[#5f5f5f]">
                    Pulsa una comunidad y pasa a descubrir sus lugares más
                    relevantes dentro del mapa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <BloqueInfoInicio
              titulo="Comunidades mejor organizadas"
              descripcion="La portada se centra en territorios y no en una lista excesiva de tarjetas, mejorando la lectura general."
            />
            <BloqueInfoInicio
              titulo="Exploración más útil"
              descripcion="La parte detallada y los POIs destacados se trasladan al mapa, donde tiene más sentido descubrirlos."
            />
          </div>
        </section>

        <section className="mt-9">
          <div className="mb-5">
            <h2 className="text-[30px] font-bold text-black">
              Comunidades para explorar
            </h2>
            <p className="mt-1 max-w-[760px] text-[14px] leading-6 text-[#7c6b69]">
              Selecciona una comunidad para entrar al mapa con ese territorio ya
              preparado. La home se queda ligera y el detalle importante aparece
              donde de verdad aporta valor.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {ciudadesInicio.map((ciudad) => {
              const detalle = detallesComunidad[ciudad.nombre] ?? {
                etiqueta: "Exploración territorial",
                resumen: ciudad.subtitulo,
                apoyo:
                  "Una buena base para descubrir lugares relevantes y construir un viaje más ajustado.",
              };

              return (
                <button
                  key={ciudad.id}
                  type="button"
                  onClick={() => seleccionarDestino(ciudad.id)}
                  className="group spainway-destino-card overflow-hidden rounded-[34px] bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-full min-h-[360px] overflow-hidden md:min-h-[380px]">
                    <img
                      src={ciudad.imagen}
                      alt={ciudad.nombre}
                      loading="lazy"
                      decoding="async"
                      className="spainway-destino-card-img transition duration-300 group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/35 to-transparent" />

                    <div className="spainway-destino-card-content absolute inset-x-0 bottom-0 text-white">
                      <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/95 backdrop-blur-sm">
                        {detalle.etiqueta}
                      </div>

                      <h3 className="spainway-destino-card-title mt-4 font-bold drop-shadow-sm">
                        {ciudad.nombre}
                      </h3>

                      <p className="spainway-destino-card-resumen mt-4 max-w-[620px] font-semibold text-white/95">
                        {detalle.resumen}
                      </p>

                      <p className="spainway-destino-card-apoyo mt-3 max-w-[620px] text-white/85">
                        {detalle.apoyo}
                      </p>

                      <div className="mt-5 inline-flex items-center rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-black transition group-hover:bg-[#fff6f1]">
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
    </div>
  );
}