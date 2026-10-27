import type { ManagedNews, NewsDraft } from "../entities/managed.news";

// CRUD de noticias para el admin; hoy contra NewsService simulado
export interface NewsManagementRepository {
  getAll(): Promise<ManagedNews[]>;
  create(draft: NewsDraft): Promise<ManagedNews>;
  update(id: string, draft: NewsDraft): Promise<ManagedNews>;
  delete(id: string): Promise<void>;
}
