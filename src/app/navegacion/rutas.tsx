import { createBrowserRouter } from "react-router-dom";
import { RUTAS_APP } from "@/app/utilidades/rutas";

import LayoutAuth from "./LayoutAuth";
import LayoutPrincipal from "./LayoutPrincipal";

import SplashPantalla from "@/app/pantallas/onboarding/SplashPantalla";
import OnboardingPantalla from "@/app/pantallas/onboarding/OnboardingPantalla";

import LoginPantalla from "@/app/pantallas/auth/LoginPantalla";
import RegistroPantalla from "@/app/pantallas/auth/RegistroPantalla";
import RecuperarContrasenaPantalla from "@/app/pantallas/auth/RecuperarContrasenaPantalla";
import VerificacionOtpPantalla from "@/app/pantallas/auth/VerificacionOtpPantalla";
import NuevaContrasenaPantalla from "@/app/pantallas/auth/NuevaContrasenaPantalla";
import ConfirmacionContrasenaPantalla from "@/app/pantallas/auth/ConfirmacionContrasenaPantalla";

import InicioPantalla from "@/app/pantallas/inicio/InicioPantalla";
import SelectorDestinoPantalla from "@/app/pantallas/inicio/SelectorDestinoPantalla";
import MapaPantalla from "@/app/pantallas/mapa/MapaPantalla";
import ListaItinerariosPantalla from "@/app/pantallas/itinerarios/ListaItinerariosPantalla";
import ChatPantalla from "@/app/pantallas/chat/ChatPantalla";
import PerfilPantalla from "@/app/pantallas/perfil/PerfilPantalla";
import EditarPerfilPantalla from "@/app/pantallas/perfil/EditarPerfilPantalla";

export const router = createBrowserRouter([
  {
    element: <LayoutAuth />,
    children: [
      { path: RUTAS_APP.splash, element: <SplashPantalla /> },
      { path: RUTAS_APP.onboarding, element: <OnboardingPantalla /> },
      { path: RUTAS_APP.login, element: <LoginPantalla /> },
      { path: RUTAS_APP.registro, element: <RegistroPantalla /> },
      { path: RUTAS_APP.recuperarContrasena, element: <RecuperarContrasenaPantalla /> },
      { path: RUTAS_APP.verificacionOtp, element: <VerificacionOtpPantalla /> },
      { path: RUTAS_APP.nuevaContrasena, element: <NuevaContrasenaPantalla /> },
      { path: RUTAS_APP.confirmacionContrasena, element: <ConfirmacionContrasenaPantalla /> },
    ],
  },
  {
    element: <LayoutPrincipal />,
    children: [
      { path: RUTAS_APP.inicio, element: <InicioPantalla /> },
      { path: RUTAS_APP.selectorDestino, element: <SelectorDestinoPantalla /> },
      { path: RUTAS_APP.mapa, element: <MapaPantalla /> },
      { path: RUTAS_APP.itinerarios, element: <ListaItinerariosPantalla /> },
      { path: RUTAS_APP.chat, element: <ChatPantalla /> },
      { path: RUTAS_APP.perfil, element: <PerfilPantalla /> },
      { path: RUTAS_APP.editarPerfil, element: <EditarPerfilPantalla /> },
    ],
  },
]);