"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"
import { MENU_ROUTES } from "@/config/routes";

const MenuLinks = [
    { href: MENU_ROUTES.MENU_HOME, label: "General" },
    { href: MENU_ROUTES.MENUS, label: "Menus" },
    { href: MENU_ROUTES.CATEGORIES, label: "Categorías" },
    { href: MENU_ROUTES.ITEMS, label: "Items" },
    { href: MENU_ROUTES.MODIFIERS, label: "Modificadores" }
];

export function MenuNavbar() {
    const pathname = usePathname();

    return (
        <>
            <div className="flex items-center space-x-5 h-6 my-2">
                {MenuLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <div key={link.href} className="flex items-center">
                            
                            <Link
                                href={link.href}
                                className={`text-sm font-medium hover:text-foreground ${
                                    isActive ? "text-foreground" : "text-muted-foreground"
                                }`}
                                >
                                {link.label}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </>
    )
}