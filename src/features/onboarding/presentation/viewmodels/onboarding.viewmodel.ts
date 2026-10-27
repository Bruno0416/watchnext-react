import {useState} from "react";

import {OnboardingException} from "../../data/errors/onboarding.exceptions";
import {ContentRef} from "../../domain/entities/content.ref";
import type {ContentSearchResult} from "../../domain/entities/content.search.result";
import {OnboardingData} from "../../domain/entities/onboarding.data";

import type {CheckUsername} from "../../domain/usecases/check.username";
import type {CompleteOnboarding} from "../../domain/usecases/complete.onboarding";
import type {SearchContent} from "../../domain/usecases/search.content";
import {
    initialOnboardingState,
    type OnboardingState,
    OnboardingStep,
    SearchStatus,
    UsernameStatus,
} from "../models/onboarding.state";
import {
    validateBio,
    validateCountry,
    validateDisplayName,
    validateFavorites,
    validateUsername
} from "../validations/onboarding.validations.ts";
import type {ProfileVisibility} from "../../../../core/models/profile.visibility.ts";


export function useOnboardingViewModel(
    checkUsername: CheckUsername,
    searchContent: SearchContent,
    completeOnboarding: CompleteOnboarding,
) {
    // ---------- estado ----------
    const [state, setState] = useState<OnboardingState>(
        initialOnboardingState,
    );

    // ---------- pais ----------
    function setCountry(country: string): void {
        setState((current) => ({
            ...current,
            country,
            countryError: null,
            formError: null,
        }));
    }

    function continueFromCountry(): boolean {
        // 1. validar país
        const countryError = validateCountry(state.country);

        if (countryError) {
            setState((current) => ({
                ...current,
                countryError,
            }));

            return false;
        }

        // 2. avanzar al perfil
        setState((current) => ({
            ...current,
            step: OnboardingStep.PROFILE,
        }));

        return true;
    }

    // ---------- perfil ----------
    function setUsername(username: string): void {
        setState((current) => ({
            ...current,
            username: username.toLowerCase(),
            usernameError: null,
            usernameStatus: UsernameStatus.INITIAL,
            formError: null,
        }));
    }

    async function validateUsernameField(): Promise<boolean> {
        // 1. validar formato
        const username = state.username.trim();
        const usernameError = validateUsername(username);

        if (usernameError) {
            setState((current) => ({
                ...current,
                usernameError,
                usernameStatus: UsernameStatus.INITIAL,
            }));

            return false;
        }

        // 2. consultar disponibilidad
        setState((current) => ({
            ...current,
            usernameError: null,
            usernameStatus: UsernameStatus.LOADING,
        }));

        try {
            const available = await checkUsername.call(username);

            setState((current) => {
                if (current.username.trim() !== username) {
                    return current;
                }

                return {
                    ...current,
                    usernameStatus: available
                        ? UsernameStatus.AVAILABLE
                        : UsernameStatus.TAKEN,
                };
            });

            return available;
        } catch {
            setState((current) => ({
                ...current,
                usernameStatus: UsernameStatus.ERROR,
            }));

            return false;
        }
    }

    function setDisplayName(displayName: string): void {
        setState((current) => ({
            ...current,
            displayName,
            displayNameError: null,
            formError: null,
        }));
    }

    function validateDisplayNameField(): void {
        const displayNameError = validateDisplayName(state.displayName);

        setState((current) => ({
            ...current,
            displayNameError,
        }));
    }

    function setBio(bio: string): void {
        setState((current) => ({
            ...current,
            bio,
            bioError: null,
            formError: null,
        }));
    }

    function validateBioField(): void {
        const bioError = validateBio(state.bio);

        setState((current) => ({
            ...current,
            bioError,
        }));
    }

    function setVisibility(visibility: ProfileVisibility): void {
        setState((current) => ({
            ...current,
            visibility,
            formError: null,
        }));
    }

    async function continueFromProfile(): Promise<boolean> {
        // 1. validar campos locales
        const displayNameError = validateDisplayName(state.displayName);
        const bioError = validateBio(state.bio);

        setState((current) => ({
            ...current,
            displayNameError,
            bioError,
        }));

        if (displayNameError || bioError) {
            return false;
        }

        // 2. validar username
        const usernameAvailable = await validateUsernameField();

        if (!usernameAvailable) {
            return false;
        }

        // 3. avanzar a favoritos
        setState((current) => ({
            ...current,
            step: OnboardingStep.FAVORITES,
        }));

        return true;
    }

    // ---------- buscador ----------
    function setSearchQuery(searchQuery: string): void {
        const query = searchQuery.trim();

        setState((current) => ({
            ...current,
            searchQuery,
            searchStatus: SearchStatus.INITIAL,
            ...(query.length < 2
                ? {
                    searchResults: [],
                    searchCorrected: false,
                    searchExecutedQuery: "",
                }
                : {}),
        }));
    }

    async function search(): Promise<void> {
        // 1. validar consulta minima
        const query = state.searchQuery.trim();

        if (query.length < 2) {
            setState((current) => ({
                ...current,
                searchResults: [],
                searchStatus: SearchStatus.INITIAL,
            }));

            return;
        }

        // 2. buscar contenido
        setState((current) => ({
            ...current,
            searchStatus: SearchStatus.LOADING,
        }));

        try {
            const response = await searchContent.call(query);

            setState((current) => ({
                ...current,
                searchResults: response.results,
                searchStatus: SearchStatus.SUCCESS,
                searchCorrected: response.corrected,
                searchExecutedQuery: response.executedQuery,
            }));
        } catch {
            setState((current) => ({
                ...current,
                searchResults: [],
                searchStatus: SearchStatus.ERROR,
            }));
        }
    }

    // ---------- favoritos ----------
    function isFavorite(item: ContentSearchResult): boolean {
        return state.favorites.some(
            (favorite) =>
                favorite.tmdbId === item.tmdbId &&
                favorite.mediaType === item.mediaType,
        );
    }

    function toggleFavorite(item: ContentSearchResult): void {
        // 1. eliminar si ya está seleccionado
        if (isFavorite(item)) {
            setState((current) => ({
                ...current,
                favorites: current.favorites.filter(
                    (favorite) =>
                        favorite.tmdbId !== item.tmdbId ||
                        favorite.mediaType !== item.mediaType,
                ),
                formError: null,
            }));

            return;
        }

        // 2. validar limite
        const favoritesError = validateFavorites(state.favorites.length + 1);

        if (favoritesError) {
            setState((current) => ({
                ...current,
                formError: favoritesError,
            }));

            return;
        }

        // 3. agregar favorito
        setState((current) => ({
            ...current,
            favorites: [...current.favorites, item],
            formError: null,
        }));
    }

    // ---------- navegación ----------
    function previousStep(): void {
        setState((current) => {
            if (current.step === OnboardingStep.FAVORITES) {
                return {
                    ...current,
                    step: OnboardingStep.PROFILE,
                };
            }

            if (current.step === OnboardingStep.PROFILE) {
                return {
                    ...current,
                    step: OnboardingStep.COUNTRY,
                };
            }

            return current;
        });
    }

    // ---------- envio ----------
    async function submit(skipFavorites = false): Promise<boolean> {
        // 1. validar datos finales
        const countryError = validateCountry(state.country);
        const usernameError = validateUsername(state.username);
        const displayNameError = validateDisplayName(state.displayName);
        const bioError = validateBio(state.bio);

        if (
            countryError ||
            usernameError ||
            displayNameError ||
            bioError
        ) {
            setState((current) => ({
                ...current,
                countryError,
                usernameError,
                displayNameError,
                bioError,
            }));

            return false;
        }

        // 2. confirmar disponibilidad del username
        if (state.usernameStatus !== UsernameStatus.AVAILABLE) {
            const available = await validateUsernameField();

            if (!available) {
                return false;
            }
        }

        // 3. construir favoritos
        const favoritesSource = skipFavorites ? [] : state.favorites;

        const favorites = favoritesSource.map(
            (favorite, index) =>
                new ContentRef({
                    tmdbId: favorite.tmdbId,
                    mediaType: favorite.mediaType,
                    position: index,
                }),
        );

        // 4. construir datos del onboarding
        const data = new OnboardingData({
            username: state.username.trim(),
            visibility: state.visibility,
            displayName: state.displayName.trim() || null,
            bio: state.bio.trim() || null,
            country: state.country.toUpperCase(),
            favorites,
        });

        // 5. completar onboarding
        setState((current) => ({
            ...current,
            isSubmitting: true,
            formError: null,
        }));

        try {
            await completeOnboarding.call(data);

            setState((current) => ({
                ...current,
                isSubmitting: false,
            }));

            return true;
        } catch (e) {
            const message =
                e instanceof OnboardingException
                    ? e.message
                    : "Ocurrió un error inesperado";

            setState((current) => ({
                ...current,
                isSubmitting: false,
                formError: message,
            }));

            return false;
        }
    }

    return {
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
    };
}