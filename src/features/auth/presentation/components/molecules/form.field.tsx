import { FieldError } from "../atoms/error.text";
import { Input } from "../atoms/input";

type FormFieldProps = {
  label: string;
  value: string;
  type?: "text" | "password";
  placeholder?: string;
  error: string | null;
  disabled?: boolean;
  leadingIcon?: string;
  trailingIcon?: string;
  trailingLabel?: string;
  trailingPressed?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onTrailingClick?: () => void;
};

export function FormField({
  label,
  value,
  type,
  placeholder,
  error,
  disabled,
  leadingIcon,
  trailingIcon,
  trailingLabel,
  trailingPressed,
  onChange,
  onBlur,
  onTrailingClick,
}: FormFieldProps) {
  return (
    <div className="form field">
      <label className="form-label">{label}</label>

      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        trailingLabel={trailingLabel}
        trailingPressed={trailingPressed}
        onChange={onChange}
        onBlur={onBlur}
        onTrailingClick={onTrailingClick}
      />

      <FieldError message={error} />
    </div>
  );
}
