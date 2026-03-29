import { useNavigate } from "react-router-dom";
import logoPerfil from "@/assets/perfil/LogoPerfil.png";

export default function PerfilPantalla() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <div className="mx-auto w-full max-w-[980px] px-4 pt-4">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="flex h-[110px] w-[110px] items-center justify-center overflow-hidden rounded-full bg-[#fff7f5] shadow-sm">
              <img
                src={logoPerfil}
                alt="Logo perfil"
                className="h-[62px] w-[62px] object-contain"
              />
            </div>

            <h2 className="mt-4 text-[28px] font-bold text-black">Rose</h2>
            <p className="mt-1 text-[14px] text-[#6d6d6d]">rose@email.com</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[18px] border border-[#ededed] bg-[#fafafa] p-4">
              <p className="text-[13px] text-[#6d6d6d]">Usuario</p>
              <p className="mt-1 text-[16px] font-semibold text-black">Rose</p>
            </div>

            <div className="rounded-[18px] border border-[#ededed] bg-[#fafafa] p-4">
              <p className="text-[13px] text-[#6d6d6d]">Correo electrónico</p>
              <p className="mt-1 text-[16px] font-semibold text-black">
                rose@email.com
              </p>
            </div>

            <div className="rounded-[18px] border border-[#ededed] bg-[#fafafa] p-4">
              <p className="text-[13px] text-[#6d6d6d]">Número de teléfono</p>
              <p className="mt-1 text-[16px] font-semibold text-black">
                +34 600 000 000
              </p>
            </div>

            <div className="rounded-[18px] border border-[#ededed] bg-[#fafafa] p-4">
              <p className="text-[13px] text-[#6d6d6d]">Cuenta</p>
              <p className="mt-1 text-[16px] font-semibold text-black">
                Configuración personal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/perfil/editar")}
            className="mt-8 h-[48px] w-full rounded-[14px] bg-[#f2361d] text-[15px] font-semibold text-white shadow-md transition hover:bg-[#d92f17]"
          >
            Editar perfil
          </button>
        </div>
      </div>
    </div>
  );
}