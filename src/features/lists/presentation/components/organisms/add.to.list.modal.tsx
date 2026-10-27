import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";

import { container } from "../../../../../core/di/container";
import { AuthStorage } from "../../../../../core/mock/auth/auth.storage";
import type { MediaCardContent } from "../../../../../core/ui/components/molecules/content.card";
import { ListItem } from "../../../domain/entities/list.item";
import type { MediaList } from "../../../domain/entities/media.list";
import type { GetLists } from "../../../domain/usecases/get.lists";
import type { GetList } from "../../../domain/usecases/get.list";
import type { AddListItem } from "../../../domain/usecases/add.list.item";
import type { RemoveListItem } from "../../../domain/usecases/remove.list.item";
import { ProfileFavorite } from "../../../../profile/domain/entities/profile.favorite";
import type { GetMyProfile } from "../../../../profile/domain/usecases/get.my.profile";
import type { AddFavorite } from "../../../../profile/domain/usecases/add.favorite";
import type { RemoveFavorite } from "../../../../profile/domain/usecases/remove.favorite";

import "./add.to.list.modal.css";

type SaveableContent = MediaCardContent & {
  duration?: number | null;
  numberOfSeasons?: number | null;
};

type Props = {
  content: SaveableContent;
  onClose: () => void;
};

// ---------- selector compartido de favoritos y listas ----------
export function AddToListModal({ content, onClose }: Props) {
  const titleId = useId();
  const closeButton = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const authStorage = container.resolve<AuthStorage>("authStorage");
  const isGuest = !authStorage.getTokens() || !authStorage.getUserId();

  const [lists, setLists] = useState<MediaList[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(() => !isGuest);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  // ---------- accesibilidad del dialogo ----------
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key !== "Tab") return;
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled)',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  // ---------- cargar el estado real del usuario ----------
  useEffect(() => {
    if (isGuest) return;

    let active = true;
    async function load() {
      const getLists = container.resolve<GetLists>("getLists");
      const getList = container.resolve<GetList>("getList");
      const getMyProfile = container.resolve<GetMyProfile>("getMyProfile");

      try {
        const [summaries, profile] = await Promise.all([
          getLists.call(),
          getMyProfile.call(),
        ]);
        const details = await Promise.all(summaries.map((summary) => getList.call(summary.id)));
        if (!active) return;
        setLists(details);
        setIsFavorite(profile.favorites.some(
          (favorite) => favorite.tmdbId === content.tmdbId && favorite.mediaType === content.mediaType,
        ));
      } catch {
        if (active) setError("No pudimos cargar tus listas. Intenta de nuevo.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [content.tmdbId, content.mediaType, isGuest]);

  // ---------- modificar favoritos del perfil ----------
  async function toggleFavorite() {
    if (busy) return;
    setBusy("favorites");
    setError("");
    setMessage("");
    try {
      if (isFavorite) {
        const removeFavorite = container.resolve<RemoveFavorite>("removeFavorite");
        await removeFavorite.call(content.tmdbId, content.mediaType);
        setIsFavorite(false);
        setMessage("Quitado de Favoritos.");
      } else {
        const addFavorite = container.resolve<AddFavorite>("addFavorite");
        await addFavorite.call(new ProfileFavorite({
          tmdbId: content.tmdbId,
          mediaType: content.mediaType,
          title: content.title,
          posterPath: content.posterPath,
          voteAverage: content.voteAverage,
          releaseDate: content.releaseDate,
        }));
        setIsFavorite(true);
        setMessage("Agregado a Favoritos.");
      }
    } catch {
      setError("No se pudo actualizar Favoritos. Intenta de nuevo.");
    } finally {
      setBusy(null);
    }
  }

  // ---------- modificar una lista personalizada ----------
  async function toggleList(list: MediaList) {
    if (busy) return;
    setBusy(list.id);
    setError("");
    setMessage("");
    const exists = list.has(content.tmdbId, content.mediaType);
    try {
      let updated: MediaList;
      if (exists) {
        const remove = container.resolve<RemoveListItem>("removeListItem");
        updated = await remove.call(list.id, content.tmdbId, content.mediaType);
      } else {
        const add = container.resolve<AddListItem>("addListItem");
        updated = await add.call(list.id, new ListItem({
          tmdbId: content.tmdbId,
          mediaType: content.mediaType,
          title: content.title,
          posterPath: content.posterPath,
          voteAverage: content.voteAverage,
          releaseDate: content.releaseDate,
          duration: content.duration ?? null,
          numberOfSeasons: content.numberOfSeasons ?? null,
        }));
      }
      setLists((current) => current.map((entry) => entry.id === list.id ? updated : entry));
      setMessage(exists ? `Quitado de ${list.name}.` : `Agregado a ${list.name}.`);
    } catch {
      setError("No se pudo actualizar la lista. Intenta de nuevo.");
    } finally {
      setBusy(null);
    }
  }

  return createPortal(
    <>
      <div className="modal-backdrop fade show" aria-hidden="true" />
      <div
        className="modal fade show d-block add-to-list-modal"
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-sm" ref={modalRef}>
          <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div className="modal-header border-0 pb-0">
              <h2 className="h6 mb-0" id={titleId}>
                Guardar contenido
                <span className="d-block text-secondary fw-normal small mt-1">{content.title}</span>
              </h2>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                ref={closeButton}
                aria-label="Cerrar"
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>

            <div className="modal-body">
              {isGuest ? (
                <>
                  <p>Inicia sesión para guardar películas y series en tus favoritos y listas.</p>
                  <Link className="btn btn-primary" to="/auth" onClick={onClose}>Iniciar sesión</Link>
                </>
              ) : loading ? (
                <p role="status" className="text-secondary mb-0">Cargando tus listas...</p>
              ) : (
                <>
                  <ul className="list-unstyled d-grid gap-2 mb-0">
                    <li>
                      <label className="add-to-list-choice">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isFavorite}
                          disabled={busy !== null || Boolean(error)}
                          onChange={() => void toggleFavorite()}
                        />
                        <span className="flex-grow-1"><i className="bi bi-heart-fill me-2" aria-hidden="true" />Favoritos</span>
                      </label>
                    </li>
                    {lists.map((list) => (
                      <li key={list.id}>
                        <label className="add-to-list-choice">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={list.has(content.tmdbId, content.mediaType)}
                            disabled={busy !== null}
                            onChange={() => void toggleList(list)}
                          />
                          <span className="flex-grow-1 text-truncate">{list.name}</span>
                          <span className="text-secondary small">{list.items.length}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  {lists.length === 0 && !error && (
                    <p className="text-secondary small mt-3 mb-0">Crea una lista desde Mis listas para organizar más contenido.</p>
                  )}
                  {message && <p className="add-to-list-message small mt-3 mb-0" role="status">{message}</p>}
                </>
              )}
              {error && <p role="alert" className="text-danger small mt-3 mb-0">{error}</p>}
            </div>

            <div className="modal-footer border-0 pt-0">
              <Link className="btn btn-sm btn-outline-secondary" to="/mis-listas" onClick={onClose}>
                Ver mis listas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
