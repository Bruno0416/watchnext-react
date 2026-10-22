type StatProps = {
  value: number | string | null;
  label: string;
};

// un numero con su etiqueta; null = todavia no llega
export function Stat({ value, label }: StatProps) {
  return (
    <div className="admin stat">
      <span className="admin stat-value">{value ?? "—"}</span>
      <span className="admin stat-label">{label}</span>
    </div>
  );
}
