import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        connected: false,
        message:
          "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are not configured in .env.local yet.",
      },
      { status: 200 }
    );
  }

  try {
    const supabase = await createClient();
    // Test connection by fetching auth session state (does not require custom tables)
    const { error } = await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        {
          connected: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      connected: true,
      message: "Successfully connected to Supabase backend.",
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return NextResponse.json(
      {
        connected: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
