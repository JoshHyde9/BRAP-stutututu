import { Member, Server, User } from "@workspace/db";

export type ServerWithMembers = Server & {
  members: (Member & { user: Pick<User, "id" | "name" | "image" | "displayName" | "createdAt"> })[];
};
