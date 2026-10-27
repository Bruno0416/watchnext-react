export enum AdminUserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type AdminUserProps = {
  userId: string;
  email: string;
  role: AdminUserRole;
  emailVerified: boolean;
  username: string | null;
  displayName: string | null;
  country: string | null;
  isPrivate: boolean;
  onboardingCompleted: boolean;
  followersCount: number;
  followingCount: number;
  favoritesCount: number;
  createdAt: Date | null;
};

// un usuario visto por el admin: junta la cuenta (auth) y el perfil (user)
export class AdminUser {
  constructor(public readonly props: AdminUserProps) {}

  get userId(): string {
    return this.props.userId;
  }

  get email(): string {
    return this.props.email;
  }

  get role(): AdminUserRole {
    return this.props.role;
  }

  get isAdmin(): boolean {
    return this.props.role === AdminUserRole.ADMIN;
  }

  get username(): string | null {
    return this.props.username;
  }

  // si no tiene nombre ni username (no termino el onboarding) muestro el correo
  get shownName(): string {
    return this.props.displayName?.trim() || this.props.username || this.props.email;
  }

  get country(): string | null {
    return this.props.country;
  }

  get isPrivate(): boolean {
    return this.props.isPrivate;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  get onboardingCompleted(): boolean {
    return this.props.onboardingCompleted;
  }

  get followersCount(): number {
    return this.props.followersCount;
  }

  get followingCount(): number {
    return this.props.followingCount;
  }

  get favoritesCount(): number {
    return this.props.favoritesCount;
  }

  get createdAt(): Date | null {
    return this.props.createdAt;
  }
}
