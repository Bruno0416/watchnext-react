import type { MediaProvider } from "../../../domain/entities/media.detail";

export function MediaProviderLink({ provider }: { provider: MediaProvider }) {
  return (
    <a
      className="media-detail-provider"
      href={provider.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver en ${provider.name} (abre en otra pestaña)`}
    >
      {provider.iconLight || provider.iconDark ? (
        <picture>
          {provider.iconDark && (
            <source
              media="(prefers-color-scheme: dark)"
              srcSet={provider.iconDark}
            />
          )}
          <img
            src={provider.iconLight ?? provider.iconDark ?? ""}
            alt=""
            loading="lazy"
          />
        </picture>
      ) : (
        <i className="bi bi-play-circle" aria-hidden="true" />
      )}
      <span>{provider.name}</span>
      <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
    </a>
  );
}
