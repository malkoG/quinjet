export interface Account {
  id: string;
  createdAt: string;
  acct: string;
  displayName: string;
  avatar: string;
  avatarStatic: string;
  followersCount: number;
  followingCount: number;
  statusesCount: number;
  header: string;
  headerStatic: string;
}
