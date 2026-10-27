import type { MediaProvider } from "../../../domain/entities/media.detail";
import { MediaProviderLink } from "../molecules/media.provider.link";

export function MediaWatchProviders({
  providers,
}: {
  providers: MediaProvider[];
}) {
  return (
    <section
      className="media-detail-section"
      aria-labelledby="media-watch-title"
    >
      <h2 id="media-watch-title">Dónde ver</h2>
      {providers.length ? (
        <div className="media-detail-providers">
          {providers.map((provider) => (
            <MediaProviderLink
              key={`${provider.name}-${provider.link}`}
              provider={provider}
            />
          ))}
        </div>
      ) : (
        <p className="media-detail-muted">
          No hay proveedores de visualización disponibles.
        </p>
      )}
    </section>
  );
}
