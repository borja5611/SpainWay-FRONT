import { useState } from "react";
import { useNavigate } from "react-router";
import imgLogoCortadoRemovebgPreview3 from "figma:asset/f880387b616ea1defa8c8922513869778685a4ae.png";

export default function PerfilPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    telefono: "",
    contrasena: "",
    confirmarContrasena: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = () => {
    console.log("Actualizando perfil:", formData);
    // Aquí iría la lógica de actualización
  };

  return (
    <div className="bg-white overflow-clip relative rounded-[40px] min-h-screen w-full max-w-[393px] mx-auto pb-24">
      {/* Header */}
      <div className="relative pt-6 px-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6 size-[26px] active:opacity-70 transition-opacity"
        >
          <svg className="size-full" fill="none" viewBox="0 0 32 32">
            <path d="M20.5 1H1" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>

        <h1 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-black text-center">
          Editar Perfil
        </h1>

        <button
          onClick={() => navigate("/settings")}
          className="absolute right-6 top-6 size-[34px] active:opacity-70 transition-opacity"
        >
          <svg className="size-full" fill="none" viewBox="0 0 34 34">
          </svg>
        </button>
      </div>

      {/* Logo */}
      <div className="h-[180px] w-[111px] mx-auto mt-4 mb-8 overflow-hidden">
        <img alt="SpainWay Logo" className="w-full h-full object-contain" src={imgLogoCortadoRemovebgPreview3} />
      </div>

      {/* Form */}
      <div className="px-6 space-y-6">
        {/* Usuario */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-black block mb-2">
            Usuario
          </label>
          <input
            type="text"
            value={formData.usuario}
            onChange={(e) => handleInputChange("usuario", e.target.value)}
            className="w-full h-[40px] px-4 border border-[#a9a9a9] rounded-[8px] font-['Poppins:Regular',sans-serif] text-[14px] outline-none focus:border-[#e12414] transition-colors"
            placeholder="Tu nombre de usuario"
          />
        </div>

        {/* Correo Electrónico */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-black block mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full h-[40px] px-4 border border-[#a9a9a9] rounded-[8px] font-['Poppins:Regular',sans-serif] text-[14px] outline-none focus:border-[#e12414] transition-colors"
            placeholder="tu@email.com"
          />
        </div>

        {/* Número de Teléfono */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-black block mb-2">
            Número de Teléfono
          </label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => handleInputChange("telefono", e.target.value)}
            className="w-full h-[40px] px-4 border border-[#a9a9a9] rounded-[8px] font-['Poppins:Regular',sans-serif] text-[14px] outline-none focus:border-[#e12414] transition-colors"
            placeholder="+34 600 000 000"
          />
        </div>

        {/* Contraseña */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-black block mb-2">
            Contraseña
          </label>
          <input
            type="password"
            value={formData.contrasena}
            onChange={(e) => handleInputChange("contrasena", e.target.value)}
            className="w-full h-[40px] px-4 border border-[#a9a9a9] rounded-[8px] font-['Poppins:Regular',sans-serif] text-[14px] outline-none focus:border-[#e12414] transition-colors"
            placeholder="••••••••"
          />
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-black block mb-2">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            value={formData.confirmarContrasena}
            onChange={(e) => handleInputChange("confirmarContrasena", e.target.value)}
            className="w-full h-[40px] px-4 border border-[#a9a9a9] rounded-[8px] font-['Poppins:Regular',sans-serif] text-[14px] outline-none focus:border-[#e12414] transition-colors"
            placeholder="••••••••"
          />
        </div>

        {/* Botón Actualizar */}
        <button
          onClick={handleUpdate}
          className="w-full h-[50px] bg-[#f2361d] hover:bg-[#e12414] active:bg-[#c41f12] rounded-[12px] transition-all"
        >
          <p className="font-['Poppins:Bold',sans-serif] text-[15px] text-white">
            Actualizar
          </p>
        </button>

        {/* Opciones adicionales */}
        <div className="pt-4 space-y-3">
          <button className="w-full text-left font-['Poppins:Regular',sans-serif] text-[14px] text-gray-600 hover:text-black transition-colors">
            Preferencias de viaje
          </button>
          <button className="w-full text-left font-['Poppins:Regular',sans-serif] text-[14px] text-gray-600 hover:text-black transition-colors">
            Métodos de pago
          </button>
          <button 
            onClick={() => navigate("/login")}
            className="w-full text-left font-['Poppins:Regular',sans-serif] text-[14px] text-red-600 hover:text-red-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white h-[54px] rounded-[36px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.25)] w-[343px] flex items-center justify-around px-4">
        <button onClick={() => navigate("/home")} className="size-[24px]">
          <svg className="size-full" fill="none" viewBox="0 0 24 24">
          </svg>
        </button>
        <button onClick={() => navigate("/mapa")} className="size-[24px]">
          <svg className="size-full" fill="none" viewBox="0 0 24 24">
          </svg>
        </button>
        <button onClick={() => navigate("/favoritos")} className="size-[24px]">
          <svg className="size-full" fill="none" viewBox="0 0 24 24">
          </svg>
        </button>
        <button onClick={() => navigate("/perfil")} className="size-[34px] rounded-full bg-black flex items-center justify-center">
          <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
          </svg>
        </button>
      </div>
    </div>
  );
}
