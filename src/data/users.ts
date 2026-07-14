import type { User } from "@/types/domain";

export const currentUser: User = {
  id: "maya-chen",
  name: "Maya Chen",
  initials: "MC",
  title: "Senior Product Manager",
  roleIds: ["product-builder", "researcher"],
  tokenOverrides: {
    atlas: { dailyLimit: 15000 },
  },
};
