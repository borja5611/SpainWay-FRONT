import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoPerfil from "@/assets/perfil/LogoPerfil.png";

export default function EditarPerfilPantalla() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usuario: "Rose",
    email: "rose@email.com",
    telefono: "+34 600 000 000",
    password: "",
    confirmPassword: "",
  });

  return (
    <div className="min-h-screen bg-[#f6f6f3]">
      <div className="mx-auto w-full max-w-[980px] px-4 pt-4">
        <div className="rounded-[28px] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-full bg-[#f5f5f5] px-4 py-2 text-[14px] text-black transition hover:bg-[#ececec]"
            >
              ← Volver
            </button>

            <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full bg-[#fff7f5] shadow-sm">
              <img
                src={logoPerfil}
                alt="Logo perfil"
                className="h-[40px] w-[40px] object-contain"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-black">
                Usuario
              </label>
              <input
                className="h-[46px] w-full rounded-[12px] border border-[#e7e7e7] bg-white px-4 text-[14px] outline-none"
                value={formData.usuario}
                onChange={(e) =>
                  setFormData({ ...formData, usuario: e.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-black">
                Correo electrónico
              </label>
              <input
                className="h-[46px] w-full rounded-[12px] border border-[#e7e7e7] bg-white px-4 text-[14px] outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-black">
                Número de teléfono
              </label>
              <input
                className="h-[46px] w-full rounded-[12px] border border-[#e7e7e7] bg-white px-4 text-[14px] outline-none"
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
                className="h-[46px] w-full rounded-[12px] border border-[#e7e7e7] bg-white px-4 text-[14px] outline-none"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-[14px] font-medium text-black">
                Confirmar contraseña
              </label>
              <input
                type="password"
                className="h-[46px] w-full rounded-[12px] border border-[#e7e7e7] bg-white px-4 text-[14px] outline-none"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/perfil")}
            className="mt-8 h-[48px] w-full rounded-[14px] bg-[#f2361d] text-[15px] font-semibold text-white shadow-md transition hover:bg-[#d92f17]"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}