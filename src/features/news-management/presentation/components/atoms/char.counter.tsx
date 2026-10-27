type CharCounterProps = {
  value: string;
  max: number;
};

// contador de letras; se pone rojo si se pasa
export function CharCounter({ value, max }: CharCounterProps) {
  const largo = value.trim().length;
  const pasado = largo > max;
  return (
    <span className={`nm counter ${pasado ? "over" : ""}`.trim()} aria-live="polite">
      {largo}/{max}
    </span>
  );
}
