import { COUNTRY_OPTIONS } from "../../models/country.option";

type CountryStepProps = {
  country: string;
  error: string | null;
  onChange: (country: string) => void;
  onContinue: () => void;
};

export function CountryStep({
  country,
  error,
  onChange,
  onContinue,
}: CountryStepProps) {
  return (
    <section className="onboarding step country">
      <header className="onboarding section header">
        <span className="onboarding eyebrow">Primero, lo básico</span>
        <h1>¿De dónde eres?</h1>

        <p>Selecciona tu país para consultar la disponibilidad de películas y series. No aparecerá en tu perfil público.</p>
      </header>

      <div
        className="onboarding country options"
        role="radiogroup"
        aria-label="País"
      >
        {COUNTRY_OPTIONS.map((option) => {
          const selected = country === option.code;

          return (
            <button
              key={option.code}
              type="button"
              className={`onboarding country option${selected ? " selected" : ""}`}
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.code)}
            >
              <span className="onboarding country flag" aria-hidden="true">
                {option.flag}
              </span>

              <span className="onboarding country identity">
                <strong>{option.name}</strong>
                <span>{option.code}</span>
              </span>

              <span
                className="onboarding country check"
                aria-hidden="true"
              >
                <i className={`bi ${selected ? "bi-check-lg" : "bi-circle"}`} />
              </span>
            </button>
          );
        })}
      </div>

      {error && <p className="onboarding field error">{error}</p>}

      <div className="onboarding actions end">
        <button
          type="button"
          className="btn btn-primary onboarding continue"
          disabled={!country}
          onClick={onContinue}
        >
          Continuar
          <i className="bi bi-arrow-right" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
