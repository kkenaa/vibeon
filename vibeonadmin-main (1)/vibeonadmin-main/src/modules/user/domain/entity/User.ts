import type { UserTransaction } from "./UserTransaction";
import type { UserGiftHistoryItem } from "./UserGiftHistoryItem";
import type { UserReceivedGift } from "./UserReceivedGift";
import type { UserEarnings } from "./UserEarnings";
import type { UserPayoutHistoryItem } from "./UserPayoutHistoryItem";
import type { UserPayoutInfo } from "./UserPayoutInfo";
import type { UserLiveStream } from "./UserLiveStream";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  state: string;
  phone?: string;
  address?: string;
  status: string;
  avatar: string;
  verified: boolean;
  isContentCreator: boolean;
  bio: string;
  followers: number;
  following: number;
  coinBalance: number;
  giftBalance: number;
  totalSpentOnCoins: number;
  releaseDate: string;
  isLive: boolean;
  banStatus: string;
  date?: string;
  transactionHistory: UserTransaction[];
  giftHistory: UserGiftHistoryItem[];
  receivedGifts: UserReceivedGift[];
  earnings: UserEarnings;
  payoutHistory: UserPayoutHistoryItem[];
  payoutInfo: UserPayoutInfo | null;
  liveStreamHistory: UserLiveStream[];
}
