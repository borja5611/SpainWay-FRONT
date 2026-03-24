export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-black" />
    </div>
  );
}