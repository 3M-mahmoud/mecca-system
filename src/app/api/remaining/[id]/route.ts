import prisma from "@/utils/db";
import { UpdatedTraderDto } from "@/utils/dtos";
import { Withdrawal } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface props {
  params: { id: string };
}

/**
 * @method GET
 * @route ~/api/remaining/:id
 * @desc  Get Single Remaining
 * @access public
 */

export async function GET(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const remaining = await prisma.remainingCustomer.findUnique({
      where: { id: +id },
      include: {
        withdrawals: {
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
    if (!remaining) {
      return NextResponse.json(
        { message: "عميل البواقي غير موجود" },
        { status: 404 }
      );
    }
    return NextResponse.json(remaining, { status: 200 });
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
 * @route ~/api/remaining/:id
 * @desc  update Remaining
 * @access public
 */

export async function PUT(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const remaining = await prisma.remainingCustomer.findUnique({
      where: { id: +id },
    });
    if (!remaining) {
      return NextResponse.json(
        { message: "عميل البواقي غير موجود" },
        { status: 404 }
      );
    }
    const body = (await request.json()) as UpdatedTraderDto;
    const updatedRemaining = await prisma.remainingCustomer.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        balance: body.balance,
        phone: body.phone,
        email: body.email,
      },
    });
    return NextResponse.json(updatedRemaining, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

const deleteTransaction = (withdrawals: Withdrawal[]) => {
  withdrawals.map(async (withdrawal) => {
    if (withdrawal.productId) {
      await prisma.product.update({
        where: { id: withdrawal.productId },
        data: { count: { increment: withdrawal.quantity } }, // تقليل الرصيد لأن المخزن كان زاد بهذه الكمية
      });
    }
  });
};

/**
 * @method DELETE
 * @route ~/api/remaining/:id
 * @desc  delete Remaining
 * @access public
 */

export async function DELETE(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const remaining = await prisma.remainingCustomer.findUnique({
      where: { id: +id },
    });
    if (!remaining) {
      return NextResponse.json(
        { message: "عميل البواقي غير موجود" },
        { status: 404 }
      );
    }
    // ✅ حذف المعاملات المرتبطة أولًا
    const withdrawals = await prisma.withdrawal.findMany({
      where: { remainingId: +id },
    });

    deleteTransaction(withdrawals);
    await prisma.$transaction([
      prisma.withdrawal.deleteMany({ where: { remainingId: +id } }),
      prisma.remainingCustomer.delete({ where: { id: +id } }),
    ]);
    return NextResponse.json(
      { message: "نجح حذف عميل البواقي" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
