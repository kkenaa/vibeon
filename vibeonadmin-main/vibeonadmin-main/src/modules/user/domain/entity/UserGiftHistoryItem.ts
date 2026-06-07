export interface UserGiftHistoryItem {
    id: string;
    giftId: string;
    giftName: string;
    quantity: number;
    totalCost: number;
    dateSent: string;
    recipientName: string;
    recipientId: number;
  }