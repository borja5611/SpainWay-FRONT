import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type UserChat = {
  id: string;
  titulo: string;
  ultimoMensaje: string;
  updatedAt: string;
};

const STORAGE_KEY = "spainway_user_chats";

function readUserChats(): UserChat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UserChat[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });
}

export default function ChatPantalla() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<UserChat[]>([]);

  useEffect(() => {
    function load() {
      setChats(readUserChats());
    }

    load();
    window.addEventListener("storage", load);
    window.addEventListener("focus", load);

    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("focus", load);
    };
  }, []);

  return (
    <div className="min-h-full bg-[#f3f5f9] text-[#111827]">
      <div className="mx-auto w-full max-w-[430px] px-5 pb-28 pt-5">
        <section className="rounded-[30px] bg-gradient-to-br from-[#fff8f4] via-[#ffffff] to-[#f4f1ff] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[#94a3b8]">
            Chat
          </p>
          <h1 className="mt-2 text-[24px] font-bold tracking-[-0.03em]">
            Conversaciones del usuario
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            Aquí se listan los chats reales guardados por el usuario.
          </p>
        </section>

        <section className="mt-5">
          {chats.length === 0 ? (
            <div className="rounded-[28px] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
              <p className="text-base font-semibold text-[#111827]">
                No tienes chats guardados
              </p>
              <p className="mt-2 text-sm leading-6 text-[#667085]">
                Cuando el usuario tenga conversaciones aparecerán aquí. Ahora mismo
                no hay ninguna disponible.
              </p>

              <button
                type="button"
                onClick={() => navigate("/mapa")}
                className="mt-4 rounded-2xl bg-[#ff5a36] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,90,54,0.28)]"
              >
                Ir a explorar
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  className="w-full rounded-[26px] bg-white p-5 text-left shadow-[0_12px_30px_rgba(15,23,42,0.07)] transition hover:translate-y-[-1px]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[18px] font-bold text-[#111827]">
                        {chat.titulo}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#667085]">
                        {chat.ultimoMensaje}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-xs font-semibold text-[#667085]">
                      {formatDate(chat.updatedAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}