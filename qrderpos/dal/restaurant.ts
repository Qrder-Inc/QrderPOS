import { createClient } from "@/utils/supabase/server";

// Get Restaurant Info by ID: Retrieves Menus, Categories, and Items, Modifiers
// TODO: Get Restaurant Details (location, schedule, etc.) as well
export async function getRestaurantById(restaurantId: string) {
    const supabase = await createClient();

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