import { CharCounter } from "../atoms/char.counter";

type NewsFormFieldProps = {
  id: string;
  label: string;
  value: string;
  error: string | null;
  max?: number;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  optional?: boolean;
  onChange: (v: string) => void;
  onBlur: () => void;
};

// label + input (o textarea) + error + contador, todo junto
export function NewsFormField({
  id,
  label,
  value,
  error,
  max,
  multiline = false,
  rows = 3,
  placeholder,
  optional = false,
  onChange,
  onBlur,
}: NewsFormFieldProps) {
  const errorId = `${id}-error`;
  const comunes = {
    id,
    value,
    placeholder,
    className: `form-control ${error ? "is-invalid" : ""}`.trim(),
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    onBlur,
  };

  return (
    <div className="nm field">
      <div className="nm field-head">
        <label htmlFor={id} className="form-label">
          {label}
          {optional && <span className="nm optional"> (opcional)</span>}
        </label>
        {max && <CharCounter value={value} max={max} />}
      </div>

      {multiline ? (
        <textarea {...comunes} rows={rows} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...comunes} type="text" onChange={(e) => onChange(e.target.value)} />
      )}

      {error && (
        <div id={errorId} className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
}
