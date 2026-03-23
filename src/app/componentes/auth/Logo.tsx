import logoSpainWay from "@/assets/LogoSpainway.png";

export function Logo() {
  return (
    <div className="flex justify-center w-full mb-8">
      <img
        alt="SpainWay Logo"
        className="h-[110px] w-[170px] object-contain"
        src={logoSpainWay}
      />
    </div>
  );
}