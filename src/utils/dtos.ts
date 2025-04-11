export interface CreateProductDto {
  name: string;
  category: string;
  price: number;
  quantity: number;
}
export interface UpdateProductDto {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}
export interface LoginUserDto {
  email: string;
  password: string;
}
export interface UpdatedUserDto {
  username?: string;
  email?: string;
  password?: string;
}

export interface CreateTraderDto {
  name: string;
  phone?: string;
  email?: string;
  balance: number;
}
export interface UpdatedTraderDto {
  name?: string;
  phone?: string;
  email?: string;
  balance?: number;
}
export interface CreateWithdrawalsDto {
  productId?: number;
  quantity: number;
  description: string;
  name: string;
  traderId?: number;
  remainingId?: number;
  installmentId?: number;
  price: number;
}
export interface UpdatedWithdrawalsDto {
  productId?: number;
  quantity: number;
  description?: string;
  name?: string;
  traderId?: number | null;
  remainingId?: number | null;
  InstallmentId?: number | null;
  price: number;
}
export interface CreateSuppliesDto {
  productId?: number;
  quantity: number;
  description: string;
  name: string;
  traderId?: number;
  price: number;
}
export interface UpdatedSuppliesDto {
  productId?: number;
  quantity: number;
  description?: string;
  name?: string;
  traderId?: number;
  price: number;
}
export interface CreateRemainingDto {
  name: string;
  phone?: string;
  email?: string;
  balance: number;
}
export interface CreatePaymentDto {
  amount: number;
  description: string;
  traderId?: number | null;
  remainingId?: number | null;
}
export interface UpdatePaymentDto {
  amount?: number;
  description?: string;
  traderId?: number | null;
  remainingId?: number | null;
}

export interface CreateInstallmentDto {
  name: string;
  balance: number;
  phone?: string;
}
export interface UpdatedInstallmentDto {
  name?: string;
  phone?: string;
  balance?: number;
}
export interface CreateInstalmentDto {
  months: number;
  total: number;
  monthPayment: number;
  customerId: number;
  dueDate: Date;
}
export interface updatedInstalmentDto {
  months?: number;
  total?: number;
  amount?: number;
  customerId?: number;
  dueDate?: string;
  isPaid?: boolean;
}
