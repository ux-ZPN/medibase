import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_HOSPITALS = [
  {
    id: "a0000000-0000-0000-0000-000000000001",
    name: "City General Hospital",
    license_number: "HOSP-CGH-2024-001",
    city: "Metro City",
    state: "State",
    is_verified: true,
  },
  {
    id: "a0000000-0000-0000-0000-000000000002",
    name: "Metro Health Institute",
    license_number: "HOSP-MHI-2024-002",
    city: "Metro City",
    state: "State",
    is_verified: true,
  },
  {
    id: "a0000000-0000-0000-0000-000000000003",
    name: "St. Mary's Hospital",
    license_number: "HOSP-SMH-2024-003",
    city: "Metro City",
    state: "State",
    is_verified: true,
  },
  {
    id: "a0000000-0000-0000-0000-000000000004",
    name: "Apex Super Specialty Hospital",
    license_number: "HOSP-ASH-2024-004",
    city: "Metro City",
    state: "State",
    is_verified: true,
  },
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: hospitals, error } = await supabase
      .from("hospitals")
      .select("id, name, license_number, city, state, is_verified")
      .order("name", { ascending: true });

    if (error || !hospitals || hospitals.length === 0) {
      return NextResponse.json({
        success: true,
        hospitals: DEFAULT_HOSPITALS,
      });
    }

    return NextResponse.json({
      success: true,
      hospitals: hospitals,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load hospitals";
    return NextResponse.json({ success: true, hospitals: DEFAULT_HOSPITALS, warning: message }, { status: 200 });
  }
}
