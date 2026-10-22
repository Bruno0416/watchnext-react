// un perfil en una lista de seguidores, seguidos o solicitudes
export type ProfileSummaryProps = {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isPrivate: boolean;
};

export class ProfileSummary {
  constructor(public readonly props: ProfileSummaryProps) {}

  get userId(): string {
    return this.props.userId;
  }

  get username(): string {
    return this.props.username;
  }

  get shownName(): string {
    return this.props.displayName?.trim() || this.props.username;
  }

  get avatarUrl(): string | null {
    return this.props.avatarUrl;
  }

  get isPrivate(): boolean {
    return this.props.isPrivate;
  }

  get initials(): string {
    const parts = this.shownName.split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
  }
}
