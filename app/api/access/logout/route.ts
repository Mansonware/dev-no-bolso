import { NextRequest, NextResponse } from "next/server";
import { COURSE_ACCESS_COOKIE } from "@/lib/course-access";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url), 303);

  response.cookies.set(COURSE_ACCESS_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
