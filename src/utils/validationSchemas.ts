import { z } from "zod";

// Create Product Schema
export const createProductSchema = z.object({
  name: z
    .string({
      required_error: "اسم المنتج مطلوب",
      invalid_type_error: "اسم المنتج يجب ان يكون نص",
    })
    .min(10, { message: "يجب الا يقل اسم المنتج عن 10 احرف" })
    .max(100),
  category: z
    .string({
      required_error: "الفئة مطلوبة",
      invalid_type_error: "الفئة يجب ان تكون نص",
    })
    .min(2, { message: "يجب الا يقل الفئة عن 2 احرف" }),
  price: z.number({
    required_error: "سعر المنتج مطلوب",
    invalid_type_error: "السعر يكب ان يكون رقم",
  }),
  quantity: z.number({
    required_error: "الكمية مطلوبة",
    invalid_type_error: "الكمية يجب ان تكون رقم",
  }).min(0, {message: "يجب الكمية تكون قيمة موجبة"}),
});

// Register Schema
export const registerSchema = z.object({
  username: z
    .string({
      required_error: "اسم المستخدم مطلوب",
      invalid_type_error: "اسم المستخدم يجب ان يكون نص",
    })
    .min(5, { message: "يجب الا يقل اسم المستخدم عن 5 احرف" })
    .max(20),
  email: z
    .string({
      required_error: "الايميل مطلوب",
      invalid_type_error: "الايميل يجب ان يكون نص",
    })
    .email(),
  password: z
    .string({
      required_error: "الباسورد مطلوب",
    })
    .min(6, { message: "يجب الا يقل الباسورد عن 6 احرف" })
    .max(25),
});

// login Schema
export const loginSchema = z.object({
  email: z
    .string({
      required_error: "الايميل مطلوب",
      invalid_type_error: "الايميل يجب ان يكون نص",
    })
    .email(),
  password: z
    .string({
      required_error: "الباسورد مطلوب",
    })
    .min(6, { message: "يجب الا يقل الباسورد عن 6 احرف" })
    .max(25),
});
// update profile Schema
export const updateProfileSchema = z.object({
  email: z
    .string({
      invalid_type_error: "الايميل يجب ان يكون نص",
    })
    .email()
    .optional(),
  password: z
    .string({
      invalid_type_error: "الباسورد يجب ان يكون نص",
    })
    .min(6, { message: "يجب الا يقل الباسورد عن 6 احرف" })
    .max(25)
    .optional(),
  username: z
    .string({
      invalid_type_error: "اسم المستخدم يجب ان يكون نص",
    })
    .min(5, { message: "يجب الا يقل اسم المستخدم عن 5 احرف" })
    .max(20)
    .optional(),
});

// Create Trader Schema
export const createTraderSchema = z.object({
  name: z
    .string({
      required_error: "اسم التاجر مطلوب",
      invalid_type_error: "اسم التاجر يجب ان يكون نص",
    })
    .min(3, { message: "يجب الا يقل اسم التاجر عن 3 احرف" })
    .max(40),
  email: z
    .string({
      invalid_type_error: "الايميل يجب ان يكون نص",
    })
    .email()
    .optional(),
  phone: z
    .string({
      invalid_type_error: "رقم الهاتف يجب ان يكون نص",
    })
    .min(10, { message: "يجب الا يقل رقم الهاتف عن 10 احرف" })
    .optional(),
  balance: z.number({
    required_error: "رصيد التاجر مطلوب",
    invalid_type_error: "رصيد التاجر يجب ان يكون رقم",
  }),
});

// Create Withdrawal Schema
export const createWithdrawalSchema = z.object({
  productId: z.number().nullable().optional(),
  quantity: z.number({
    required_error: "الكمية مطلوبة",
    invalid_type_error: "الكمية يجب ان تكون رقم",
  }),
  description: z
    .string({
      required_error: "الوصف مطلوب",
      invalid_type_error: "الوصف يجب ان يكون نص",
    })
    .min(2, { message: "يجب الا يقل الوصف عن 2 احرف" }),
  name: z
    .string({
      required_error: "الاسم مطلوب",
      invalid_type_error: "الاسم يجب ان يكون نص",
    })
    .min(2, { message: "يجب الا يقل الاسم عن 2 احرف" }),
  traderId: z.number().nullable().optional(),
  remainingId: z.number().nullable().optional(),
  installmentId: z.number().nullable().optional(),
  price: z
    .number({
      required_error: "السعر مطلوب",
      invalid_type_error: "السعر يجب ان يكون رقم",
    })
    .min(1, { message: "يجب الا يقل السعر عن 1" }),
});
// update Withdrawal Schema
export const updateWithdrawalSchema = z.object({
  productId: z.number().nullable().optional(),
  quantity: z
    .number({
      required_error: "الكمية مطلوبة",
      invalid_type_error: "الكمية يجب ان تكون رقم",
    })
    .min(1, { message: "يجب الا تقل الكمية عن 1" }),
  description: z.string().nullable().optional(),
  traderId: z.number().nullable().optional(),
  remainingId: z.number().nullable().optional(),
  price: z.number({
    invalid_type_error: "يجب ان يكون السعر رقم",
  }),
});
// Create Supply Schema
export const createSuppliesSchema = z.object({
  productId: z.number().nullable().optional(),
  quantity: z.number({
    required_error: "الكمية مطلوبة",
    invalid_type_error: "الكمية يجب ان تكون رقم",
  }),
  description: z
    .string({
      required_error: "الوصف مطلوب",
      invalid_type_error: "الوصف يجب ان يكون نص",
    })
    .min(2, { message: "يجب الا يقل الوصف عن 2 احرف" }),
  name: z
    .string({
      required_error: "الاسم مطلوب",
      invalid_type_error: "الاسم يجب ان يكون نص",
    })
    .min(2, { message: "يجب الا يقل الوصف عن 2 احرف" }),
  traderId: z.number().nullable().optional(),
  price: z
    .number({
      required_error: "السعر مطلوب",
      invalid_type_error: "السعر يجب ان يكون نص",
    })
    .min(1, { message: "يجب الا يقل السعر عن 1" }),
});
export const updateSupplySchema = z.object({
  productId: z.number().nullable().optional(),
  quantity: z
    .number({
      required_error: "الكمية مطلوب",
      invalid_type_error: "الكمية يجب ان تكون رقم",
    })
    .min(1, { message: "يجب الا تقل الكمية عن 1" }),
  description: z.string().nullable().optional(),
  traderId: z.number().nullable().optional(),
  price: z.number({
    invalid_type_error: "السعر يجب ان يكون رقم",
  }),
});
// create Payment Schema
export const createPaymentSchema = z.object({
  amount: z
    .number({
      required_error: "المبلغ مطلوب",
      invalid_type_error: "الملبغ يجب ان يكون رقم",
    })
    .min(1, { message: "يجب الا يقل المبلغ عن 1" }),
  traderId: z.number().nullable().optional(),
  remainingId: z.number().nullable().optional(),
});

// Create Installment Schema
export const createInstallmentSchema = z.object({
  name: z
    .string({
      required_error: "الاسم مطلوب",
      invalid_type_error: "الاسم يجب ان يكون نص",
    })
    .min(3, { message: "يجب الا يقل الاسم عن 3 احرف" })
    .max(40),
  phone: z
    .string({
      invalid_type_error: "يجب ان يكون رقم الهاتف نص",
    })
    .min(10, { message: "يجب الا يقل رقم الهاتف عن 10 ارقام" })
    .optional(),
  balance: z
    .number({
      required_error: "الرصيد مطلوب",
      invalid_type_error: "الرصيد يجب ان يكون رقم",
    })
    .min(1, { message: "يجب الا يقل الرصيد عن 1" }),
});
// Create Instalment Schema
export const createInstalmentSchema = z.object({
  months: z.number().min(1, "يجب إدخال مده القسط"),
  total: z.number().min(1, "يجب إدخال رصيد العملية"),
  monthPayment: z.number().min(1, "يجب إدخال المبلغ المدفوع في الشهر"),
  dueDate: z.string(),
});
// update Instalment Schema
export const updateInstalmentSchema = z.object({
  amount: z.number({
    required_error: "يجب إدخال المبلغ",
    invalid_type_error: "المبلغ يجب ان يكون رقم",
  }),
  dueDate: z.string().optional().nullable(),
});
