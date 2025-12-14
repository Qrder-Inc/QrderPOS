"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Pencil, Trash2, Plus } from "lucide-react";
import { MENU_ROUTES } from "@/config/routes";

// Mock data for items
const mockItems = [
    { id: 1, name: "Café Americano", description: "Café negro tradicional", price: 3.50 },
    { id: 2, name: "Cappuccino", description: "Espresso con leche espumosa", price: 4.50 },
    { id: 3, name: "Hamburguesa Clásica", description: "Carne de res con queso y vegetales", price: 12.99 },
    { id: 4, name: "Pizza Margarita", description: "Tomate, mozzarella y albahaca", price: 14.50 },
    { id: 5, name: "Ensalada César", description: "Lechuga romana con aderezo césar", price: 8.99 },
    { id: 6, name: "Tiramisú", description: "Postre italiano con café", price: 6.50 },
    { id: 7, name: "Jugo Natural", description: "Jugo de frutas frescas", price: 4.00 },
    { id: 8, name: "Taco de Pollo", description: "Tortilla con pollo y guacamole", price: 9.99 },
];

export default function MenuItemsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = mockItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Items</h1>
                    <p className="text-muted-foreground">
                        Gestiona los artículos de tu menú aquí.
                    </p>
                </div>
                
                <Link href={MENU_ROUTES.CREATE_ITEM}>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Item
                    </Button>
                </Link>
            </div>

            {/* Search Box */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Items List */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Items</CardTitle>
                    <CardDescription>
                        {filteredItems.length} {filteredItems.length === 1 ? 'item encontrado' : 'items encontrados'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-lg">
                                            ₡{item.price.toFixed(2)}
                                        </span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon-sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => console.log('Editar', item.id)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => console.log('Eliminar', item.id)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}