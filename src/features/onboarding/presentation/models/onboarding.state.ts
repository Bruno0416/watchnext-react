import { ProfileVisibility } from "../../../../core/models/profile.visibility";
import type { ContentSearchResult } from "../../domain/entities/content.search.result";

export enum OnboardingStep {
  COUNTRY,
  PROFILE,
  FAVORITES,
}

export enum UsernameStatus {
  INITIAL,
  LOADING,
  AVAILABLE,
  TAKEN,
  ERROR,
}

export enum SearchStatus {
  INITIAL,
  LOADING,
  SUCCESS,
  ERROR,
}

export type OnboardingState = {
  step: OnboardingStep;

  country: string;
  countryError: string | null;

  username: string;
  usernameError: string | null;
  usernameStatus: UsernameStatus;

  displayName: string;
  displayNameError: string | null;

  bio: string;
  bioError: string | null;

  visibility: ProfileVisibility;

  searchQuery: string;
  searchResults: ContentSearchResult[];
  searchStatus: SearchStatus;
  searchCorrected: boolean;
  searchExecutedQuery: string;

  favorites: ContentSearchResult[];

  isSubmitting: boolean;
  formError: string | null;
};

export const initialOnboardingState: OnboardingState = {
  step: OnboardingStep.COUNTRY,

  country: "",
  countryError: null,

  username: "",
  usernameError: null,
  usernameStatus: UsernameStatus.INITIAL,

  displayName: "",
  displayNameError: null,

  bio: "",
  bioError: null,

  visibility: ProfileVisibility.PRIVATE,

  searchQuery: "",
  searchResults: [],
  searchStatus: SearchStatus.INITIAL,
  searchCorrected: false,
  searchExecutedQuery: "",

  favorites: [],

  isSubmitting: false,
  formError: null,
};
