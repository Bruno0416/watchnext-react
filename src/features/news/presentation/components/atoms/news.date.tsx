type NewsDateProps = {
  value: Date;
  className?: string;
};

// fecha en español de chile, y dejo el iso en dateTime para que sea semantico
const formatter = new Intl.DateTimeFormat("es-CL", { dateStyle: "long" });

export function NewsDate({ value, className = "" }: NewsDateProps) {
  return (
    <time
      className={`news date ${className}`.trim()}
      dateTime={value.toISOString()}
    >
      {formatter.format(value)}
    </time>
  );
}
