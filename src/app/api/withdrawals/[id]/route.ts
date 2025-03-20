import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { UpdatedWithdrawalsDto } from "@/utils/dtos";
import { updateWithdrawalSchema } from "@/utils/validationSchemas";

interface props {
  params: { id: string };
}

/**
 * @method GET
 * @route ~/api/withdrawals/:id
 * @desc  Get Single Withdrawal
 * @access public
 */

export async function GET(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: +id },
      include: {
        product: true,
        trader: true,
        remaining: true,
      },
    });
    if (!withdrawal) {
      return NextResponse.json(
        { message: "عميلة السحب غير موجوده" },
        { status: 404 }
      );
    }
    return NextResponse.json(withdrawal, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route ~/api/withdrawals/:id
 * @desc  update Withdrawal
 * @access public
 */

export async function PUT(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: +id },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { message: "عميلة السحب غير موجوده" },
        { status: 404 }
      );
    }
    const body = (await request.json()) as UpdatedWithdrawalsDto;
    const validation = updateWithdrawalSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    if (body.productId) {
      const product = await prisma.product.findUnique({
        where: { id: body.productId },
      });
      if (product) {
        if (body.productId === withdrawal.productId) {
          if (body.quantity) {
            const productWithdrawal = await prisma.product.findUnique({
              where: { id: withdrawal.productId },
            });

            if (
              productWithdrawal &&
              productWithdrawal?.count < body.quantity - withdrawal.quantity
            ) {
              return NextResponse.json(
                { message: "الكمية غير متوفرة" },
                { status: 400 }
              );
            }
            await prisma.product.update({
              where: { id: withdrawal.productId },
              data: {
                count: { decrement: body.quantity - withdrawal.quantity },
              },
            });
          }
        }
        if (body.productId !== withdrawal.productId) {
          if (withdrawal.productId) {
            await prisma.product.update({
              where: { id: withdrawal.productId },
              data: { count: { increment: withdrawal.quantity } },
            });
          }
          if (body.quantity) {
            if (product.count >= body.quantity) {
              await prisma.product.update({
                where: { id: body.productId },
                data: { count: { decrement: body.quantity } },
              });
            } else {
              return NextResponse.json(
                { message: "الكمية غير متوفرة" },
                { status: 400 }
              );
            }
          }
        }
      }
    } else {
      if (withdrawal.productId) {
        await prisma.product.update({
          where: { id: withdrawal.productId },
          data: {
            count: { increment: withdrawal.quantity },
          },
        });
      }
    }
    if (body.traderId) {
      const trader = await prisma.traderCustomer.findUnique({
        where: { id: body.traderId },
      });
      if (trader) {
        if (body.traderId === withdrawal.traderId) {
          if (body.price && body.quantity) {
            await prisma.traderCustomer.update({
              where: { id: withdrawal.traderId },
              data: {
                balance: {
                  decrement:
                    body.price * body.quantity -
                    withdrawal.price * withdrawal.quantity,
                },
              },
            });
          }
        }
        if (body.traderId !== withdrawal.traderId) {
          if (withdrawal.traderId) {
            await prisma.traderCustomer.update({
              where: { id: withdrawal.traderId },
              data: {
                balance: { increment: withdrawal.price * withdrawal.quantity },
              },
            });
          }
          if (body.price && body.quantity) {
            await prisma.traderCustomer.update({
              where: { id: body.traderId },
              data: { balance: { decrement: body.price * body.quantity } },
            });
          }
        }
      }
    }
    if (body.remainingId) {
      const remaining = await prisma.remainingCustomer.findUnique({
        where: { id: body.remainingId },
      });
      if (remaining) {
        if (body.remainingId === withdrawal.remainingId) {
          if (body.price && body.quantity) {
            await prisma.remainingCustomer.update({
              where: { id: withdrawal.remainingId },
              data: {
                balance: {
                  decrement:
                    body.price * body.quantity -
                    withdrawal.price * withdrawal.quantity,
                },
              },
            });
          }
        }
        if (body.remainingId !== withdrawal.remainingId) {
          if (withdrawal.remainingId) {
            await prisma.remainingCustomer.update({
              where: { id: withdrawal.remainingId },
              data: {
                balance: { increment: withdrawal.price * withdrawal.quantity },
              },
            });
          }
          if (body.price && body.quantity) {
            await prisma.remainingCustomer.update({
              where: { id: body.remainingId },
              data: { balance: { decrement: body.price * body.quantity } },
            });
          }
        }
      }
    }
    if (body.InstallmentId) {
      const installment = await prisma.installmentCustomer.findUnique({
        where: { id: body.InstallmentId },
      });
      if (installment) {
        if (body.InstallmentId === withdrawal.InstallmentId) {
          if (body.price && body.quantity) {
            await prisma.installmentCustomer.update({
              where: { id: withdrawal.InstallmentId },
              data: {
                balance: {
                  decrement:
                    body.price * body.quantity -
                    withdrawal.price * withdrawal.quantity,
                },
              },
            });
          }
        }
        if (body.InstallmentId !== withdrawal.InstallmentId) {
          if (withdrawal.InstallmentId) {
            await prisma.installmentCustomer.update({
              where: { id: withdrawal.InstallmentId },
              data: {
                balance: { increment: withdrawal.price * withdrawal.quantity },
              },
            });
          }
          if (body.price && body.quantity) {
            await prisma.installmentCustomer.update({
              where: { id: body.InstallmentId },
              data: { balance: { decrement: body.price * body.quantity } },
            });
          }
        }
      }
    }

    const updatedWithdrawal = await prisma.withdrawal.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        productId: body.productId,
        quantity: body.quantity,
        traderId: body.traderId,
        remainingId: body.remainingId,
      },
    });
    return NextResponse.json(updatedWithdrawal, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
/**
 * @method DELETE
 * @route ~/api/withdrawals/:id
 * @desc  delete Withdrawal
 * @access public
 */

export async function DELETE(request: NextRequest, { params }: props) {
  try {
    const { id } = await params;
    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id: +id },
    });
    if (!withdrawal) {
      return NextResponse.json(
        { message: "عميلة السحب غير موجوده" },
        { status: 404 }
      );
    }
    if (withdrawal.productId) {
      await prisma.product.update({
        where: { id: withdrawal.productId },
        data: { count: { increment: withdrawal.quantity } },
      });
    }
    if (withdrawal.traderId) {
      await prisma.traderCustomer.update({
        where: { id: withdrawal.traderId },
        data: {
          balance: { increment: withdrawal.price * withdrawal.quantity },
        },
      });
    }
    if (withdrawal.remainingId) {
      await prisma.remainingCustomer.update({
        where: { id: withdrawal.remainingId },
        data: {
          balance: { increment: withdrawal.price * withdrawal.quantity },
        },
      });
    }
    if (withdrawal.InstallmentId) {
      console.log(withdrawal.InstallmentId);
      await prisma.installmentCustomer.update({
        where: { id: withdrawal.InstallmentId },
        data: {
          balance: { increment: withdrawal.price * withdrawal.quantity },
        },
      });
    }
    const deletedWithdrawal = await prisma.withdrawal.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(
      { message: "نجح حذف عملية السحب" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
