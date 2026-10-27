import {
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  length?: number;
  disabled?: boolean;
};

export function OtpInput({
  value,
  onChange,
  onBlur,
  length = 6,
  disabled = false,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // ---------- eventos ----------
  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    // 1. obtener ultimo caracter ingresado
    const character = event.target.value.slice(-1).toUpperCase();

    // 2. actualizar codigo
    const characters = Array.from(
      { length },
      (_, position) => value[position] ?? "",
    );

    characters[index] = character;

    onChange(characters.join(""));

    // 3. avanzar al siguiente campo
    if (character && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    // 1. retroceder si el campo actual esta vacio
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    // 1. obtener codigo pegado
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .trim()
      .slice(0, length)
      .toUpperCase();

    // 2. actualizar codigo completo
    onChange(pastedValue);

    // 3. mover foco al ultimo caracter
    const lastIndex = Math.min(pastedValue.length, length) - 1;

    if (lastIndex >= 0) {
      inputRefs.current[lastIndex]?.focus();
    }
  };

  return (
    <div className="auth otp">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          className="form-control auth otp input"
          type="text"
          value={value[index] ?? ""}
          disabled={disabled}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Codigo ${index + 1}`}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onBlur={onBlur}
        />
      ))}
    </div>
  );
}
