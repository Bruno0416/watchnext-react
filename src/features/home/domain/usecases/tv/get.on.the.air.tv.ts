import type { HomeContent } from "../../entities/home.content";
import type { HomeRepository } from "../../repositories/home.repository";

export class GetOnTheAirTv {
  constructor(private readonly repository: HomeRepository) {}

  async call(): Promise<HomeContent[]> {
    return this.repository.getOnTheAir();
  }
}
