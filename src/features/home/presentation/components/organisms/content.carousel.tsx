import { useRef } from "react";

import { ContentCard } from "../../../../../core/ui/components/molecules/content.card";
import type { HomeContent } from "../../../domain/entities/home.content";
import type { HomeContentState } from "../../models/home.state";
import { SectionStatus } from "../atoms/section.status";

// ---------- carrusel de contenido ----------

type ContentCarouselProps = {
  id: string;
  title: string;
  state: HomeContentState;
  onRetry?: () => void;
  getDetailPath?: (content: HomeContent) => string;
  onAddToList?: (content: HomeContent) => void;
};

export function ContentCarousel({
  id,
  title,
  state,
  onRetry,
  getDetailPath,
  onAddToList,
}: ContentCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // ---------- desplazamiento horizontal ----------
  function scroll(direction: -1 | 1): void {
    // 1. obtener pista y distancia proporcional
    const track = trackRef.current;
    if (!track) return;

    const distance = Math.max(track.clientWidth * 0.82, 320);

    // 2. desplazar el carrusel
    track.scrollBy({ left: distance * direction, behavior: "smooth" });
  }

  return (
    <section id={id} className="content-section" aria-labelledby={`${id}-title`}>
      <div className="content-section-header">
        <h2 id={`${id}-title`} className="content-section-title">
          <span>{title}</span>
        </h2>
      </div>

      <SectionStatus title={title} state={state} onRetry={onRetry} />

      {state.items.length > 0 && (
        <div className="content-carousel-shell">
          <button
            type="button"
            className="btn content-scroll-button content-scroll-button-prev"
            onClick={() => scroll(-1)}
            aria-label={`Desplazar ${title} hacia la izquierda`}
          >
            <i className="bi bi-chevron-left" aria-hidden="true" />
          </button>

          <div ref={trackRef} className="content-track" tabIndex={0} aria-label={title}>
            {state.items.map((content) => (
              <ContentCard
                key={`${content.mediaType}-${content.tmdbId}`}
                content={content}
                detailTo={getDetailPath?.(content)}
                onAddToList={onAddToList ? () => onAddToList(content) : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            className="btn content-scroll-button content-scroll-button-next"
            onClick={() => scroll(1)}
            aria-label={`Desplazar ${title} hacia la derecha`}
          >
            <i className="bi bi-chevron-right" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
