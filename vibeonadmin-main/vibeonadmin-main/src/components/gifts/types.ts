export interface Gift {
  id: string;
  giftId: string;
  giftName: string;
  quantity: number;
  totalCost?: number;
  totalValue?: number;
  dateSent?: string;
  dateReceived?: string;
  recipientName?: string;
  recipientId?: number;
  senderName?: string;
  senderId?: number;
}

export interface GiftStat {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export type GiftTabValue = "sent" | "received";

export interface GiftTab {
  label: string;
  value: GiftTabValue;
  gifts: Gift[];
  emptyText: string;
  personLabel: string;
  personKey: "recipientName" | "senderName";
  amountLabel: string;
  amountKey: "totalCost" | "totalValue";
  dateKey: "dateSent" | "dateReceived";
  cardClass: "" | "received";
}
