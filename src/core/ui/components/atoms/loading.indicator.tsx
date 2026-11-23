type LoadingIndicatorProps = {
  message?: string;
  small?: boolean;
};

export function LoadingIndicator({
  message = "Cargando...",
  small = false,
}: LoadingIndicatorProps) {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center gap-2 text-center${small ? "" : " py-4"}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`spinner-border text-primary${small ? " spinner-border-sm" : ""}`}
        aria-hidden="true"
      />
      <span className="visually-hidden">{message}</span>
    </div>
  );
}
