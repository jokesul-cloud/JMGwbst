import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";

export async function proxy(request: NextRequest) {
  // Update session first
  const response = await updateSession(request);
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect API checkout route
  if (request.nextUrl.pathname.startsWith('/api/checkout')) {
     const supabase = await createClient();
     const { data: { user } } = await supabase.auth.getUser();
     
     if (!user) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
