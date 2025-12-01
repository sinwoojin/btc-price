import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Stream API is not implemented yet" }, { status: 501 });
}
