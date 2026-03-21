import { useState, FormEvent } from "react";
import { useNavigate } from "react-router";
import imgLogoCortadoRemovebgPreview3 from "figma:asset/f880387b616ea1defa8c8922513869778685a4ae.png";

export default function EditarPerfilPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Actualizar perfil:", formData);
    // Aquí iría la lógica de actualización
  };

  return (
    <div className="bg-white min-h-screen w-full max-w-[393px] mx-auto overflow-y-auto rounded-[40px] pb-24">
      {/* Header */}
      <div className="relative pt-6 px-6">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 top-7 size-[26px] active:opacity-70 transition-opacity"
        >
          <svg className="size-full" fill="none" viewBox="0 0 32 32">
            <path d="M20.5 8L12.5 16L20.5 24" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>

        <h1 className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-black text-center">
          Editar Perfil
        </h1>

        <button className="absolute right-6 top-6 size-[34px] active:opacity-70 transition-opacity">
          <svg className="size-full" fill="none" viewBox="0 0 34 34">
          </svg>
        </button>
      </div>

      {/* Logo */}
      <div className="h-[212px] w-[111px] mx-auto mt-4 overflow-hidden">
        <img 
          alt="SpainWay Logo" 
          className="h-[135.34%] w-[145.39%] -ml-[45.39%] -mt-[35.26%]" 
          src={imgLogoCortadoRemovebgPreview3} 
        />
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="px-6 space-y-6 mt-6">
        {/* Usuario */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-black block mb-2">
            Usuario
          </label>
          <input
            type="text"
            value={formData.usuario}
            onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
            className="w-full h-[40px] bg-transparent border border-[#a9a9a9] rounded-[8px] px-4 font-['Poppins:Regular',sans-serif] text-[14px] text-black outline-none focus:border-[#e12414] transition-colors"
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
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full h-[40px] bg-transparent border border-[#a9a9a9] rounded-[8px] px-4 font-['Poppins:Regular',sans-serif] text-[14px] text-black outline-none focus:border-[#e12414] transition-colors"
          />
        </div>

        {/* Número de Teléfono */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-black block mb-2">
            Numero de Telefono
          </label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className="w-full h-[40px] bg-transparent border border-[#a9a9a9] rounded-[8px] px-4 font-['Poppins:Regular',sans-serif] text-[14px] text-black outline-none focus:border-[#e12414] transition-colors"
          />
        </div>

        {/* Contraseña */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-black block mb-2">
            Contraseña
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full h-[40px] bg-transparent border border-[#a9a9a9] rounded-[8px] px-4 font-['Poppins:Regular',sans-serif] text-[14px] text-black outline-none focus:border-[#e12414] transition-colors"
          />
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label className="font-['Poppins:Medium',sans-serif] text-[14px] text-black block mb-2">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full h-[40px] bg-transparent border border-[#a9a9a9] rounded-[8px] px-4 font-['Poppins:Regular',sans-serif] text-[14px] text-black outline-none focus:border-[#e12414] transition-colors"
          />
        </div>

        {/* Botón Actualizar */}
        <button
          type="submit"
          className="w-[283px] h-[40px] bg-[#f2361d] rounded-[10px] mx-auto block hover:bg-[#d12f17] active:bg-[#b5290f] transition-all mt-8"
        >
          <p className="font-['Poppins:Bold',sans-serif] text-[15px] text-white">
            Actualizar
          </p>
        </button>
      </form>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white h-[54px] rounded-[36px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.25)] w-[343px] flex items-center justify-around px-4">
        <button onClick={() => navigate("/madrid")} className="size-[34px]">
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
