import { Member, Server, User } from "@workspace/db";

type UserInfo = Pick<User, "id" | "name" | "image" | "displayName" | "createdAt">; 

export type MemberWithUser = Member & {
  user: UserInfo;
};

export type ServerWithMembers = Server & {
  members: MemberWithUser[];
};

export type SectionType = "channel" | "member";;
