// como estoy yo con otro perfil
export enum RelationshipStatus {
  NONE = "NONE",           // no lo sigo
  REQUESTED = "REQUESTED", // le mande solicitud (perfil privado)
  FOLLOWING = "FOLLOWING", // lo sigo
}

export type Relationship = {
  status: RelationshipStatus;
  followsYou: boolean;
};
