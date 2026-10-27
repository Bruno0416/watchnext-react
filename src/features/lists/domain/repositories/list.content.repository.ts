import type { ListItem } from "../entities/list.item";

// busco contenido del catalogo para agregarlo a una lista
// lo dejo aparte del ListRepository porque viene de otro servicio (Search)
export interface ListContentRepository {
  search(query: string): Promise<ListItem[]>;
}
