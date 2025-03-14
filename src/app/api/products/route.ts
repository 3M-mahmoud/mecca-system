import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { CreateProductDto } from "@/utils/dtos";
import { createProductSchema } from "@/utils/validationSchemas";
import { Product } from "@prisma/client";

/**
 * @method GET
 * @route ~/api/products
 * @desc  Get All Products
 * @access public
 */

export async function GET(request: NextRequest) {
  const articles = await prisma.product.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
  return NextResponse.json(articles, { status: 200 });
}

/**
 * @method POST
 * @route ~/api/products
 * @desc  Create New Product
 * @access public
 */

export async function POST(request: NextRequest) {
  try {
    const products = await prisma.product.findMany();
    const body = (await request.json()) as CreateProductDto;
    // validation
    const validation = createProductSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    const Founded = products.find(
      (product) =>
        product.name === body.name &&
        product.category === body.category &&
        product.price === body.price
    );
    if (Founded) {
      await prisma.product.update({
        where: { id: Founded.id },
        data: { count: { increment: body.quantity } },
      });
      return NextResponse.json(
        { message: "المنتج موجود بالفعل، ونجح زيادة كمية المنتج" },
        { status: 200 }
      );
    }
    const newProduct: Product = await prisma.product.create({
      data: {
        name: body.name,
        category: body.category,
        price: body.price,
        count: body.quantity,
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطا في السيرفر" },
      { status: 500 }
    );
  }
}
