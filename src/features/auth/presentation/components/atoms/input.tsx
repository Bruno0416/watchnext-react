import type { ChangeEvent } from "react";

type InputProps = {
  type?: "text" | "password";
  value: string;
  placeholder?: string;
  disabled?: boolean;
  leadingIcon?: string;
  trailingIcon?: string;
  trailingLabel?: string;
  trailingPressed?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onTrailingClick?: () => void;
};

export function Input({
  type = "text",
  value,
  placeholder,
  disabled = false,
  leadingIcon,
  trailingIcon,
  trailingLabel,
  trailingPressed,
  onChange,
  onBlur,
  onTrailingClick,
}: InputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange(event.target.value);
  }

  return (
    <div className="input-group">
      {leadingIcon && (
        <span className="input-group-text">
          <i className={`bi bi-${leadingIcon}`} />
        </span>
      )}

      <input
        className="form-control auth input"
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleChange}
        onBlur={onBlur}
      />

      {trailingIcon && onTrailingClick && (
        <button
          type="button"
          className="btn auth password"
          aria-label={trailingLabel}
          aria-pressed={trailingPressed}
          onClick={onTrailingClick}
        >
          <i className={`bi bi-${trailingIcon}`} />
        </button>
      )}
    </div>
  );
}
