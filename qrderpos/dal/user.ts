import { createClient } from "@/utils/supabase/server";

interface Roles {
    restaurant_id: string;
    role: string | "user";
}

export const getCurrentUser = async () => {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
}

export const getUserRoles = async (): Promise<Roles> => {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {restaurant_id: '', role: 'user'} as Roles;
    }

    // console.log("Fetched user:", user);

    const { data, error } = await supabase
        .from("restaurant_membership")
        .select("restaurant_id, role")
        .eq("user_id", user.id);

    if (error) {
        console.error("Error fetching user roles:", error);
        return {restaurant_id: '', role: 'user'} as Roles;
    }

    return {restaurant_id: data[0]?.restaurant_id || '', role: data[0]?.role || 'user'} as Roles;
}