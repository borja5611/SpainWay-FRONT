type Props = {
  abierto: boolean;
  onCerrar: () => void;
};

const items = [
  "Notification",
  "Dark Mode",
  "Rate App",
  "Share App",
  "Privacy Policy",
  "Terms and Conditions",
  "Cookies Policy",
  "Contact",
  "Feedback",
  "Logout",
];

export default function MenuConfiguracionGlobal({
  abierto,
  onCerrar,
}: Props) {
  if (!abierto) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/30"
        onClick={onCerrar}
      />

      <aside className="fixed right-0 top-0 z-[70] h-full w-[320px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-[22px] font-semibold text-black">Settings</h2>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-full px-3 py-1 text-[20px]"
          >
            ×
          </button>
        </div>

        <div className="px-4 py-3">
          {items.map((item, index) => (
            <button
              key={item}
              type="button"
              className={`flex w-full items-center justify-between rounded-[14px] px-3 py-4 text-left text-[15px] text-black transition hover:bg-[#f5f5f5] ${
                index === 0 ? "bg-[#f1f1f1]" : ""
              }`}
            >
              <span>{item}</span>
              {item === "Notification" && (
                <span className="h-[22px] w-[40px] rounded-full bg-[#d9d9d9]" />
              )}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}