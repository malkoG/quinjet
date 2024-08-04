interface StatusAttachment {
  url: string;
}

export interface Status {
  mediaAttachments: StatusAttachment[];
  content: string;
}

