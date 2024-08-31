interface StatusAttachment {
  url: string;
}

export interface Status {
  id: string;
  mediaAttachments: StatusAttachment[];
  content: string;
}

