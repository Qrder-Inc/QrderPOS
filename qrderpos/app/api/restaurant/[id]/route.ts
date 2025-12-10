import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    const supabase = await createClient();
    let { data, error } = await supabase
    .rpc('get_restaurant_info', {
        p_restaurant_id: id
    })
    if (error) console.error(error)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
