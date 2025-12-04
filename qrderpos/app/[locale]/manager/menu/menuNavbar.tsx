"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"
import { MENU_ROUTES } from "@/config/routes";
import { useTranslations } from "use-intl";

export function MenuNavbar() {
    const t = useTranslations('menu');
    // Get pathname and Remove locale prefix from pathname
    const pathname = usePathname().replace(/^\/[a-z]{2}(\/|$)/, '/');

    const MenuLinks = [
    { href: MENU_ROUTES.MENU_HOME, label: t('generalTab') },
    { href: MENU_ROUTES.MENUS, label: t('menusTab') },
    { href: MENU_ROUTES.CATEGORIES, label: t('categoriesTab') },
    { href: MENU_ROUTES.ITEMS, label: t('itemsTab') },
    { href: MENU_ROUTES.MODIFIERS, label: t('modifiersTab') }
    ];

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