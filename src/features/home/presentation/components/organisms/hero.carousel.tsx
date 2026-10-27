import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { MediaType } from "../../../../../core/models/media.type";
import { getMediaImageUrl } from "../../../../../core/ui/utils/media.image";
import type { HomeContent } from "../../../domain/entities/home.content";

// ---------- carrusel destacado ----------

type HeroCarouselProps = {
  items: HomeContent[];
  getDetailPath?: (content: HomeContent) => string;
  onAddToList?: (content: HomeContent) => void;
};

export function HeroCarousel({ items, getDetailPath, onAddToList }: HeroCarouselProps) {
  const featured = items.slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // ---------- rotacion automatica ----------
  useEffect(() => {
    // 1. evitar rotar si no hay suficientes elementos o esta pausado
    if (featured.length < 2 || paused) return;

    // 2. respetar la preferencia de movimiento reducido
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // 3. rotar con el intervalo del carrusel vanilla
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % featured.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [featured.length, paused]);

  // ---------- gestos tactiles ----------
  function handleTouchEnd(endX: number): void {
    // 1. ignorar gestos cortos o listas de un elemento
    if (touchStartX.current === null || featured.length < 2) return;

    const delta = touchStartX.current - endX;
    touchStartX.current = null;
    if (Math.abs(delta) < 45) return;

    // 2. cambiar el contenido destacado
    setActiveIndex((current) =>
      (current + (delta > 0 ? 1 : -1) + featured.length) % featured.length,
    );
  }

  // ---------- contenido destacado ----------
  const active = featured[activeIndex % featured.length];

  if (!active) {
    return (
      <section id="featured" className="hero-section hero-section-empty" aria-label="Contenido destacado">
        <div className="container-fluid home-container hero-content-wrap">
          <div className="hero-content">
            <span className="hero-kicker">WatchNext</span>
            <h1 className="hero-title">Descubre tu próximo favorito</h1>
            <p className="hero-overview">Explora películas y series a tu ritmo.</p>
          </div>
        </div>
      </section>
    );
  }

  const backdrop = getMediaImageUrl(active.backdropPath ?? active.posterPath, "original");
  const year = active.releaseDate?.slice(0, 4) || "S/F";
  const rating = Number.isFinite(active.voteAverage) ? active.voteAverage.toFixed(1) : "0.0";
  const kind = active.mediaType === MediaType.MOVIE ? "Película" : "Serie";
  const detailTo = getDetailPath?.(active);

  return (
    <section
      id="featured"
      className="hero-section"
      aria-label="Contenido destacado"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        handleTouchEnd(event.changedTouches[0]?.clientX ?? 0);
      }}
    >
      <div className="hero-item" key={`${active.mediaType}-${active.tmdbId}`}>
        {backdrop && (
          <img
            className="hero-backdrop"
            src={backdrop}
            alt={`Imagen de ${active.title}`}
            loading={activeIndex === 0 ? "eager" : "lazy"}
          />
        )}
        <div className="hero-scrim" aria-hidden="true" />

        <div className="container-fluid home-container hero-content-wrap">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span>{kind}</span>
              <span aria-hidden="true">•</span>
              <span>{year}</span>
            </div>

            <h1 className="hero-title">{active.title}</h1>

            <div className="hero-rating" aria-label={`Calificación ${rating} de 10`}>
              <i className="bi bi-star-fill" aria-hidden="true" />
              <strong>{rating}</strong>
              <span>/ 10</span>
            </div>

            <p className="hero-overview">{active.overview}</p>

            <div className="d-flex flex-wrap gap-2">
              {detailTo && (
                <Link className="btn btn-primary hero-action" to={detailTo}>
                  Ver más
                  <i className="bi bi-arrow-up-right" aria-hidden="true" />
                </Link>
              )}
              {onAddToList && (
                <button type="button" className="btn btn-outline-primary hero-action" onClick={() => onAddToList(active)}>
                  <i className="bi bi-plus-lg" aria-hidden="true" /> Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {featured.length > 1 && (
        <div className="hero-indicators" aria-label="Elegir contenido destacado">
          {featured.map((item, index) => (
            <button
              key={`${item.mediaType}-${item.tmdbId}`}
              type="button"
              className={index === activeIndex % featured.length ? "active" : ""}
              aria-label={`Ir al contenido destacado ${index + 1}: ${item.title}`}
              aria-current={index === activeIndex % featured.length ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
