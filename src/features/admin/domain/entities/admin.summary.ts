// numeros que muestra el panel de administracion
export type AdminSummaryProps = {
  totalUsers: number;
  admins: number;
  pendingOnboarding: number;
  totalNews: number;
  lastNewsAt: Date | null;
};

export class AdminSummary {
  constructor(public readonly props: AdminSummaryProps) {}

  get totalUsers(): number {
    return this.props.totalUsers;
  }

  get admins(): number {
    return this.props.admins;
  }

  get pendingOnboarding(): number {
    return this.props.pendingOnboarding;
  }

  get totalNews(): number {
    return this.props.totalNews;
  }

  get lastNewsAt(): Date | null {
    return this.props.lastNewsAt;
  }
}
