import SocialMedia from "@/imports/SocialMedia";

interface SocialLoginProps {
  text?: string;
}

export function SocialLogin({ text = "O continúa con" }: SocialLoginProps) {
  return (
    <div className="w-full">
      <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] text-center mb-4">
        {text}
      </p>
      <div className="flex justify-center">
        <div className="w-[264px] h-[68px]">
          <SocialMedia />
        </div>
      </div>
    </div>
  );
}