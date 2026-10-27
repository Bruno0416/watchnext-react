import type { ReactNode } from "react";

import type { ProfileSummary } from "../../../domain/entities/profile.summary";
import { ProfileStatus } from "../atoms/profile.status";
import { PersonRow } from "../molecules/person.row";

type PeopleListProps = {
  people: ProfileSummary[];
  emptyTitle: string;
  emptyDescription?: string;
  actions?: (p: ProfileSummary) => ReactNode;
};

export function PeopleList({ people, emptyTitle, emptyDescription, actions }: PeopleListProps) {
  if (people.length === 0) {
    return <ProfileStatus icon="people" title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <ul className="profile people">
      {people.map((p) => (
        <PersonRow key={p.userId} person={p}>
          {actions?.(p)}
        </PersonRow>
      ))}
    </ul>
  );
}
