import { ReactNode } from "react";

type TableProps = {
  children: ReactNode;
};

type TableSectionProps = {
  children: ReactNode;
};

type TableRowProps = {
  children: ReactNode;
  className?: string;
};

type TableCellProps = {
  children: ReactNode;
  className?: string;
};

export function Table({ children }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full border-collapse bg-white text-left">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  children,
}: TableSectionProps) {
  return (
    <thead className="bg-slate-100 text-sm text-slate-700">
      {children}
    </thead>
  );
}

export function TableBody({
  children,
}: TableSectionProps) {
  return (
    <tbody className="divide-y divide-slate-200">
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  className = "",
}: TableRowProps) {
  return (
    <tr
      className={`transition hover:bg-slate-50 ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className = "",
}: TableCellProps) {
  return (
    <th
      className={`px-5 py-4 font-semibold ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = "",
}: TableCellProps) {
  return (
    <td
      className={`px-5 py-4 text-sm text-slate-700 ${className}`}
    >
      {children}
    </td>
  );
}