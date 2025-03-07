import { Member, Server, User } from "@workspace/db";

export type MemberWithUser = Member & {
  user: Pick<User, "id" | "name" | "image" | "displayName" | "createdAt">;
};

export type ServerWithMembers = Server & {
  members: MemberWithUser[];
};
