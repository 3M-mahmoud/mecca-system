import prisma from "@/utils/db";
import { UpdatedTraderDto } from "@/utils/dtos";
import { Supply, Withdrawal } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface props {
  params: { id: string };
}

/**
 * @method GET
 * @route ~/api/traders/:id
 * @desc  Get Single Trader
 * @access public
 */

export async function GET(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const trader = await prisma.traderCustomer.findUnique({
      where: { id: +id },
      include: {
        withdrawals: {
          orderBy: {
            createdAt: "desc",
          },
        },
        Supply: {
          orderBy: {
            createdAt: "desc",
          },
        },
        payments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!trader) {
      return NextResponse.json(
        { message: "هذا التاجر غير موجود" },
        { status: 404 }
      );
    }
    return NextResponse.json(trader, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route ~/api/traders/:id
 * @desc  update Trader
 * @access public
 */

export async function PUT(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const trader = await prisma.traderCustomer.findUnique({
      where: { id: +id },
    });
    if (!trader) {
      return NextResponse.json(
        { message: "التاجر غير موجود" },
        { status: 404 }
      );
    }
    const body = (await request.json()) as UpdatedTraderDto;
    const updatedTrader = await prisma.traderCustomer.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        balance: body.balance,
        phone: body.phone,
        email: body.email,
      },
    });
    return NextResponse.json(updatedTrader, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

const deleteTransaction = (withdrawals: Withdrawal[], supplies: Supply[]) => {
  withdrawals.map(async (withdrawal) => {
    if (withdrawal.productId) {
      await prisma.product.update({
        where: { id: withdrawal.productId },
        data: { count: { increment: withdrawal.quantity } }, // تقليل الرصيد لأن المخزن كان زاد بهذه الكمية
      });
    }
  });
  supplies.map(async (supply) => {
    if (supply.productId) {
      await prisma.product.update({
        where: { id: supply.productId },
        data: { count: { decrement: supply.quantity } }, // تقليل الرصيد لأن المخزن كان زاد بهذه الكمية
      });
    }
  });
};

/**
 * @method DELETE
 * @route ~/api/traders/:id
 * @desc  delete Trader
 * @access public
 */

export async function DELETE(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const trader = await prisma.traderCustomer.findUnique({
      where: { id: +id },
    });
    if (!trader) {
      return NextResponse.json(
        { message: "هذا التاجر غير موجود" },
        { status: 404 }
      );
    }
    // ✅ حذف المعاملات المرتبطة أولًا
    // ✅ جلب جميع `supply` و `withdrawal` قبل الحذف
    const supplies = await prisma.supply.findMany({
      where: { traderCustomerId: +id },
    });
    const withdrawals = await prisma.withdrawal.findMany({
      where: { traderId: +id },
    });

    deleteTransaction(withdrawals, supplies);
    await prisma.$transaction([
      prisma.supply.deleteMany({ where: { traderCustomerId: +id } }),
      prisma.withdrawal.deleteMany({ where: { traderId: +id } }),
      prisma.payment.deleteMany({ where: { traderId: +id } }),
      prisma.traderCustomer.delete({ where: { id: +id } }),
    ]);
    return NextResponse.json({ message: "نجح حذف التاجر" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
