import { useNavigate } from "react-router";

import { container } from "../../../../core/di/container";
import type { CheckUsername } from "../../domain/usecases/check.username";
import type { CompleteOnboarding } from "../../domain/usecases/complete.onboarding";
import type { SearchContent } from "../../domain/usecases/search.content";
import { CountryStep } from "../components/organisms/country.step";
import { FavoritesStep } from "../components/organisms/favorites.step";
import { ProfileStep } from "../components/organisms/profile.step";
import { OnboardingStep } from "../models/onboarding.state";
import { useOnboardingViewModel } from "../viewmodels/onboarding.viewmodel";

import "./style/onboarding.page.css";

export function OnboardingPage() {
  const navigate = useNavigate();

  // ---------- dependencias ----------
  const checkUsername = container.resolve<CheckUsername>("checkUsername");

  const searchContent = container.resolve<SearchContent>("searchContent");

  const completeOnboarding =
    container.resolve<CompleteOnboarding>("completeOnboarding");

  // ---------- viewmodel ----------
  const {
    state,
    setCountry,
    continueFromCountry,
    setUsername,
    validateUsernameField,
    setDisplayName,
    validateDisplayNameField,
    setBio,
    validateBioField,
    setVisibility,
    continueFromProfile,
    setSearchQuery,
    search,
    isFavorite,
    toggleFavorite,
    previousStep,
    submit,
  } = useOnboardingViewModel(checkUsername, searchContent, completeOnboarding);

  async function handleFinish(skipFavorites = false): Promise<void> {
    // 1. completar onboarding
    const success = await submit(skipFavorites);

    if (!success) {
      return;
    }

    // 2. volver al redirect principal
    navigate("/", { replace: true });
  }

  const stepNumber = state.step + 1;
  const stepLabel = ["País", "Perfil", "Favoritos"][state.step];

  return (
    <main className="onboarding page root">
      <div className="onboarding shell">
        <header className="onboarding page header">
          <span className="onboarding brand">WatchNext</span>

          <div className="onboarding progress">
            <div className="onboarding progress label">
              <span>Paso {stepNumber} de 3</span>
              <strong>{stepLabel}</strong>
            </div>

            <div className="onboarding progress track">
              <div
                className="onboarding progress value"
                style={{
                  width: `${(stepNumber / 3) * 100}%`,
                }}
              />
            </div>
          </div>
        </header>

        <div className="onboarding content">
          {state.step === OnboardingStep.COUNTRY && (
            <CountryStep
              country={state.country}
              error={state.countryError}
              onChange={setCountry}
              onContinue={continueFromCountry}
            />
          )}

          {state.step === OnboardingStep.PROFILE && (
            <ProfileStep
              username={state.username}
              usernameError={state.usernameError}
              usernameStatus={state.usernameStatus}
              displayName={state.displayName}
              displayNameError={state.displayNameError}
              bio={state.bio}
              bioError={state.bioError}
              visibility={state.visibility}
              onUsernameChange={setUsername}
              onUsernameBlur={() => {
                void validateUsernameField();
              }}
              onDisplayNameChange={setDisplayName}
              onDisplayNameBlur={validateDisplayNameField}
              onBioChange={setBio}
              onBioBlur={validateBioField}
              onVisibilityChange={setVisibility}
              onBack={previousStep}
              onContinue={() => {
                void continueFromProfile();
              }}
            />
          )}

          {state.step === OnboardingStep.FAVORITES && (
            <FavoritesStep
              query={state.searchQuery}
              results={state.searchResults}
              favorites={state.favorites}
              status={state.searchStatus}
              corrected={state.searchCorrected}
              executedQuery={state.searchExecutedQuery}
              isSubmitting={state.isSubmitting}
              onQueryChange={setSearchQuery}
              onSearch={search}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onBack={previousStep}
              onFinish={() => {
                void handleFinish(false);
              }}
              onSkip={() => {
                void handleFinish(true);
              }}
            />
          )}

          {state.formError && (
            <p className="text-danger text-center mt-3 mb-0">
              {state.formError}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
