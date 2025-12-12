import { notFound } from "next/navigation";
import POS from "./pos-client";
import { getRestaurantById } from "@/dal/restaurant";
import { getUserMembership } from "@/dal/user";
import { Role } from "@/types/role";

export default async function POSPage() {

    const roles = await getUserMembership();
    if (roles.role === Role.USER) {
        notFound();
    }

    const id = roles.restaurant_id;
    const restaurantData = await getRestaurantById(id);

    if (!restaurantData) {
        notFound();
    }

    return <POS restaurantData={restaurantData} />;
}
