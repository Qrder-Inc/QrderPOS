import { createClient } from "@/utils/supabase/server";
import { Role } from "@/types/role";
import { redirect } from "next/navigation";
import { PUBLIC_ROUTES } from "@/config/routes";

interface Roles {
    restaurant_id: string;
    role: string | "user";
}

export const getCurrentUser = async () => {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(PUBLIC_ROUTES.LOGIN);
    }

    return user;
}

export const getUserMembership = async (): Promise<Roles> => {
    
    const user = await getCurrentUser();
    
    if (!user) {
        return {restaurant_id: '', role: Role.USER} as Roles;
    }
    
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("restaurant_membership")
        .select("restaurant_id, role")
        .eq("user_id", user.id);

    if (error) {
        return {restaurant_id: '', role: Role.USER} as Roles;
    }

    return {restaurant_id: data[0]?.restaurant_id || '', role: data[0]?.role || Role.USER} as Roles;
}