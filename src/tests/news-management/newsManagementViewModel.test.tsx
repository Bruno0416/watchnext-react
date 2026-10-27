// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";

import { ManagedNews, type NewsDraft } from "../../features/news-management/domain/entities/managed.news";
import type { NewsManagementRepository } from "../../features/news-management/domain/repositories/news.management.repository";
import { CreateNews } from "../../features/news-management/domain/usecases/create.news";
import { DeleteNews } from "../../features/news-management/domain/usecases/delete.news";
import { GetAllNews } from "../../features/news-management/domain/usecases/get.all.news";
import { UpdateNews } from "../../features/news-management/domain/usecases/update.news";
import {
  filtrarNoticias,
  useNewsManagementViewModel,
} from "../../features/news-management/presentation/viewmodels/news.management.viewmodel";

afterEach(() => cleanup());

// repositorio falso en memoria, asi pruebo el viewmodel sin el mock ni fetch
class RepoFalso implements NewsManagementRepository {
  datos: ManagedNews[] = [nueva("1", "Una lista para no perder nada"), nueva("2", "Cuatro titulos para ti")];
  private siguiente = 3;

  async getAll() {
    return [...this.datos];
  }
  async create(d: NewsDraft) {
    const n = nueva(String(this.siguiente++), d.title, d.summary);
    this.datos.unshift(n);
    return n;
  }
  async update(id: string, d: NewsDraft) {
    const n = nueva(id, d.title, d.summary);
    this.datos = this.datos.map((x) => (x.id === id ? n : x));
    return n;
  }
  async delete(id: string) {
    this.datos = this.datos.filter((x) => x.id !== id);
  }
}

function nueva(id: string, title: string, summary = "Resumen de prueba"): ManagedNews {
  return new ManagedNews({ id, slug: id, title, summary, content: "x".repeat(40), imageUrl: null, publishedAt: new Date() });
}

function montar() {
  const repo = new RepoFalso();
  // los casos de uso se crean una vez, como en el contenedor (si no, el efecto se dispara en cada render)
  const casos = [new GetAllNews(repo), new CreateNews(repo), new UpdateNews(repo), new DeleteNews(repo)] as const;
  const hook = renderHook(() => useNewsManagementViewModel(...casos));
  return { repo, ...hook };
}

// lleno el formulario con datos validos
function llenar(result: ReturnType<typeof montar>["result"], titulo: string) {
  act(() => {
    result.current.setField("title", titulo);
    result.current.setField("summary", "Lo que llega este mes al catalogo.");
    result.current.setField("content", "Este mes sumamos varios titulos nuevos para tus listas.");
  });
}

test("HU14 CRUD leer: carga las noticias al entrar", async () => {
  const { result } = montar();

  // espero a que termine de cargar
  await waitFor(() => expect(result.current.state.isLoading).toBe(false));

  expect(result.current.state.news.length).toBe(2);
});

test("HU14 CRUD crear: publica una noticia y queda primera", async () => {
  const { result, repo } = montar();
  await waitFor(() => expect(result.current.state.isLoading).toBe(false));

  act(() => result.current.openCreate());
  llenar(result, "Estrenos de noviembre");
  await act(async () => {
    await result.current.submit();
  });

  expect(result.current.state.news[0].title).toBe("Estrenos de noviembre");
  expect(result.current.state.okMessage).toBe("Noticia publicada");
  expect(repo.datos.length).toBe(3);
});

test("HU14 CRUD actualizar: edita el titulo sin cambiar el resto de la tabla", async () => {
  const { result } = montar();
  await waitFor(() => expect(result.current.state.isLoading).toBe(false));

  // abro la primera para editar
  act(() => result.current.openEdit(result.current.state.news[0]));
  expect(result.current.form.editingId).toBe("1");
  llenar(result, "Titulo corregido");
  await act(async () => {
    await result.current.submit();
  });

  expect(result.current.state.news[0].title).toBe("Titulo corregido");
  expect(result.current.state.news.length).toBe(2);
});

test("HU14 CRUD eliminar: pide confirmacion y despues borra", async () => {
  const { result } = montar();
  await waitFor(() => expect(result.current.state.isLoading).toBe(false));

  // primer paso: solo marca cual se va a borrar
  act(() => result.current.askDelete("2"));
  expect(result.current.state.deletingId).toBe("2");
  expect(result.current.state.news.length).toBe(2);

  // segundo paso: confirmar
  await act(async () => {
    await result.current.confirmDelete();
  });
  expect(result.current.state.news.map((n) => n.id)).toEqual(["1"]);
});

test("HU14: con datos invalidos no se envia nada", async () => {
  const { result, repo } = montar();
  await waitFor(() => expect(result.current.state.isLoading).toBe(false));

  act(() => result.current.openCreate());
  let ok = true;
  await act(async () => {
    ok = await result.current.submit();
  });

  expect(ok).toBe(false);
  expect(result.current.form.titleError).toBe("El titulo es obligatorio");
  expect(repo.datos.length).toBe(2);
});

test("HU14 filtro: busca por titulo sin importar mayusculas ni tildes", () => {
  const lista = [nueva("1", "Cuatro títulos para ti"), nueva("2", "Estrenos")];

  expect(filtrarNoticias(lista, "TITULOS").map((n) => n.id)).toEqual(["1"]);
  expect(filtrarNoticias(lista, "").length).toBe(2);
  expect(filtrarNoticias(lista, "zzz").length).toBe(0);
});
