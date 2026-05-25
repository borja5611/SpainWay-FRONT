# SpainWay-FRONT

Frontend principal de SpainWay, plataforma de turismo inteligente para España basada en un asistente conversacional con inteligencia artificial. Este repositorio contiene la aplicación cliente desde la que el usuario puede registrarse, iniciar sesión, explorar destinos, interactuar con el asistente, consultar itinerarios, visualizar puntos de interés en el mapa, gestionar favoritos y acceder a su perfil.

## Función dentro de SpainWay

Este repositorio representa la capa de presentación de la aplicación principal. Su objetivo es ofrecer una interfaz clara, visual y orientada a dispositivos móviles para que el usuario pueda planificar viajes personalizados por España.

El frontend se comunica con el backend mediante peticiones HTTP y utiliza servicios externos de mapas para representar recursos turísticos e itinerarios.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- Mapbox / React Map GL
- Zustand
- Radix UI
- Lucide React
- Capacitor Android

## Estructura general

```text
SpainWay-FRONT/
├── android/              # Proyecto Android generado con Capacitor
├── public/               # Recursos estáticos
├── src/                  # Código fuente principal
├── .env.example          # Variables de entorno de ejemplo
├── package.json          # Dependencias y scripts del proyecto
├── vite.config.ts        # Configuración de Vite
└── tsconfig.json         # Configuración de TypeScript
```

## Variables de entorno

Antes de ejecutar el proyecto, crear un archivo `.env` a partir de `.env.example`.

```env
VITE_MAPBOX_TOKEN=
VITE_API_URL=
```

Descripción de variables:

- `VITE_MAPBOX_TOKEN`: token utilizado para la visualización de mapas.
- `VITE_API_URL`: URL base del backend de SpainWay.

Ejemplo en local:

```env
VITE_API_URL=http://localhost:3000
VITE_MAPBOX_TOKEN=tu_token_de_mapbox
```

## Instalación

```bash
npm install
```

## Ejecución en local

```bash
npm run dev
```

Por defecto, la aplicación se ejecuta en:

```text
http://localhost:5173
```

## Compilación para producción

```bash
npm run build
```

## Previsualización de la build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Relación con otros repositorios

Este repositorio se comunica con:

- `SpainWay-BACK`: backend principal de la plataforma. Gestiona autenticación, usuarios, puntos de interés, itinerarios, favoritos, eventos y conversaciones.
- `Spainway-IA`: servicio de recomendación e inteligencia artificial. Apoya la generación de itinerarios y la selección de puntos de interés.
- `SpainWay-Web`: página web de presentación del proyecto.

## Flujo principal de uso

1. El usuario accede a la aplicación.
2. Puede registrarse o iniciar sesión.
3. Accede a la pantalla principal.
4. Explora destinos o inicia el asistente conversacional.
5. El frontend envía preferencias y mensajes al backend.
6. El backend coordina la lógica de negocio y, cuando es necesario, consulta el módulo IA.
7. El frontend muestra itinerarios, puntos de interés y mapas.

## Estado del prototipo

El frontend se encuentra en estado de prototipo funcional para el Trabajo Fin de Grado. Incluye las pantallas principales necesarias para demostrar el flujo de uso de SpainWay: autenticación, inicio, chat, itinerarios, mapa, favoritos y perfil.

El proyecto está preparado para pruebas locales, despliegue web y validación visual de la experiencia de usuario.
