import type { InputHTMLAttributes, ReactNode } from "react";

interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  icon: ReactNode;
  endIcon?: ReactNode;
  backgroundColor?: "light" | "lighter";
  onIconClick?: () => void;
}

export function InputField({
  icon,
  endIcon,
  backgroundColor = "light",
  onIconClick,
  ...props
}: InputFieldProps) {
  const bgColor = backgroundColor === "light" ? "bg-[#ebf2f9]" : "bg-[#f1f6fb]";

  return (
    <div
      className={`${bgColor} h-[61px] rounded-[12px] flex items-center px-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#e12414]/30`}
    >
      <div className="h-[26px] w-[24px] flex-shrink-0 mr-3 flex items-center justify-center">
        {icon}
      </div>

      <input
        {...props}
        className="flex-1 bg-transparent font-['Inter:Medium',sans-serif] font-medium text-[13px] leading-[16px] text-[#1C2D57] tracking-[0.26px] outline-none placeholder:text-[#8189b0] w-full border-none"
      />

      {endIcon && (
        <button
          type="button"
          className="h-[26px] w-[24px] flex-shrink-0 ml-2 flex items-center justify-center transition-opacity hover:opacity-70 active:opacity-50"
          onClick={onIconClick}
        >
          {endIcon}
        </button>
      )}
    </div>
  );
}