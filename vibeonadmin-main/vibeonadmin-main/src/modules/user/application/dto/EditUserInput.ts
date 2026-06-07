export interface EditUserInput {
  id: number;
  name?: string;
  email?: string;
  state?: string;
  status?: string;
  verified?: boolean;
  isContentCreator?: boolean;
  bio?: string;
  banStatus?: string;
  isLive?: boolean;
}
