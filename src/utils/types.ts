export type JWTPayload = {
  id: number;
  username: string;
};
export interface Product {
  id: number;
  name: string;
  price: number;
  count: number;
  category: string;
}
export type Traders = {
  id: number;
  name: string;
  phone: string;
  email: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
};
export type Installments = {
  id: number;
  name: string;
  phone: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  withdrawals: Withdrawal[];
  installments: Instalment[];
};

export type Withdrawal = {
  id: number;
  productId: number | null;
  quantity: number;
  price: number;
  description: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  traderId: number | null;
  remainingId: number | null;
  InstallmentId: number | null;
};
export type Supplies = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  description: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  traderCustomerId: number | null;
};
export type Payments = {
  id: number;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  traderId: number | null;
  remainingId: number | null;
  trader: Traders;
  remaining: Traders;
};
export type Instalment = {
  id: number;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  customerId: number | null;
};

export type ProductResponse = {
  id: number;
  name: string;
  price: number;
  count: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  withdrawals: Withdrawal[];
  supplies: Supplies[];
};
export type TraderResponse = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  balance: number;
  createdAt: string;
  updatedAt: string;
  withdrawals: Withdrawal[];
  Supply: Supplies[];
  payments: Payments[];
};
export type RemainingResponse = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  balance: number;
  createdAt: string;
  updatedAt: string;
  withdrawals: Withdrawal[];
  payments: Payments[];
};
