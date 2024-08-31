import type { Account } from "./account";

interface StatusAttachment {
  url: string;
}

export interface Status {
  id: string;
  mediaAttachments: StatusAttachment[];
  content: string;
  url: string;
  uri: string;
  reblogsCount: number;
  favouritesCount: number;
  reblogged: boolean;
  favourited: boolean;
  muted: boolean;
  createdAt: string;
  account: Account;
}

