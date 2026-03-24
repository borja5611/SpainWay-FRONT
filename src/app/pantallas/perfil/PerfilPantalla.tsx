import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoPerfil from "@/assets/perfil/LogoPerfil.png";
import MenuConfiguracionLateral from "@/app/componentes/perfil/MenuConfiguracionLateral";

export default function PerfilPantalla() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-white pb-24">
        <div className="mx-auto w-full max-w-[393px] px-6 pt-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="absolute left-0 top-0 text-[20px]"
            >
              ←
            </button>

            <h1 className="text-center text-[18px] font-semibold text-black">
              Editar Perfil
            </h1>

            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              className="absolute right-0 top-0 text-[20px]"
            >
              ⚙
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <img
              src={logoPerfil}
              alt="Logo perfil"
              className="h-[140px] w-[90px] object-contain"
            />
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-black">
                Usuario
              </label>
              <input
                className="h-[40px] w-full rounded-[8px] border border-[#a9a9a9] px-4 text-[14px] outline-none"
                value="Rose"
                readOnly
              />
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-black">
                Correo Electrónico
              </label>
              <input
                className="h-[40px] w-full rounded-[8px] border border-[#a9a9a9] px-4 text-[14px] outline-none"
                value="rose@email.com"
                readOnly
              />
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-black">
                Número de Teléfono
              </label>
              <input
                className="h-[40px] w-full rounded-[8px] border border-[#a9a9a9] px-4 text-[14px] outline-none"
                value="+34 600 000 000"
                readOnly
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/perfil/editar")}
              className="mt-2 h-[45px] w-full rounded-[10px] bg-[#f2361d] text-[15px] font-semibold text-white"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>

      <MenuConfiguracionLateral
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />
    </>
  );
}