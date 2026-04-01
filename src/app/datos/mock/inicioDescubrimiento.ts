import type { DestinoId } from "./destinos";

/* =========================
   HERO / PORTADAS INICIO
========================= */
import EventoAlhambra from "@/assets/inicio/andalucia/EventoAlhambra.png";
import AsturiasHero from "@/assets/inicio/asturias/AsturiasHero.png";
import HomeBaleares from "@/assets/inicio/baleares/HomeBaleares.png";
import HeroCanarias from "@/assets/inicio/canarias/HeroCanarias.png";
import HeroCantabria from "@/assets/inicio/cantabria/HeroCantabria.png";

import HeroBarcelona from "@/assets/inicio/barcelona/HeroBarcelona.png";
import HeroValencia from "@/assets/inicio/valencia/HeroValencia.png";
import HeroMadrid from "@/assets/inicio/madrid/HeroMadrid.png";

/* =========================
   POIS / EVENTOS INICIO
========================= */

/* Andalucía */
import EventoFlamenco from "@/assets/inicio/andalucia/EventoFlamenco.png";
import EventoGiralda from "@/assets/inicio/andalucia/EventoGiralda.png";
import EventoMezquitaCordoba from "@/assets/inicio/andalucia/EventoMezquitaCordoba.png";
import EventoPlayaCadiz from "@/assets/inicio/andalucia/EventoPlayaCadiz.png";
import EventoPueblosBlancos from "@/assets/inicio/andalucia/EventoPueblosBlancos.png";

/* Asturias */
import EventoCangasOnis from "@/assets/inicio/asturias/EventoCangasOnis.png";
import EventoCovadonga from "@/assets/inicio/asturias/EventoCovadonga.png";
import EventoGijon from "@/assets/inicio/asturias/EventoGijon.png";
import EventoLlanes from "@/assets/inicio/asturias/EventoLlanes.png";
import EventoOviedo from "@/assets/inicio/asturias/EventoOviedo.png";
import EventoSidra from "@/assets/inicio/asturias/EventoSidra.png";

/* Baleares */
import EventoAtardecer from "@/assets/inicio/baleares/EventoAtardecer.png";
import EventoCatedralPalma from "@/assets/inicio/baleares/EventoCatedralPalma.png";
import EventoCuevas from "@/assets/inicio/baleares/EventoCuevas.png";
import EventoIbizaDaltVila from "@/assets/inicio/baleares/EventoIbizaDaltVila.png";
import EventoMercadillo from "@/assets/inicio/baleares/EventoMercadillo.png";
import EventoPlayaBaleares from "@/assets/inicio/baleares/EventoPlaya.png";
import EventoSierraTramuntana from "@/assets/inicio/baleares/EventoSierraTramuntana.png";

/* Canarias */
import EventoArquitectura from "@/assets/inicio/canarias/EventoArquitectura.png";
import EventoBosque from "@/assets/inicio/canarias/EventoBosque.png";
import EventoDunas from "@/assets/inicio/canarias/EventoDunas.png";
import EventoPlayasCanarias from "@/assets/inicio/canarias/EventoPlayas.png";
import EventoTeide from "@/assets/inicio/canarias/EventoTeide.png";
import EventoTimanfaya from "@/assets/inicio/canarias/EventoTimanfaya.png";

/* Cantabria */
import EventoAltamira from "@/assets/inicio/cantabria/EventoAltamira.png";
import EventoCabarceno from "@/assets/inicio/cantabria/EventoCabarceno.png";
import EventoPicos from "@/assets/inicio/cantabria/EventoPicos.png";
import EventoSantander from "@/assets/inicio/cantabria/EventoSantander.png";
import EventoSantillana from "@/assets/inicio/cantabria/EventoSantillana.png";

/* Cataluña */
import EventoSagradaFamilia from "@/assets/inicio/barcelona/EventoSagradaFamilia.png";
import EventoCasaBatllo from "@/assets/inicio/barcelona/EventoCasaBatllo.png";
import PlayaBarcelona from "@/assets/inicio/barcelona/PlayaBarcelona.png";
import EventoSagrada from "@/assets/inicio/barcelona/EventoSagrada.png";
import EventoRamblas from "@/assets/inicio/barcelona/EventoRamblas.png";
import EventoMontjuic from "@/assets/inicio/barcelona/EventoMontjuic.png";

/* Comunidad Valenciana */
import EventoOceanografic from "@/assets/inicio/valencia/EventoOceanografic.png";
import EventoBioparc from "@/assets/inicio/valencia/EventoBioparc.png";
import EventoPlayaValencia from "@/assets/inicio/valencia/EventoPlaya.png";
import EventoCatedral from "@/assets/inicio/valencia/EventoCatedral.png";
import EventoFallas from "@/assets/inicio/valencia/EventoFallas.png";
import EventoFestival from "@/assets/inicio/valencia/EventoFestival.png";

/* Madrid */
import EventoMuseo from "@/assets/inicio/madrid/EventoMuseo.png";
import EventoRetiro from "@/assets/inicio/madrid/EventoRetiro.png";
import EventoTeatro from "@/assets/inicio/madrid/EventoTeatro.png";
import EventoConcierto from "@/assets/inicio/madrid/EventoConcierto.png";
import EventoPlazaEspaña from "@/assets/inicio/madrid/EventoPlazaEspaña.png";
import EventoSanGines from "@/assets/inicio/madrid/EventoSanGines.png";

export type CiudadInicio = {
  id: DestinoId;
  nombre: string;
  subtitulo: string;
  imagen: string;
};

export type PoiPreview = {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  destinoId: DestinoId;
};

export const ciudadesInicio: CiudadInicio[] = [
  {
    id: "andalucia",
    nombre: "Andalucía",
    subtitulo: "Ciudades monumentales, costa, arte y experiencias con identidad propia",
    imagen: EventoAlhambra,
  },
  {
    id: "asturias",
    nombre: "Asturias",
    subtitulo: "Naturaleza, pueblos del norte, mar y tradición",
    imagen: AsturiasHero,
  },
  {
    id: "baleares",
    nombre: "Baleares",
    subtitulo: "Islas mediterráneas, patrimonio, calas y escapadas visuales",
    imagen: HomeBaleares,
  },
  {
    id: "canarias",
    nombre: "Canarias",
    subtitulo: "Volcanes, playas, arquitectura singular y paisajes únicos",
    imagen: HeroCanarias,
  },
  {
    id: "cantabria",
    nombre: "Cantabria",
    subtitulo: "Cuevas, costa, montaña y patrimonio natural y cultural",
    imagen: HeroCantabria,
  },
  {
    id: "cataluna",
    nombre: "Cataluña",
    subtitulo: "Barcelona, costa, arquitectura y vida urbana mediterránea",
    imagen: HeroBarcelona,
  },
  {
    id: "cv",
    nombre: "Comunidad Valenciana",
    subtitulo: "Mediterráneo, cultura, arquitectura y experiencias urbanas",
    imagen: HeroValencia,
  },
  {
    id: "madrid",
    nombre: "Madrid",
    subtitulo: "Gran capital cultural, barrios históricos y espacios emblemáticos",
    imagen: HeroMadrid,
  },
];

export const poisInicioPorCiudad: Record<DestinoId, PoiPreview[]> = {
  andalucia: [
    {
      id: "alhambra",
      titulo: "Alhambra",
      descripcion:
        "El gran icono monumental de Granada y uno de los conjuntos históricos más importantes de toda España.",
      imagen: EventoAlhambra,
      destinoId: "andalucia",
    },
    {
      id: "mezquita-cordoba",
      titulo: "Mezquita de Córdoba",
      descripcion:
        "Una visita imprescindible para entender la huella histórica y arquitectónica que define Andalucía.",
      imagen: EventoMezquitaCordoba,
      destinoId: "andalucia",
    },
    {
      id: "giralda",
      titulo: "Giralda de Sevilla",
      descripcion:
        "Símbolo visual de Sevilla y uno de los puntos más reconocibles del patrimonio andaluz.",
      imagen: EventoGiralda,
      destinoId: "andalucia",
    },
    {
      id: "flamenco",
      titulo: "Tradición flamenca",
      descripcion:
        "Una experiencia cultural ligada a la identidad andaluza, ideal para una escapada con personalidad.",
      imagen: EventoFlamenco,
      destinoId: "andalucia",
    },
    {
      id: "playa-cadiz",
      titulo: "Costa de Cádiz",
      descripcion:
        "Perfecta para combinar patrimonio, paseo urbano y mar en un mismo destino.",
      imagen: EventoPlayaCadiz,
      destinoId: "andalucia",
    },
    {
      id: "pueblos-blancos",
      titulo: "Pueblos blancos",
      descripcion:
        "Una ruta muy visual para descubrir la Andalucía más auténtica, tranquila y fotogénica.",
      imagen: EventoPueblosBlancos,
      destinoId: "andalucia",
    },
  ],

  asturias: [
    {
      id: "covadonga",
      titulo: "Covadonga",
      descripcion:
        "Uno de los lugares con más fuerza simbólica de Asturias, rodeado de paisaje y espiritualidad.",
      imagen: EventoCovadonga,
      destinoId: "asturias",
    },
    {
      id: "oviedo",
      titulo: "Oviedo",
      descripcion:
        "Ciudad elegante y monumental, perfecta para una visita urbana con identidad asturiana.",
      imagen: EventoOviedo,
      destinoId: "asturias",
    },
    {
      id: "gijon",
      titulo: "Gijón",
      descripcion:
        "Ideal para mezclar mar, ambiente urbano y una experiencia más abierta y contemporánea.",
      imagen: EventoGijon,
      destinoId: "asturias",
    },
    {
      id: "llanes",
      titulo: "Llanes",
      descripcion:
        "Uno de los rincones costeros más atractivos para una escapada visual por el norte.",
      imagen: EventoLlanes,
      destinoId: "asturias",
    },
    {
      id: "cangas-onis",
      titulo: "Cangas de Onís",
      descripcion:
        "Puerta de entrada a rutas de naturaleza y uno de los lugares más reconocibles del territorio asturiano.",
      imagen: EventoCangasOnis,
      destinoId: "asturias",
    },
    {
      id: "sidra",
      titulo: "Cultura de la sidra",
      descripcion:
        "Una parte esencial de la experiencia asturiana, vinculada a gastronomía y tradición local.",
      imagen: EventoSidra,
      destinoId: "asturias",
    },
  ],

  baleares: [
    {
      id: "catedral-palma",
      titulo: "Catedral de Palma",
      descripcion:
        "Uno de los referentes patrimoniales más imponentes de Baleares y pieza clave de la visita a Mallorca.",
      imagen: EventoCatedralPalma,
      destinoId: "baleares",
    },
    {
      id: "ibiza-dalt-vila",
      titulo: "Ibiza Dalt Vila",
      descripcion:
        "Un núcleo histórico con gran fuerza visual y un ambiente distinto al imaginario más turístico de la isla.",
      imagen: EventoIbizaDaltVila,
      destinoId: "baleares",
    },
    {
      id: "tramuntana",
      titulo: "Sierra de Tramuntana",
      descripcion:
        "Paisaje espectacular para una experiencia más natural y panorámica dentro de Baleares.",
      imagen: EventoSierraTramuntana,
      destinoId: "baleares",
    },
    {
      id: "cuevas",
      titulo: "Cuevas",
      descripcion:
        "Una propuesta diferente para añadir variedad paisajística y geológica al viaje.",
      imagen: EventoCuevas,
      destinoId: "baleares",
    },
    {
      id: "playa-baleares",
      titulo: "Playas de Baleares",
      descripcion:
        "Calas y costa mediterránea para una escapada más ligera, visual y relajada.",
      imagen: EventoPlayaBaleares,
      destinoId: "baleares",
    },
    {
      id: "mercadillo",
      titulo: "Mercadillos locales",
      descripcion:
        "Perfectos para descubrir el lado más cotidiano, artesanal y cercano de las islas.",
      imagen: EventoMercadillo,
      destinoId: "baleares",
    },
    {
      id: "atardecer",
      titulo: "Atardeceres mediterráneos",
      descripcion:
        "Una de las experiencias más reconocibles de Baleares, ideal para cerrar ruta o jornada.",
      imagen: EventoAtardecer,
      destinoId: "baleares",
    },
  ],

  canarias: [
    {
      id: "teide",
      titulo: "Teide",
      descripcion:
        "El gran emblema visual del archipiélago y una experiencia imprescindible para entender Canarias.",
      imagen: EventoTeide,
      destinoId: "canarias",
    },
    {
      id: "timanfaya",
      titulo: "Timanfaya",
      descripcion:
        "Paisaje volcánico de enorme fuerza visual, ideal para una ruta diferente y memorable.",
      imagen: EventoTimanfaya,
      destinoId: "canarias",
    },
    {
      id: "dunas",
      titulo: "Dunas",
      descripcion:
        "Uno de los escenarios naturales más fotogénicos para una escapada ligada a mar y paisaje.",
      imagen: EventoDunas,
      destinoId: "canarias",
    },
    {
      id: "playas-canarias",
      titulo: "Playas canarias",
      descripcion:
        "Una propuesta muy potente para quienes buscan sol, costa y grandes vistas abiertas.",
      imagen: EventoPlayasCanarias,
      destinoId: "canarias",
    },
    {
      id: "bosque",
      titulo: "Bosques húmedos",
      descripcion:
        "La cara más verde de Canarias, perfecta para romper con la idea más típica de isla volcánica.",
      imagen: EventoBosque,
      destinoId: "canarias",
    },
    {
      id: "arquitectura",
      titulo: "Arquitectura singular",
      descripcion:
        "Espacios urbanos con personalidad para enriquecer una visita más completa al archipiélago.",
      imagen: EventoArquitectura,
      destinoId: "canarias",
    },
  ],

  cantabria: [
    {
      id: "altamira",
      titulo: "Altamira",
      descripcion:
        "Uno de los grandes referentes culturales y arqueológicos del norte peninsular.",
      imagen: EventoAltamira,
      destinoId: "cantabria",
    },
    {
      id: "cabarceno",
      titulo: "Cabárceno",
      descripcion:
        "Una propuesta diferente que mezcla paisaje, amplitud territorial y experiencia familiar.",
      imagen: EventoCabarceno,
      destinoId: "cantabria",
    },
    {
      id: "santander",
      titulo: "Santander",
      descripcion:
        "Ciudad costera elegante y abierta al mar, muy útil para una escapada urbana del norte.",
      imagen: EventoSantander,
      destinoId: "cantabria",
    },
    {
      id: "santillana",
      titulo: "Santillana del Mar",
      descripcion:
        "Uno de los conjuntos históricos más atractivos para una visita pausada y muy visual.",
      imagen: EventoSantillana,
      destinoId: "cantabria",
    },
    {
      id: "picos",
      titulo: "Picos y montaña",
      descripcion:
        "Una forma de descubrir la Cantabria más paisajística y natural fuera del entorno costero.",
      imagen: EventoPicos,
      destinoId: "cantabria",
    },
  ],

  cataluna: [
    {
      id: "sagrada-familia",
      titulo: "Sagrada Familia",
      descripcion:
        "El gran icono de Barcelona y una pieza esencial para cualquier aproximación visual a Cataluña.",
      imagen: EventoSagradaFamilia,
      destinoId: "cataluna",
    },
    {
      id: "casa-batllo",
      titulo: "Casa Batlló",
      descripcion:
        "Una de las obras más conocidas del modernismo catalán y una visita de enorme atractivo visual.",
      imagen: EventoCasaBatllo,
      destinoId: "cataluna",
    },
    {
      id: "montjuic",
      titulo: "Montjuïc",
      descripcion:
        "Un espacio perfecto para combinar vistas, cultura y recorrido urbano en Barcelona.",
      imagen: EventoMontjuic,
      destinoId: "cataluna",
    },
    {
      id: "ramblas",
      titulo: "Las Ramblas",
      descripcion:
        "Uno de los paseos urbanos más reconocibles para sumergirse en el ambiente de la ciudad.",
      imagen: EventoRamblas,
      destinoId: "cataluna",
    },
    {
      id: "sagrada-detalle",
      titulo: "Barcelona monumental",
      descripcion:
        "Una mirada más amplia al peso arquitectónico y turístico de la capital catalana.",
      imagen: EventoSagrada,
      destinoId: "cataluna",
    },
    {
      id: "playa-barcelona",
      titulo: "Costa de Barcelona",
      descripcion:
        "La combinación ideal entre ciudad, litoral y ritmo mediterráneo.",
      imagen: PlayaBarcelona,
      destinoId: "cataluna",
    },
  ],

  cv: [
    {
      id: "oceanografic",
      titulo: "Oceanogràfic",
      descripcion:
        "Uno de los lugares más atractivos de Valencia para una visita moderna, visual y familiar.",
      imagen: EventoOceanografic,
      destinoId: "cv",
    },
    {
      id: "bioparc",
      titulo: "Bioparc",
      descripcion:
        "Una propuesta distinta para añadir variedad a una escapada urbana por Valencia.",
      imagen: EventoBioparc,
      destinoId: "cv",
    },
    {
      id: "fallas",
      titulo: "Fallas",
      descripcion:
        "Uno de los grandes símbolos culturales valencianos, lleno de identidad y fuerza visual.",
      imagen: EventoFallas,
      destinoId: "cv",
    },
    {
      id: "catedral",
      titulo: "Catedral de Valencia",
      descripcion:
        "Un punto clave del centro histórico para completar la parte más patrimonial de la visita.",
      imagen: EventoCatedral,
      destinoId: "cv",
    },
    {
      id: "festival",
      titulo: "Ambiente cultural",
      descripcion:
        "Perfecto para asociar la Comunidad Valenciana con ocio, cultura y experiencia urbana.",
      imagen: EventoFestival,
      destinoId: "cv",
    },
    {
      id: "playa-valencia",
      titulo: "Playa de Valencia",
      descripcion:
        "La parte más abierta, luminosa y mediterránea de una escapada a la ciudad.",
      imagen: EventoPlayaValencia,
      destinoId: "cv",
    },
  ],

  madrid: [
    {
      id: "museo-prado",
      titulo: "Museo del Prado",
      descripcion:
        "Uno de los grandes referentes culturales de Madrid y una visita imprescindible para cualquier itinerario.",
      imagen: EventoMuseo,
      destinoId: "madrid",
    },
    {
      id: "retiro",
      titulo: "Parque del Retiro",
      descripcion:
        "Un equilibrio perfecto entre ciudad, paseo y uno de los espacios más queridos de la capital.",
      imagen: EventoRetiro,
      destinoId: "madrid",
    },
    {
      id: "teatro-real",
      titulo: "Teatro Real",
      descripcion:
        "Una propuesta ideal para conectar Madrid con cultura, música y vida monumental.",
      imagen: EventoTeatro,
      destinoId: "madrid",
    },
    {
      id: "concierto",
      titulo: "Conciertos y agenda",
      descripcion:
        "La capital también destaca por su vida cultural activa y su oferta de ocio continua.",
      imagen: EventoConcierto,
      destinoId: "madrid",
    },
    {
      id: "plaza-espana",
      titulo: "Plaza de España",
      descripcion:
        "Uno de los espacios urbanos más útiles para enlazar recorrido monumental y paseo por el centro.",
      imagen: EventoPlazaEspaña,
      destinoId: "madrid",
    },
    {
      id: "san-gines",
      titulo: "San Ginés",
      descripcion:
        "Un clásico madrileño que ayuda a mostrar el lado más reconocible y cotidiano de la ciudad.",
      imagen: EventoSanGines,
      destinoId: "madrid",
    },
  ],
};