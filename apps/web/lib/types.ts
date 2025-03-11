import { Member, Server, User } from "@workspace/db";

export type UserInfo = Pick<User, "id" | "name" | "image" | "displayName" | "createdAt">; 

export type MemberWithUser = Member & {
  user: UserInfo;
};

export type ServerWithMembers = Server & {
  members: MemberWithUser[];
};

export type SectionType = "channel" | "member";

// TODO: add support for conversations
export type QueryParamsKeys = "channelId" | "serverId";
