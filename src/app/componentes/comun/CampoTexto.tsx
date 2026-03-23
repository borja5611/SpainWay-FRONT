import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function CampoTexto({
  label,
  error,
  className,
  ...props
}: Props) {
  return (
    <label className="block w-full">
      {label ? (
        <span className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </span>
      ) : null}

      <input
        className={clsx(
          "w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500",
          error && "border-red-400 focus:border-red-500",
          className
        )}
        {...props}
      />

      {error ? (
        <span className="mt-1 block text-sm text-red-500">{error}</span>
      ) : null}
    </label>
  );
}