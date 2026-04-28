import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/app/store/useAuthStore";
import {
  crearConversacion,
  eliminarConversacion,
  getConversaciones,
  type Conversacion,
} from "@/app/servicios/conversacion";

function formatDate(value?: string | null): string {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name?: string | null): string {
  if (!name) return "SW";
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "SW"
  );
}

export default function ChatPantalla() {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const idUsuario = usuario?.id_usuario ?? 1;

  const [chats, setChats] = useState<Conversacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [chatPendienteEliminar, setChatPendienteEliminar] = useState<Conversacion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalChats = useMemo(() => chats.length, [chats.length]);

  async function cargarConversaciones() {
    try {
      setLoading(true);
      setError(null);
      const data = await getConversaciones(idUsuario);
      setChats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las conversaciones.");
      setChats([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void cargarConversaciones();
  }, [idUsuario]);

  async function crearNuevoChat() {
    try {
      setCreating(true);
      setError(null);
      const nuevo = await crearConversacion({
        id_usuario: idUsuario,
        titulo: "Nuevo viaje con SpainWay",
      });
      navigate(`/chat/conversacion/${nuevo.id_conversacion}`);
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la conversación.");
    } finally {
      setCreating(false);
    }
  }

  function pedirEliminar(event: MouseEvent<HTMLButtonElement>, chat: Conversacion) {
    event.stopPropagation();
    setChatPendienteEliminar(chat);
  }

  async function confirmarEliminar() {
    if (!chatPendienteEliminar) return;
    try {
      setDeletingId(chatPendienteEliminar.id_conversacion);
      setError(null);
      await eliminarConversacion(chatPendienteEliminar.id_conversacion);
      setChats((prev) => prev.filter((chat) => chat.id_conversacion !== chatPendienteEliminar.id_conversacion));
      setChatPendienteEliminar(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar la conversación.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[900px] px-5 pb-28 pt-5">
        <section className="overflow-hidden rounded-[34px] bg-gradient-to-br from-[#fff8f4] via-white to-[#f4f1ff] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#94a3b8]">Chat</p>
              <h1 className="mt-2 text-[28px] font-black tracking-[-0.04em] text-[#0f172a]">Conversaciones del usuario</h1>
              <p className="mt-2 max-w-[560px] text-sm leading-6 text-[#667085]">Abre una conversación guardada, continúa hablando con el asistente o crea un nuevo chat para preparar otro viaje.</p>
            </div>
            <button type="button" onClick={crearNuevoChat} disabled={creating} className="rounded-2xl bg-[#ff5a36] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(255,90,54,0.30)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60">
              {creating ? "Creando..." : "Crear nuevo chat"}
            </button>
          </div>
        </section>

        {error && <div className="mt-5 rounded-[22px] bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">{error}</div>}

        <section className="mt-5">
          {loading ? (
            <div className="rounded-[30px] bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.07)]"><p className="text-sm font-semibold text-[#667085]">Cargando conversaciones...</p></div>
          ) : chats.length === 0 ? (
            <div className="rounded-[30px] bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.07)]">
              <p className="text-lg font-black text-[#111827]">No tienes chats guardados</p>
              <p className="mt-2 text-sm leading-6 text-[#667085]">Crea una conversación nueva y empieza a preparar tu ruta con SpainWay.</p>
              <button type="button" onClick={crearNuevoChat} disabled={creating} className="mt-5 rounded-2xl bg-[#ff5a36] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)] disabled:opacity-60">Crear primer chat</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1"><p className="text-sm font-bold text-[#667085]">{totalChats} {totalChats === 1 ? "conversación" : "conversaciones"}</p></div>
              {chats.map((chat) => {
                const titulo = chat.titulo || "Nuevo viaje con SpainWay";
                const ultimoMensaje = chat.ultimo_mensaje || "Pulsa para abrir esta conversación y seguir hablando.";
                return (
                  <article key={chat.id_conversacion} role="button" tabIndex={0} onClick={() => navigate(`/chat/conversacion/${chat.id_conversacion}`)} onKeyDown={(event) => { if (event.key === "Enter") navigate(`/chat/conversacion/${chat.id_conversacion}`); }} className="group cursor-pointer rounded-[30px] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.07)] transition hover:translate-y-[-2px] hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff4ef] text-sm font-black text-[#ff5a36]">{getInitials(titulo)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0"><h3 className="truncate text-[18px] font-black text-[#111827]">{titulo}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#667085]">{ultimoMensaje}</p></div>
                          <span className="shrink-0 rounded-full bg-[#f8fafc] px-3 py-1 text-xs font-bold text-[#667085]">{formatDate(chat.creado)}</span>
                        </div>
                        <div className="mt-5 flex items-center justify-between gap-3">
                          <span className="text-xs font-bold text-[#ff5a36] opacity-0 transition group-hover:opacity-100">Abrir conversación →</span>
                          <button type="button" onClick={(event) => pedirEliminar(event, chat)} disabled={deletingId === chat.id_conversacion} className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60">{deletingId === chat.id_conversacion ? "Eliminando..." : "Eliminar"}</button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {chatPendienteEliminar && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/45 px-5 backdrop-blur-sm" onClick={() => setChatPendienteEliminar(null)}>
          <div className="w-full max-w-[420px] rounded-[32px] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.30)]" onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">🗑️</div>
            <h2 className="mt-5 text-center text-[22px] font-black tracking-[-0.03em] text-[#111827]">Eliminar conversación</h2>
            <p className="mt-3 text-center text-sm leading-6 text-[#667085]">Vas a eliminar <strong className="text-[#111827]">{chatPendienteEliminar.titulo || "Nuevo viaje con SpainWay"}</strong>. Esta acción no se puede deshacer.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setChatPendienteEliminar(null)} disabled={deletingId !== null} className="rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm font-bold text-[#344054] transition hover:bg-[#f8fafc] disabled:opacity-60">Cancelar</button>
              <button type="button" onClick={confirmarEliminar} disabled={deletingId !== null} className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(220,38,38,0.25)] transition hover:bg-red-700 disabled:opacity-60">{deletingId !== null ? "Eliminando..." : "Eliminar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
