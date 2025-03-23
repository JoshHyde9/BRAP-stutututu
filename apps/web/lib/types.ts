import { Member, Server, User } from "@workspace/db";

export type UserInfo = Pick<
  User,
  "id" | "name" | "image" | "displayName" | "createdAt"
>;

export type MemberWithUser = Member & {
  user: UserInfo;
};

export type ServerWithMembers = Server & {
  members: MemberWithUser[];
};

export type SectionType = "channel" | "member";

export type ChannelServerParams = Record<'channelId' | 'serverId', string> & 
  Partial<Record<'conversationId', string>>;

export type ConversationParams = Record<'conversationId', string> & 
  Partial<Record<'channelId' | 'serverId', string>>;

export type QueryParamsKeys = ChannelServerParams | ConversationParams;