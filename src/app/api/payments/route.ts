import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { CreatePaymentDto } from "@/utils/dtos";
import { createPaymentSchema } from "@/utils/validationSchemas";
import { Payment } from "@prisma/client";

/**
 * @method GET
 * @route ~/api/payments
 * @desc  Get All Payments
 * @access public
 */

export async function GET(request: NextRequest) {
  const payments = await prisma.payment.findMany();
  return NextResponse.json(payments, { status: 200 });
}

/**
 * @method POST
 * @route ~/api/payments
 * @desc  Create New Payment
 * @access public
 */
export async function POST(request: NextRequest) {
  try {
    // استخراج البيانات من الطلب
    const body = (await request.json()) as CreatePaymentDto;
    const trader = body.traderId
      ? await prisma.traderCustomer.findUnique({
          where: { id: body.traderId },
        })
      : null;
    const remaining = body.remainingId
      ? await prisma.remainingCustomer.findUnique({
          where: { id: body.remainingId },
        })
      : null;
    // التحقق من صحة البيانات باستخدام Zod
    const validation = createPaymentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    if (body.traderId) {
      if (!trader) {
        return NextResponse.json(
          { message: "التاجر غير موجود" },
          { status: 404 }
        );
      }
      await prisma.traderCustomer.update({
        where: { id: body.traderId },
        data: { balance: { increment: body.amount } },
      });
    }
    if (body.remainingId) {
      if (!remaining) {
        return NextResponse.json(
          { message: "عميل البواقي غير موجود" },
          { status: 404 }
        );
      }
      await prisma.remainingCustomer.update({
        where: { id: body.remainingId },
        data: { balance: { increment: body.amount } },
      });
    }
    const newPayment: Payment = await prisma.payment.create({
      data: {
        amount: body.amount,
        traderId: body.traderId,
        remainingId: body.remainingId,
      },
    });
    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطأ داخلي، يرجى المحاولة لاحقًا" },
      { status: 500 }
    );
  }
}
