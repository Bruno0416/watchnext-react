type FieldErrorProps = {
  message: string | null;
};

export function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return <p className="text-danger small mb-0 mt-1">{message}</p>;
}
