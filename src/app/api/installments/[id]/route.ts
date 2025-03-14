import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { UpdatedInstallmentDto } from "@/utils/dtos";
import { Withdrawal } from "@prisma/client";

interface props {
  params: { id: string };
}

/**
 * @method GET
 * @route ~/api/installments/:id
 * @desc  Get Single Installment
 * @access public
 */

export async function GET(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const installment = await prisma.installmentCustomer.findUnique({
      where: { id: +id },
      include: {
        withdrawals: {
          orderBy: {
            createdAt: "desc",
          },
        },
        installments: true,
      },
    });
    if (!installment) {
      return NextResponse.json(
        { message: "عميل الاقساط غير موجود" },
        { status: 404 }
      );
    }
    return NextResponse.json(installment, { status: 200 });
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
 * @route ~/api/installments/:id
 * @desc  update Installment
 * @access public
 */

export async function PUT(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const installment = await prisma.installmentCustomer.findUnique({
      where: { id: +id },
    });
    if (!installment) {
      return NextResponse.json(
        { message: "عميل الاقساط غير موجود" },
        { status: 404 }
      );
    }
    const body = (await request.json()) as UpdatedInstallmentDto;
    const updatedInstallment = await prisma.installmentCustomer.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        balance: body.balance,
        phone: body.phone,
      },
    });
    return NextResponse.json(updatedInstallment, { status: 200 });
  } catch (error) {
    console.log(error);
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
 * @route ~/api/installments/:id
 * @desc  delete Installment
 * @access public
 */

export async function DELETE(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const installment = await prisma.installmentCustomer.findUnique({
      where: { id: +id },
    });
    if (!installment) {
      return NextResponse.json(
        { message: "عميل الاقساط غير موجود" },
        { status: 404 }
      );
    }
    // ✅ حذف المعاملات المرتبطة أولًا
    const withdrawals = await prisma.withdrawal.findMany({
      where: { InstallmentId: +id },
    });

    deleteTransaction(withdrawals);
    await prisma.$transaction([
      prisma.withdrawal.deleteMany({ where: { InstallmentId: +id } }),
      prisma.installment.deleteMany({ where: { customerId: +id } }),
      prisma.installmentCustomer.delete({ where: { id: +id } }),
    ]);
    return NextResponse.json(
      { message: "نجح حذف عميل الاقساط" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
