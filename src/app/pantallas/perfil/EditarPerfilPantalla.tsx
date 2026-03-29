import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoPerfil from "@/assets/perfil/LogoPerfil.png";
import MenuConfiguracionLateral from "@/app/componentes/perfil/MenuConfiguracionGlobal";

export default function EditarPerfilPantalla() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const [formData, setFormData] = useState({
    usuario: "Rose",
    email: "rose@email.com",
    telefono: "+34 600 000 000",
    password: "",
    confirmPassword: "",
  });

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

          <form className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-black">
                Usuario
              </label>
              <input
                className="h-[40px] w-full rounded-[8px] border border-[#a9a9a9] px-4 text-[14px] outline-none"
                value={formData.usuario}
                onChange={(e) =>
                  setFormData({ ...formData, usuario: e.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-black">
                Correo Electrónico
              </label>
              <input
                className="h-[40px] w-full rounded-[8px] border border-[#a9a9a9] px-4 text-[14px] outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-black">
                Número de Teléfono
              </label>
              <input
                className="h-[40px] w-full rounded-[8px] border border-[#a9a9a9] px-4 text-[14px] outline-none"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-black">
                Contraseña
              </label>
              <input
                type="password"
                className="h-[40px] w-full rounded-[8px] border border-[#a9a9a9] px-4 text-[14px] outline-none"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-black">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                className="h-[40px] w-full rounded-[8px] border border-[#a9a9a9] px-4 text-[14px] outline-none"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/perfil")}
              className="mt-2 h-[45px] w-full rounded-[10px] bg-[#f2361d] text-[15px] font-semibold text-white"
            >
              Actualizar
            </button>
          </form>
        </div>
      </div>

      <MenuConfiguracionLateral
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />
    </>
  );
}