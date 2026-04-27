export const RUTAS_APP = {
  splash: "/",
  onboarding: "/onboarding/:step",

  login: "/login",
  registro: "/registro",
  recuperarContrasena: "/recuperar-contrasena",
  verificacionOtp: "/verificacion-otp",
  nuevaContrasena: "/nueva-contrasena",
  confirmacionContrasena: "/confirmacion-contrasena",

  inicio: "/inicio",
  selectorDestino: "/destinos",

  mapa: "/mapa",
  detallePoi: "/poi/:poiId",

  itinerarios: "/itinerarios",
  calendario: "/calendario",
  crearItinerario: "/itinerarios/crear",
  detalleItinerario: "/itinerarios/:itinerarioId",

  chat: "/chat",
  chatDestino: "/chat/destino",
  chatDetalle: "/chat/conversacion/:idConversacion",
  chatPreferencias: "/chat/preferencias",
  chatPresupuesto: "/chat/presupuesto",
  chatIntereses: "/chat/intereses",
  chatCargando: "/chat/cargando",
  resultadoChat: "/chat/resultado",

  perfil: "/perfil",
  editarPerfil: "/perfil/editar",
};
