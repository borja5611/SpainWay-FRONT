import HeroMadrid from "../../../assets/inicio/madrid/Heromadrid.png";
import HeroValencia from "../../../assets/inicio/valencia/HeroValencia.png";
import HeroBarcelona from "../../../assets/inicio/barcelona/HeroBarcelona.png";
import HeroAndalucia from "../../../assets/inicio/andalucia/HeroSevilla.png";
import HeroCanarias from "../../../assets/inicio/canarias/HeroCanarias.png";
import HeroCantabria from "../../../assets/inicio/cantabria/HeroCantabria.png";

export type CategoriaItinerario =
  | "Cultural"
  | "Costa"
  | "Escapada"
  | "Gastronomía"
  | "Naturaleza";

export interface DiaItinerario {
  dia: number;
  titulo: string;
  resumen: string;
  actividades: string[];
}

export interface ItinerarioMock {
  id: string;
  titulo: string;
  subtitulo: string;
  destino: string;
  dias: number;
  progreso: number;
  lugares: number;
  categoria: CategoriaItinerario;
  guardado: boolean;
  destacado: boolean;
  imagen: string;
  siguientePaso: string;
  etiquetas: string[];
  presupuesto: "Bajo" | "Medio" | "Alto";
  temporada: string;
  descripcionLarga: string;
  preguntasIA: string[];
  diasPlan: DiaItinerario[];
}

export const itinerariosMock: ItinerarioMock[] = [
  {
    id: "madrid-3-dias",
    titulo: "Escapada a Madrid",
    subtitulo:
      "Un plan muy equilibrado para descubrir el Madrid más icónico sin ir con prisas: arte, paseo, barrios con ambiente y noches agradables.",
    destino: "Madrid",
    dias: 3,
    progreso: 78,
    lugares: 11,
    categoria: "Cultural",
    guardado: true,
    destacado: true,
    imagen: HeroMadrid,
    siguientePaso: "Cerrar tramo Prado · Retiro · Gran Vía para el segundo día.",
    etiquetas: ["Museos", "Centro", "Tapeo"],
    presupuesto: "Medio",
    temporada: "Todo el año",
    descripcionLarga:
      "Este itinerario está pensado para una primera visita a Madrid muy bien compensada, combinando grandes iconos culturales, paseos agradables y zonas con vida local. Busca evitar desplazamientos innecesarios y concentrar cada jornada por áreas para que el viaje resulte cómodo y aprovechable.",
    preguntasIA: [
      "¿Cuántos días vas a dedicar al viaje?",
      "¿Qué ritmo prefieres: relajado, equilibrado o intenso?",
      "¿Qué te interesa más: cultura, gastronomía, ocio, compras o naturaleza urbana?",
      "¿Cuál es tu presupuesto aproximado?",
      "¿Viajas solo, en pareja, con amigos o en familia?",
      "¿Quieres priorizar lugares imprescindibles o rincones menos turísticos?",
      "¿Te interesa incluir restaurantes, miradores o actividades nocturnas?",
    ],
    diasPlan: [
      {
        dia: 1,
        titulo: "Centro histórico y primer contacto",
        resumen:
          "Una jornada cómoda para orientarte y disfrutar del corazón de Madrid.",
        actividades: [
          "Puerta del Sol",
          "Plaza Mayor",
          "Mercado de San Miguel",
          "Palacio Real exterior",
        ],
      },
      {
        dia: 2,
        titulo: "Arte y paseo grande",
        resumen:
          "Día centrado en museos y espacios amplios para caminar sin prisas.",
        actividades: [
          "Museo del Prado",
          "Paseo del Prado",
          "Parque del Retiro",
          "Barrio de Salamanca",
        ],
      },
      {
        dia: 3,
        titulo: "Gran Vía y cierre urbano",
        resumen:
          "Último día con ambiente urbano, compras y cena especial.",
        actividades: [
          "Gran Vía",
          "Plaza de España",
          "Templo de Debod",
          "Cena en zona centro",
        ],
      },
    ],
  },
  {
    id: "andalucia-5-dias",
    titulo: "Ruta por Andalucía",
    subtitulo:
      "Un recorrido potente por ciudades con muchísimo peso patrimonial, con tramos pensados para aprovechar el viaje sin que se vuelva agotador.",
    destino: "Andalucía",
    dias: 5,
    progreso: 56,
    lugares: 17,
    categoria: "Escapada",
    guardado: true,
    destacado: true,
    imagen: HeroAndalucia,
    siguientePaso:
      "Definir el orden Sevilla · Córdoba · Granada y ajustar tiempos de traslado.",
    etiquetas: ["Patrimonio", "Road trip", "Miradores"],
    presupuesto: "Medio",
    temporada: "Primavera",
    descripcionLarga:
      "Una ruta pensada para combinar tres grandes focos patrimoniales de Andalucía con una distribución razonable de tiempos. La clave aquí es que el itinerario no se limite a meter ciudades, sino que ordene bien las visitas, los desplazamientos y los momentos de descanso.",
    preguntasIA: [
      "¿Qué ciudades de Andalucía quieres incluir sí o sí?",
      "¿Quieres moverte en coche, tren o combinar transportes?",
      "¿Qué peso debe tener el patrimonio frente a gastronomía o relax?",
      "¿Prefieres dormir en una sola ciudad base o cambiar de alojamiento?",
      "¿Quieres priorizar imprescindibles o una mezcla con sitios menos saturados?",
      "¿Cuál es el presupuesto medio por día?",
      "¿Te interesa añadir pueblos, costa o experiencias locales?",
    ],
    diasPlan: [
      {
        dia: 1,
        titulo: "Llegada a Sevilla",
        resumen:
          "Primera jornada suave para entrar en el viaje con casco histórico y ambiente.",
        actividades: ["Catedral", "Giralda", "Barrio de Santa Cruz", "Cena local"],
      },
      {
        dia: 2,
        titulo: "Sevilla monumental",
        resumen: "Día principal para los grandes iconos de la ciudad.",
        actividades: ["Real Alcázar", "Plaza de España", "Parque de María Luisa"],
      },
      {
        dia: 3,
        titulo: "Córdoba esencial",
        resumen:
          "Traslado medido y visita concentrada en lo más representativo.",
        actividades: ["Mezquita-Catedral", "Puente Romano", "Judería"],
      },
      {
        dia: 4,
        titulo: "Granada y Albaicín",
        resumen: "Entrada a la ciudad y primer contacto con sus miradores.",
        actividades: [
          "Paseo por Albaicín",
          "Mirador de San Nicolás",
          "Centro histórico",
        ],
      },
      {
        dia: 5,
        titulo: "Alhambra y cierre",
        resumen: "Final del viaje con el gran imprescindible bien planificado.",
        actividades: ["Alhambra", "Generalife", "Comida final especial"],
      },
    ],
  },
  {
    id: "valencia-4-dias",
    titulo: "Valencia entre ciudad y mar",
    subtitulo:
      "Una propuesta muy cómoda que mezcla arquitectura contemporánea, casco histórico, playa y pausas reales para disfrutar sin saturarte.",
    destino: "Valencia",
    dias: 4,
    progreso: 34,
    lugares: 9,
    categoria: "Costa",
    guardado: true,
    destacado: false,
    imagen: HeroValencia,
    siguientePaso:
      "Añadir bloque de playa y reservar una tarde para la Ciudad de las Artes.",
    etiquetas: ["Playa", "Arquitectura", "Atardecer"],
    presupuesto: "Medio",
    temporada: "Verano",
    descripcionLarga:
      "Este itinerario busca que Valencia se disfrute sin sensación de carrera. Se apoya en una combinación muy clara entre la parte urbana más monumental, la arquitectura contemporánea y momentos reales de costa y descanso.",
    preguntasIA: [
      "¿Quieres más playa o más ciudad?",
      "¿Te interesa incluir arquitectura moderna o priorizas casco histórico?",
      "¿Cuánto tiempo quieres dedicar a la costa?",
      "¿Qué presupuesto manejas para comidas y actividades?",
      "¿Quieres un viaje relajado o con muchas visitas por día?",
    ],
    diasPlan: [
      {
        dia: 1,
        titulo: "Centro histórico",
        resumen: "Primera jornada para conocer el corazón de Valencia.",
        actividades: ["Catedral", "Plaza de la Virgen", "Mercado Central"],
      },
      {
        dia: 2,
        titulo: "Ciudad de las Artes",
        resumen: "Día más visual y moderno.",
        actividades: ["Ciudad de las Artes", "Oceanogràfic", "Paseo vespertino"],
      },
      {
        dia: 3,
        titulo: "Costa y pausa",
        resumen: "Jornada ligera enfocada al mar y al descanso.",
        actividades: ["Playa", "Paseo marítimo", "Comida frente al mar"],
      },
      {
        dia: 4,
        titulo: "Cierre flexible",
        resumen: "Último día adaptable a compras o última visita.",
        actividades: ["Barrio del Carmen", "Últimas compras", "Despedida"],
      },
    ],
  },
  {
    id: "barcelona-3-dias",
    titulo: "Barcelona imprescindible",
    subtitulo:
      "Pensado para quien quiere una primera toma de contacto potente, con iconos de Gaudí, paseo urbano y momentos para disfrutar la ciudad.",
    destino: "Barcelona",
    dias: 3,
    progreso: 82,
    lugares: 10,
    categoria: "Cultural",
    guardado: true,
    destacado: false,
    imagen: HeroBarcelona,
    siguientePaso:
      "Organizar visita temprana a Sagrada Familia y tramo final por el Born.",
    etiquetas: ["Modernismo", "Paseo", "Ciudad"],
    presupuesto: "Alto",
    temporada: "Todo el año",
    descripcionLarga:
      "Una propuesta clara para una primera visita a Barcelona, muy centrada en iconos imprescindibles pero evitando que el recorrido se vuelva caótico.",
    preguntasIA: [
      "¿Es tu primera vez en Barcelona?",
      "¿Quieres priorizar Gaudí y grandes iconos?",
      "¿Te interesa incluir playa o quedarte en zona urbana?",
      "¿Qué nivel de intensidad quieres para cada día?",
    ],
    diasPlan: [
      {
        dia: 1,
        titulo: "Gaudí y gran icono",
        resumen: "Primer día fuerte para arrancar con lo más simbólico.",
        actividades: ["Sagrada Familia", "Passeig de Gràcia", "Casa Batlló"],
      },
      {
        dia: 2,
        titulo: "Centro y barrios",
        resumen: "Jornada de paseo urbano y ambiente local.",
        actividades: ["Gótico", "Born", "Ramblas"],
      },
      {
        dia: 3,
        titulo: "Cierre panorámico",
        resumen: "Último día con vistas y tramo final relajado.",
        actividades: ["Montjuïc", "Miradores", "Comida final"],
      },
    ],
  },
  {
    id: "canarias-6-dias",
    titulo: "Canarias natural",
    subtitulo:
      "Un itinerario muy visual para combinar paisajes volcánicos, costa, miradores y días con una sensación real de desconexión.",
    destino: "Canarias",
    dias: 6,
    progreso: 41,
    lugares: 14,
    categoria: "Naturaleza",
    guardado: true,
    destacado: false,
    imagen: HeroCanarias,
    siguientePaso:
      "Separar días de playa de los de naturaleza para que el ritmo quede mejor compensado.",
    etiquetas: ["Volcanes", "Playas", "Miradores"],
    presupuesto: "Alto",
    temporada: "Invierno",
    descripcionLarga:
      "Una ruta centrada en paisajes, respiración y sensación de viaje amplio. Ideal para combinar carretera, vistas y momentos de costa.",
    preguntasIA: [
      "¿Qué isla o combinación de islas quieres visitar?",
      "¿Quieres más naturaleza o más playa?",
      "¿Te apetece caminar o prefieres recorridos cómodos?",
      "¿Cuánto peso debe tener el descanso frente a las visitas?",
    ],
    diasPlan: [
      {
        dia: 1,
        titulo: "Llegada y adaptación",
        resumen: "Entrada suave con primeras vistas.",
        actividades: ["Paseo inicial", "Mirador cercano", "Cena tranquila"],
      },
      {
        dia: 2,
        titulo: "Gran paisaje",
        resumen: "Día para uno de los paisajes más potentes del viaje.",
        actividades: ["Zona volcánica", "Miradores", "Ruta panorámica"],
      },
      {
        dia: 3,
        titulo: "Costa",
        resumen: "Jornada relajada con peso del mar.",
        actividades: ["Playa", "Paseo", "Atardecer"],
      },
      {
        dia: 4,
        titulo: "Naturaleza interior",
        resumen: "Día centrado en contraste de paisajes.",
        actividades: ["Parque natural", "Bosque o sendero", "Pueblo local"],
      },
      {
        dia: 5,
        titulo: "Exploración libre",
        resumen: "Día flexible según preferencias finales.",
        actividades: ["Actividad opcional", "Comida especial", "Zona escénica"],
      },
      {
        dia: 6,
        titulo: "Cierre del viaje",
        resumen: "Último tramo más ligero.",
        actividades: ["Último paseo", "Compras", "Salida"],
      },
    ],
  },
  {
    id: "cantabria-4-dias",
    titulo: "Cantabria tranquila",
    subtitulo:
      "Una ruta muy agradable para alternar costa, pueblos con encanto, patrimonio y escapadas con un ritmo bastante relajado.",
    destino: "Cantabria",
    dias: 4,
    progreso: 63,
    lugares: 8,
    categoria: "Naturaleza",
    guardado: true,
    destacado: false,
    imagen: HeroCantabria,
    siguientePaso:
      "Añadir un bloque final de costa y ajustar una comida especial cerca de Santander.",
    etiquetas: ["Costa", "Pueblos", "Relax"],
    presupuesto: "Medio",
    temporada: "Primavera",
    descripcionLarga:
      "Pensado para disfrutar Cantabria con calma, cuidando trayectos y combinando zonas muy agradables sin forzar demasiado cada jornada.",
    preguntasIA: [
      "¿Quieres más costa, más interior o una mezcla?",
      "¿Te interesa meter patrimonio además de paisaje?",
      "¿Viaje relajado o equilibrado?",
      "¿Te moverás en coche?",
    ],
    diasPlan: [
      {
        dia: 1,
        titulo: "Santander",
        resumen: "Entrada cómoda y paseo urbano.",
        actividades: ["Centro", "Bahía", "Paseo marítimo"],
      },
      {
        dia: 2,
        titulo: "Pueblos con encanto",
        resumen: "Jornada pausada y visual.",
        actividades: ["Santillana", "Comillas", "Entorno costero"],
      },
      {
        dia: 3,
        titulo: "Naturaleza y aire libre",
        resumen: "Día para abrir el viaje hacia paisaje.",
        actividades: ["Parque natural", "Mirador", "Comida local"],
      },
      {
        dia: 4,
        titulo: "Cierre costero",
        resumen: "Último día flexible antes de la salida.",
        actividades: ["Última playa o paseo", "Despedida"],
      },
    ],
  },
];

export function obtenerItinerarioPorId(id?: string) {
  if (!id) return undefined;

  const limpio = id.trim().toLowerCase();

  return itinerariosMock.find(
    (item) => item.id.trim().toLowerCase() === limpio
  );
}