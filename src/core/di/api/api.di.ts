import { asFunction } from "awilix";

import { AuthApiService } from "../../api/auth/auth.api.service";
import { ContentApiService } from "../../api/content/content.api.service";
import { FeedbackApiService } from "../../api/feedback/feedback.api.service";
import { HttpClient } from "../../api/http.client";
import { ListApiService } from "../../api/list/list.api.service";
import { NewsApiService } from "../../api/news/news.api.service";
import { SearchApiService } from "../../api/search/search.api.service";
import { SocialApiService } from "../../api/user/social.api.service";
import { UserApiService } from "../../api/user/user.api.service";
import type { AuthStorage } from "../../mock/auth/auth.storage";

type Deps = {
  httpClient: HttpClient;
  authStorage: AuthStorage;
  userService: UserApiService;
};

// ---------- microservicios reales ----------
// usan los mismos nombres que los mocks, asi las features no cambian
export const apiDi = {
  httpClient: asFunction(({ authStorage }: Deps) => new HttpClient(authStorage)).singleton(),

  authService: asFunction(({ httpClient, authStorage }: Deps) => new AuthApiService(httpClient, authStorage)).singleton(),

  contentService: asFunction(({ httpClient }: Deps) => new ContentApiService(httpClient)).singleton(),

  searchService: asFunction(({ httpClient }: Deps) => new SearchApiService(httpClient)).singleton(),

  feedbackService: asFunction(({ httpClient }: Deps) => new FeedbackApiService(httpClient)).singleton(),

  listService: asFunction(({ httpClient, authStorage }: Deps) => new ListApiService(httpClient, authStorage)).singleton(),

  newsService: asFunction(({ httpClient }: Deps) => new NewsApiService(httpClient)).singleton(),

  userService: asFunction(({ httpClient }: Deps) => new UserApiService(httpClient)).singleton(),

  socialService: asFunction(({ httpClient, userService }: Deps) => new SocialApiService(httpClient, userService)).singleton(),
};
