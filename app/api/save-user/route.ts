import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Interface for expected payload from AuthHandler
interface UserPayload {
  id: string;
  email: string | null;
  wallet: string | null;
  createdAt: string;
}

// Validation function using `unknown` instead of `any`
function validatePayload(body: unknown): body is UserPayload {
  if (typeof body !== "object" || body === null) return false;

  const b = body as Record<string, unknown>;

  return (
    typeof b.id === "string" &&
    b.id.startsWith("did:privy:") &&
    (b.email === null || typeof b.email === "string") &&
    (b.wallet === null || typeof b.wallet === "string") &&
    typeof b.createdAt === "string" &&
    !isNaN(Date.parse(b.createdAt))
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate payload
    if (!validatePayload(body)) {
      return NextResponse.json({ error: "Invalid payload structure" }, { status: 400 });
    }

    // Construct payload for Supabase
    const payload = {
      id: body.id,
      email: body.email,
      wallet: body.wallet,
      created_at: new Date(body.createdAt),
    };

    // Perform upsert and return the row
    const { data, error } = await supabase
      .from("users")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (e) {
    console.error("Unexpected error:", e);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
