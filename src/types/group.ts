export type GroupWithEmojiIcon = {
  id: string;
  name: string;
  iconType: "emoji";
  iconEmoji: string;
};

export type Group = GroupWithEmojiIcon;
