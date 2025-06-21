export type CommunityType =
  | 'History'
  | 'Food'
  | 'Pets'
  | 'Health'
  | 'Fashion'
  | 'Exercise'
  | 'Others';
export interface Post {
  id: number;
  title: string;
  content: string;
  userPostby: string;
  community_type: CommunityType;
  createdAt: Date;
}
