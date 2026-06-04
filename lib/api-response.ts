import { NextResponse } from "next/server";

export function successResponse(data: any, message: string = "Success", status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function errorResponse(message: string, errors: any = null, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      message,
      error: message, // for client-side compat (some pages check response.error)
      errors: errors || [],
    },
    { status }
  );
}
