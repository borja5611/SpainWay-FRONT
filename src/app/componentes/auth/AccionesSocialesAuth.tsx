export default function AccionesSocialesAuth() {
  return (
    <div className="space-y-3">
      <button
        type="button"
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Continuar con Google
      </button>
      <button
        type="button"
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Continuar con Apple
      </button>
    </div>
  );
}