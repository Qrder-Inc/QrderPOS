"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Clock } from "lucide-react";
import { useTranslations } from "use-intl";

// Mock data
const mockMenus = [
    {
        id: 1,
        name: "Menú Principal",
        description: "Menú general del restaurante",
        schedule: "Lun - Dom: 8:00 AM - 10:00 PM",
        categories: [
            {
                id: 1,
                name: "Bebidas",
                items: [
                    { id: 1, name: "Café Americano", price: 3.50 },
                    { id: 2, name: "Cappuccino", price: 4.50 },
                    { id: 3, name: "Jugo Natural", price: 4.00 },
                ]
            },
            {
                id: 2,
                name: "Platos Principales",
                items: [
                    { id: 4, name: "Hamburguesa Clásica", price: 12.99 },
                    { id: 5, name: "Pizza Margarita", price: 14.50 },
                ]
            },
            {
                id: 3,
                name: "Postres",
                items: [
                    { id: 6, name: "Tiramisú", price: 6.50 },
                ]
            },
        ]
    },
    {
        id: 2,
        name: "Menú Ejecutivo",
        description: "Menú de almuerzo especial",
        schedule: "Lun - Vie: 11:30 AM - 3:00 PM",
        categories: [
            {
                id: 2,
                name: "Platos Principales",
                items: [
                    { id: 7, name: "Pollo Asado", price: 10.99 },
                    { id: 8, name: "Pescado del Día", price: 13.50 },
                ]
            },
            {
                id: 5,
                name: "Ensaladas",
                items: [
                    { id: 9, name: "Ensalada César", price: 8.99 },
                ]
            },
        ]
    },
    {
        id: 3,
        name: "Menú Vegetariano",
        description: "Opciones vegetarianas",
        schedule: "Lun - Dom: 10:00 AM - 9:00 PM",
        categories: [
            {
                id: 5,
                name: "Ensaladas",
                items: [
                    { id: 10, name: "Ensalada Griega", price: 9.50 },
                    { id: 11, name: "Bowl de Quinoa", price: 11.00 },
                ]
            },
            {
                id: 4,
                name: "Entradas",
                items: [
                    { id: 12, name: "Hummus con Vegetales", price: 6.00 },
                ]
            },
        ]
    },
];

export default function MenuPage() {
    const t = useTranslations('menu');
    const [expandedMenus, setExpandedMenus] = useState<number[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const toggleMenu = (menuId: number) => {
        setExpandedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const toggleCategory = (key: string) => {
        setExpandedCategories(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                <p className="text-muted-foreground">
                    {t('description')}
                </p>
            </div>

            {/* Menus List */}
            <div className="space-y-4">
                {mockMenus.map((menu) => {
                    const isMenuExpanded = expandedMenus.includes(menu.id);
                    const totalItems = menu.categories.reduce((acc, cat) => acc + cat.items.length, 0);

                    return (
                        <Card key={menu.id}>
                            <CardHeader
                                className="cursor-pointer hover:bg-accent/50 transition-colors"
                                onClick={() => toggleMenu(menu.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        {isMenuExpanded ? (
                                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                        )}
                                        <div className="flex-1">
                                            <CardTitle className="text-xl">{menu.name}</CardTitle>
                                            <CardDescription>{menu.description}</CardDescription>
                                            <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{menu.schedule}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">
                                            {menu.categories.length} {menu.categories.length === 1 ? t('category') : t('categories')}
                                        </Badge>
                                        <Badge variant="outline">
                                            {totalItems} {totalItems === 1 ? t('item') : t('items')}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            {isMenuExpanded && (
                                <CardContent className="pt-0">
                                    <div className="space-y-3 pl-8">
                                        {menu.categories.map((category) => {
                                            const categoryKey = `${menu.id}-${category.id}`;
                                            const isCategoryExpanded = expandedCategories.includes(categoryKey);

                                            return (
                                                <div key={categoryKey} className="border-l-2 border-border pl-4">
                                                    <div
                                                        className="flex items-center justify-between cursor-pointer hover:bg-accent/50 p-2 rounded transition-colors"
                                                        onClick={() => toggleCategory(categoryKey)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {isCategoryExpanded ? (
                                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                            )}
                                                            <span className="font-semibold">{category.name}</span>
                                                        </div>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
                                                        </Badge>
                                                    </div>

                                                    {isCategoryExpanded && (
                                                        <div className="mt-2 space-y-1 pl-6">
                                                            {category.items.map((item) => (
                                                                <div
                                                                    key={item.id}
                                                                    className="flex items-center justify-between p-2 rounded hover:bg-accent/30 transition-colors"
                                                                >
                                                                    <span className="text-sm">{item.name}</span>
                                                                    <span className="text-sm font-medium">
                                                                        ${item.price.toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}