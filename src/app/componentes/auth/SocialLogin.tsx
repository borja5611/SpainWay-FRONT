import SocialMedia from "@/imports/SocialMedia";

interface SocialLoginProps {
  text?: string;
  onGoogle?: () => void;
  onFacebook?: () => void;
  onLinkedin?: () => void;
}

export function SocialLogin({
  text = "O continúa con",
  onGoogle,
  onFacebook,
  onLinkedin,
}: SocialLoginProps) {
  return (
    <div className="w-full">
      <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[24px] text-[#7c6b69] text-center mb-4">
        {text}
      </p>

      <div className="flex justify-center">
        <div className="relative w-[264px] h-[68px]">
          <button
            type="button"
            onClick={onFacebook}
            className="absolute left-0 top-0 w-[72px] h-[68px] z-10 rounded-[6px]"
            aria-label="Continuar con Facebook"
          />
          <button
            type="button"
            onClick={onGoogle}
            className="absolute left-[96px] top-0 w-[72px] h-[68px] z-10 rounded-[6px]"
            aria-label="Continuar con Google"
          />
          <button
            type="button"
            onClick={onLinkedin}
            className="absolute left-[192px] top-0 w-[72px] h-[68px] z-10 rounded-[6px]"
            aria-label="Continuar con LinkedIn"
          />

          <div className="pointer-events-none">
            <SocialMedia />
          </div>
        </div>
      </div>
    </div>
  );
}