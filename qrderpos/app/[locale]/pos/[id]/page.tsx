import { notFound } from "next/navigation";
import POSClient from "./pos-client";

interface Menu {
    id: string;
    name: string;
    categories: Category[];
}

interface Category {
    id: string;
    name: string;
    items: MenuItem[];
    description: string;
}

interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
    modifier_groups: ModifierGroup[] | null;
}

interface ModifierGroup {
    id: string;
    title: string;
    modifiers: Modifier[] | null;
    is_required: boolean;
    max_selections: number;
    min_selections: number;
}

interface Modifier {
    id: string;
    name: string;
    price_adjustment: number;
}

interface RestaurantData {
    restaurant: {
        id: string;
        name: string;
        menus: Menu[];
    };
}

async function getRestaurantData(id: string): Promise<RestaurantData | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/restaurant/${id}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`Failed to fetch restaurant data: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching restaurant data:', error);
        return null;
    }
}

export default async function POSPage({
    params
}: {
    params: Promise<{ id: string; locale: string }>;
}) {
    const { id } = await params;
    const restaurantData = await getRestaurantData(id);

    if (!restaurantData) {
        notFound();
    }

    return <POSClient restaurantData={restaurantData} />;
}
