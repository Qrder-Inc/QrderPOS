import { Menu } from "./menu";

export interface Restaurant {
    restaurant: {
        id: string;
        name: string;
        menus: Menu[];
    };
}