import { createClient } from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";

// Get Restaurant Info by ID: Retrieves Menus, Categories, and Items, Modifiers
// TODO: Get Restaurant Details (location, schedule, etc.) as well
export async function getRestaurantById(restaurantId: string) {
    const supabase = await createClient();

    if (supabase.auth.getUser == null) {
        redirect(PUBLIC_ROUTES.LOGIN);
    }

    const { data, error } = await supabase
    .rpc('get_restaurant_info', {
        p_restaurant_id: restaurantId
    })

    if (error) {
        console.error("Error fetching restaurant:", error);
        return null;
    }

    return data;
}