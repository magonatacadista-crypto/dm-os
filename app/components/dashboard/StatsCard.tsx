type Props = {
  titulo: string;
  valor: string;
};

export default function StatsCard({ titulo, valor }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border">
      <h3 className="text-gray-500 text-sm">
        {titulo}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {valor}
      </p>
    </div>
  );
}