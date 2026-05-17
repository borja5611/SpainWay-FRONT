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
              className={`h-2.5 rounded-full transition-all ${
                activo === index ? "w-8 bg-[#ff5a36]" : "w-2.5 bg-[#d0d5dd]"
              }`}
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
    etiqueta: string;
    resumen: string;
    apoyo: string;
  }
> = {
  Andalucía: {
    etiqueta: "Costa, cultura y escapadas largas",
    resumen: "Ciudades monumentales, costa, arte y experiencias con identidad propia.",
    apoyo: "Ideal para mezclar patrimonio, naturaleza, gastronomía y rutas con mucho recorrido.",
  },
  Asturias: {
    etiqueta: "Naturaleza y tradición del norte",
    resumen: "Naturaleza, pueblos del norte, mar y una forma de viajar mucho más pausada.",
    apoyo: "Perfecta para combinar paisajes verdes, visitas culturales y escapadas con encanto.",
  },
  Baleares: {
    etiqueta: "Islas mediterráneas",
    resumen: "Patrimonio, calas y escapadas visuales en destinos con mucha fuerza paisajística.",
    apoyo: "Muy buena opción para viajes relajados, costa, miradores y rincones singulares.",
  },
  Canarias: {
    etiqueta: "Volcanes y costa atlántica",
    resumen: "Volcanes, playas, arquitectura singular y paisajes únicos en territorios insulares.",
    apoyo: "Pensada para combinar mar, naturaleza, pueblos con identidad y rutas escénicas.",
  },
  Cantabria: {
    etiqueta: "Mar, montaña y patrimonio",
    resumen: "Cuevas, costa, montaña y patrimonio natural y cultural muy equilibrado.",
    apoyo: "Encaja muy bien en viajes de naturaleza, escapadas tranquilas y rutas con variedad.",
  },
  Cataluña: {
    etiqueta: "Ciudad, costa y arquitectura",
    resumen: "Barcelona, costa, arquitectura y vida urbana mediterránea con mucho contenido.",
    apoyo: "Muy potente para combinar city break, cultura, gastronomía y escapadas cercanas.",
  },
  "Comunidad Valenciana": {
    etiqueta: "Mediterráneo y contraste urbano",
    resumen: "Mediterráneo, cultura, arquitectura y experiencias urbanas con mucha luz.",
    apoyo: "Funciona muy bien para viajes equilibrados entre ciudad, costa y planes relajados.",
  },
  Madrid: {
    etiqueta: "Capital cultural",
    resumen: "Gran capital cultural, barrios históricos y espacios emblemáticos para descubrir.",
    apoyo: "Muy buena para escapadas urbanas, museos, gastronomía y recorridos con ritmo flexible.",
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
                  <div className="spainway-destino-card-inner">
                    <img
                      src={ciudad.imagen}
                      alt={ciudad.nombre}
                      loading="lazy"
                      decoding="async"
                      className="spainway-destino-card-img transition duration-300 group-hover:scale-[1.03]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/42 to-transparent" />

                    <div className="spainway-destino-card-content">
                      <div className="spainway-destino-card-etiqueta inline-flex rounded-full bg-white/15 px-3 py-1 font-semibold uppercase tracking-[0.16em] text-white/95 backdrop-blur-sm">
                        {detalle.etiqueta}
                      </div>

                      <h3 className="spainway-destino-card-title drop-shadow-sm">
                        {ciudad.nombre}
                      </h3>

                      <p className="spainway-destino-card-resumen max-w-[620px] text-white/95">
                        {detalle.resumen}
                      </p>

                      <p className="spainway-destino-card-apoyo max-w-[620px] text-white/85">
                        {detalle.apoyo}
                      </p>

                      <div className="mt-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-black transition group-hover:bg-[#fff6f1]">
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