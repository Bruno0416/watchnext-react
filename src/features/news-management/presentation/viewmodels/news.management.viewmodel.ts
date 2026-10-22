import { useEffect, useState } from "react";

import { NewsManagementException } from "../../data/errors/news.management.exceptions";
import type { ManagedNews } from "../../domain/entities/managed.news";
import type { CreateNews } from "../../domain/usecases/create.news";
import type { DeleteNews } from "../../domain/usecases/delete.news";
import type { GetAllNews } from "../../domain/usecases/get.all.news";
import type { UpdateNews } from "../../domain/usecases/update.news";
import {
  initialNewsFormState,
  initialNewsManagementState,
  type NewsFormState,
  type NewsManagementState,
} from "../models/news.management.state";
import {
  hayErrores,
  validateContent,
  validateImageUrl,
  validateNewsDraft,
  validateSummary,
  validateTitle,
} from "../validators/news.validator";

type Campo = "title" | "summary" | "content" | "imageUrl";

function messageOf(e: unknown): string {
  return e instanceof NewsManagementException ? e.message : "Ocurrio un error inesperado";
}

// el filtro: busca en titulo y resumen, sin mayusculas ni tildes
export function filtrarNoticias(news: ManagedNews[], search: string): ManagedNews[] {
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const q = norm(search.trim());
  if (!q) return news;
  return news.filter((n) => norm(n.title).includes(q) || norm(n.summary).includes(q));
}

export function useNewsManagementViewModel(
  getAllNews: GetAllNews,
  createNews: CreateNews,
  updateNews: UpdateNews,
  deleteNews: DeleteNews,
) {
  const [state, setState] = useState<NewsManagementState>(initialNewsManagementState);
  const [form, setForm] = useState<NewsFormState>(initialNewsFormState);
  const [attempt, setAttempt] = useState(0);

  // 1. leer: cargo todas al entrar
  useEffect(() => {
    let cancelled = false;
    getAllNews
      .call()
      .then((news) => {
        if (!cancelled) setState((c) => ({ ...c, news, isLoading: false, error: null }));
      })
      .catch((e: unknown) => {
        if (!cancelled) setState((c) => ({ ...c, news: [], isLoading: false, error: messageOf(e) }));
      });
    return () => {
      cancelled = true;
    };
  }, [getAllNews, attempt]);

  function reload(): void {
    setState((c) => ({ ...c, isLoading: true, error: null }));
    setAttempt((a) => a + 1);
  }

  function setSearch(search: string): void {
    setState((c) => ({ ...c, search }));
  }

  // ---------- formulario ----------
  function openCreate(): void {
    setForm({ ...initialNewsFormState, isOpen: true });
    setState((c) => ({ ...c, okMessage: null, actionError: null }));
  }

  function openEdit(n: ManagedNews): void {
    // parto el formulario con lo que tiene la noticia
    setForm({
      ...initialNewsFormState,
      isOpen: true,
      editingId: n.id,
      title: n.title,
      summary: n.summary,
      content: n.content,
      imageUrl: n.imageUrl ?? "",
    });
    setState((c) => ({ ...c, okMessage: null, actionError: null }));
  }

  function closeForm(): void {
    setForm(initialNewsFormState);
  }

  function setField(campo: Campo, valor: string): void {
    setForm((c) => ({ ...c, [campo]: valor, [`${campo}Error`]: null, formError: null }));
  }

  function validateField(campo: Campo): void {
    const fn = { title: validateTitle, summary: validateSummary, content: validateContent, imageUrl: validateImageUrl }[campo];
    setForm((c) => ({ ...c, [`${campo}Error`]: fn(c[campo]) }));
  }

  // 2 y 3. crear o actualizar segun si hay editingId
  async function submit(): Promise<boolean> {
    const draft = { title: form.title, summary: form.summary, content: form.content, imageUrl: form.imageUrl };
    const errores = validateNewsDraft(draft);
    if (hayErrores(errores)) {
      setForm((c) => ({ ...c, ...errores }));
      return false;
    }

    setForm((c) => ({ ...c, isSubmitting: true }));
    try {
      if (form.editingId) {
        const editada = await updateNews.call(form.editingId, draft);
        // reemplazo la fila en la tabla sin pedir todo de nuevo
        setState((c) => ({ ...c, news: c.news.map((n) => (n.id === editada.id ? editada : n)), okMessage: "Noticia actualizada" }));
      } else {
        const nueva = await createNews.call(draft);
        setState((c) => ({ ...c, news: [nueva, ...c.news], okMessage: "Noticia publicada" }));
      }
      setForm(initialNewsFormState);
      return true;
    } catch (e) {
      setForm((c) => ({ ...c, isSubmitting: false, formError: messageOf(e) }));
      return false;
    }
  }

  // ---------- 4. eliminar, en dos pasos ----------
  function askDelete(id: string): void {
    setState((c) => ({ ...c, deletingId: id, actionError: null, okMessage: null }));
  }

  function cancelDelete(): void {
    setState((c) => ({ ...c, deletingId: null }));
  }

  async function confirmDelete(): Promise<void> {
    const id = state.deletingId;
    if (!id) return;
    setState((c) => ({ ...c, isDeleting: true }));
    try {
      await deleteNews.call(id);
      setState((c) => ({ ...c, news: c.news.filter((n) => n.id !== id), deletingId: null, isDeleting: false, okMessage: "Noticia eliminada" }));
      if (form.editingId === id) setForm(initialNewsFormState);
    } catch (e) {
      setState((c) => ({ ...c, isDeleting: false, actionError: messageOf(e) }));
    }
  }

  return {
    state,
    visibles: filtrarNoticias(state.news, state.search),
    form,
    reload,
    setSearch,
    openCreate,
    openEdit,
    closeForm,
    setField,
    validateField,
    submit,
    askDelete,
    cancelDelete,
    confirmDelete,
  };
}
