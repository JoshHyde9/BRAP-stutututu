import {
  MessageWithReactions,
  SortedReaction,
  MessageWithSortedReactions,
} from "..";

export function countAndSortReactions(
  input: MessageWithReactions[]
): MessageWithSortedReactions[];
export function countAndSortReactions(
  input: MessageWithReactions
): MessageWithSortedReactions;
export function countAndSortReactions(
  input: MessageWithReactions | MessageWithReactions[]
): MessageWithSortedReactions | MessageWithSortedReactions[] {
  const messages = Array.isArray(input) ? input : [input];

  const sortedMessages = messages.map((message) => {
    const sortedReactions = message.reactions.reduce(
      (sortedArray, reaction) => {
        const existingReaction = sortedArray.findIndex(
          (item) => item.value === reaction.value
        );

        if (existingReaction >= 0) {
          sortedArray[existingReaction].count =
            (sortedArray[existingReaction].count || 0) + 1;

          sortedArray[existingReaction]?.memberIds.push(reaction.memberId);
        } else {
          const newEntry: SortedReaction = {
            ...reaction,
            count: 1,
            memberIds: [reaction.memberId],
          };

          sortedArray.push(newEntry);
        }
        return sortedArray;
      },
      [] as SortedReaction[]
    );

    return {
      ...message,
      reactions: sortedReactions,
    } as MessageWithSortedReactions;
  });

  return Array.isArray(input) ? sortedMessages : sortedMessages[0]!;
}
