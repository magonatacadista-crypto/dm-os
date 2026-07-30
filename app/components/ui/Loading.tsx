type LoadingProps = {
  text?: string;
};

export default function Loading({
  text = "Carregando...",
}: LoadingProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"
        aria-hidden="true"
      />

      <p className="text-sm font-medium text-slate-500">
        {text}
      </p>
    </div>
  );
}