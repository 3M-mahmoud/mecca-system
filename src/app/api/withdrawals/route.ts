import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { CreateWithdrawalsDto } from "@/utils/dtos";
import { createWithdrawalSchema } from "@/utils/validationSchemas";
import { Withdrawal } from "@prisma/client";

/**
 * @method GET
 * @route ~/api/withdrawals
 * @desc  Get All Withdrawals
 * @access public
 */

export async function GET(request: NextRequest) {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(withdrawals, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "حدث خطأ داخلي، يرجى المحاولة لاحقًا" },
      { status: 500 }
    );
  }
}

/**
 * @method POST
 * @route ~/api/withdrawals
 * @desc  Create New Withdrawal
 * @access public
 */
export async function POST(request: NextRequest) {
  try {
    // استخراج البيانات من الطلب
    const body = (await request.json()) as CreateWithdrawalsDto;

    const product = body.productId
      ? await prisma.product.findUnique({
          where: { id: body.productId },
        })
      : null;
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
    const installment = body.installmentId
      ? await prisma.installmentCustomer.findUnique({
          where: { id: body.installmentId },
        })
      : null;

    // التحقق من صحة البيانات باستخدام Zod
    const validation = createWithdrawalSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    if (body.productId) {
      if (!product) {
        return NextResponse.json(
          { message: "المنتج غير موجود" },
          { status: 404 }
        );
      }

      if (product.count <= 0) {
        return NextResponse.json(
          { message: "هذا المنتج غير متوفر في المخزن" },
          { status: 400 }
        );
      }

      if (product.count < body.quantity) {
        return NextResponse.json(
          { message: "الكمية المطلوبة أكبر من المخزون المتاح" },
          { status: 400 }
        );
      }

      await prisma.product.update({
        where: { id: body.productId },
        data: { count: { decrement: body.quantity } },
      });
    }

    if (body.traderId) {
      if (!trader) {
        return NextResponse.json(
          { message: "التاجر غير موجود" },
          { status: 404 }
        );
      }

      if (product) {
        await prisma.traderCustomer.update({
          where: { id: body.traderId },
          data: { balance: { decrement: body.price * body.quantity } },
        });
      } else {
        await prisma.traderCustomer.update({
          where: { id: body.traderId },
          data: { balance: { decrement: body.price } },
        });
      }
    }
    if (body.remainingId) {
      if (!remaining) {
        return NextResponse.json(
          { message: "عميل البواقي غير موجود" },
          { status: 404 }
        );
      }

      if (product) {
        await prisma.remainingCustomer.update({
          where: { id: body.remainingId },
          data: { balance: { decrement: body.price * body.quantity } },
        });
      } else {
        await prisma.remainingCustomer.update({
          where: { id: body.remainingId },
          data: { balance: { decrement: body.price } },
        });
      }
    }
    if (body.installmentId) {
      if (!installment) {
        return NextResponse.json(
          { message: "عميل الاقساط غير موجود" },
          { status: 404 }
        );
      }

      if (product) {
        await prisma.installmentCustomer.update({
          where: { id: body.installmentId },
          data: { balance: { decrement: body.price * body.quantity } },
        });
      } else {
        await prisma.installmentCustomer.update({
          where: { id: body.installmentId },
          data: { balance: { decrement: body.price } },
        });
      }
    }
    const newWithdrawal: Withdrawal = await prisma.withdrawal.create({
      data: {
        quantity: body.quantity,
        description: body.description,
        traderId: body.traderId,
        remainingId: body.remainingId,
        InstallmentId: body.installmentId,
        price: body.price,
        productId: body.productId,
        name: body.name,
      },
    });
    return NextResponse.json(newWithdrawal, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطأ داخلي، يرجى المحاولة لاحقًا" },
      { status: 500 }
    );
  }
}
