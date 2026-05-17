import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDestinoStore } from "@/app/store/useDestinoStore";
import { ciudadesInicio } from "@/app/datos/mock/inicioDescubrimiento";
import ContenedorPantallaPrincipal from "@/app/componentes/layout/ContenedorPantallaPrincipal";
import type { DestinoId } from "@/app/datos/mock/destinos";

const slidesProducto = [
  {
    titulo: "Explora sin perderte",
    descripcion:
      "Empieza por una comunidad, revisa sus zonas principales y entra al mapa con el contexto ya preparado.",
    etiqueta: "Inicio guiado",
  },
  {
    titulo: "Descubre lugares relevantes",
    descripcion:
      "Los POIs destacados aparecen donde aportan más valor: sobre el mapa y con acciones rápidas para consultarlos.",
    etiqueta: "Mapa útil",
  },
  {
    titulo: "Crea rutas con intención",
    descripcion:
      "La planificación combina destino, zona base, fechas, ritmo y preferencias para generar itinerarios más coherentes.",
    etiqueta: "Itinerarios",
  },
];

function CarruselProducto() {
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActivo((prev) => (prev + 1) % slidesProducto.length);
    }, 4200);

    return () => window.clearInterval(id);
  }, []);

  const slide = slidesProducto[activo];

  return (
    <section className="mt-7 rounded-[30px] border border-[#eceae5] bg-white p-4 shadow-sm">
      <article className="relative min-h-[190px] rounded-[26px] bg-gradient-to-br from-[#fff7f4] via-white to-[#f4f1ff] p-6 transition-all duration-500">
        <div className="max-w-[760px] pr-2">
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#ff5a36] shadow-sm">
            {slide.etiqueta}
          </span>
          <h2 className="mt-4 text-[25px] font-black leading-[31px] tracking-[-0.04em] text-[#111827] sm:text-[28px] sm:leading-[34px]">
            {slide.titulo}
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[#667085] sm:text-[16px]">
            {slide.descripcion}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-2">
          {slidesProducto.map((item, index) => (
            <button
              key={item.titulo}
              type="button"
              onClick={() => setActivo(index)}
              className={`h-2.5 rounded-full transition-all ${activo === index ? "w-8 bg-[#ff5a36]" : "w-2.5 bg-[#d0d5dd]"}`}
              aria-label={`Ver tarjeta ${index + 1}`}
            />
          ))}
        </div>
      </article>
    </section>
  );
}

const detallesComunidad: Record<
  string,
  {
    resumen: string;
    apoyo: string;
  }
> = {
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
                  Explora comunidades y encuentra la escapada que mejor encaja contigo
                </h1>

                <p className="mt-4 max-w-[700px] text-[15px] leading-[27px] text-[#6d6d6d] md:text-[16px]">
                  Descubre destinos de forma visual, entra al mapa con una idea más
                  clara y empieza a construir viajes mucho más coherentes desde el
                  primer clic.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-[22px] border border-[#f1ece7] bg-white/90 p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#c37a5d]">
                    Más visual
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-[#5f5f5f]">
                    Elige primero una comunidad con contexto suficiente para empezar
                    mejor la exploración.
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
                    Pulsa una comunidad y pasa a descubrir sus lugares más relevantes
                    dentro del mapa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CarruselProducto />

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
                  <div className="relative h-[280px] overflow-hidden sm:h-[300px] md:h-[320px]">
                    <img
                      src={ciudad.imagen}
                      alt={ciudad.nombre}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6 md:p-7">
                      <h3 className="text-[26px] font-bold leading-tight drop-shadow-sm sm:text-[34px] md:text-[42px]">
                        {ciudad.nombre}
                      </h3>

                      <p className="mt-3 max-w-[620px] text-[14px] font-semibold leading-[22px] text-white/95 sm:text-[16px] sm:leading-[26px]">
                        {detalle.resumen}
                      </p>

                      <p className="mt-2 max-w-[620px] text-[13px] leading-5 text-white/82 sm:text-[14px] sm:leading-6">
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