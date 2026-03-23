export type Destino = {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
};

export const destinosMock: Destino[] = [
  {
    id: "madrid",
    nombre: "Madrid",
    descripcion: "Cultura, gastronomía y vida urbana.",
    imagen: "https://picsum.photos/400/240?random=1",
  },
  {
    id: "barcelona",
    nombre: "Barcelona",
    descripcion: "Arquitectura, mar y barrios con identidad.",
    imagen: "https://picsum.photos/400/240?random=2",
  },
  {
    id: "valencia",
    nombre: "Valencia",
    descripcion: "Ciudad mediterránea, ciencia y playas.",
    imagen: "https://picsum.photos/400/240?random=3",
  },
];