import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/lib/products";

function getCurrentUserFromToken(token?: string) {
  if (!token) {
    return null;
  }

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  return getCurrentUserFromToken(token);
}

function isAdmin(user: { role: string } | null) {
  return user?.role === "admin";
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Not authenticated." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    products: getProducts(),
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    return NextResponse.json(
      { message: "Only admin can add products." },
      { status: 403 }
    );
  }

  const body = await request.json();

  const { name, description, price } = body;

  if (!name || !description || !price) {
    return NextResponse.json(
      { message: "Name, description, and price are required." },
      { status: 400 }
    );
  }

  const product = addProduct({
    name,
    description,
    price: Number(price),
  });

  return NextResponse.json(
    {
      message: "Product added successfully.",
      product,
    },
    { status: 201 }
  );
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    return NextResponse.json(
      { message: "Only admin can update products." },
      { status: 403 }
    );
  }

  const body = await request.json();

  const { id, name, description, price } = body;

  if (!id || !name || !description || !price) {
    return NextResponse.json(
      { message: "ID, name, description, and price are required." },
      { status: 400 }
    );
  }

  const updatedProduct = updateProduct(Number(id), {
    name,
    description,
    price: Number(price),
  });

  if (!updatedProduct) {
    return NextResponse.json(
      { message: "Product not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Product updated successfully.",
    product: updatedProduct,
  });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();

  if (!isAdmin(user)) {
    return NextResponse.json(
      { message: "Only admin can delete products." },
      { status: 403 }
    );
  }

  const body = await request.json();

  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { message: "Product ID is required." },
      { status: 400 }
    );
  }

  const deleted = deleteProduct(Number(id));

  if (!deleted) {
    return NextResponse.json(
      { message: "Product not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Product deleted successfully.",
  });
}