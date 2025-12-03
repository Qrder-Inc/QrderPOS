"use client";

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

// Mock data for categories
const mockCategories = [
    { id: 1, name: "Bebidas", description: "Bebidas frías y calientes", menuCount: 3 },
    { id: 2, name: "Platos Principales", description: "Comidas del día", menuCount: 2 },
    { id: 3, name: "Postres", description: "Dulces y helados", menuCount: 4 },
    { id: 4, name: "Entradas", description: "Aperitivos y bocadillos", menuCount: 1 },
    { id: 5, name: "Ensaladas", description: "Ensaladas frescas", menuCount: 2 },
    { id: 6, name: "Bebidas", description: "Bebidas frías y calientes", menuCount: 3 },
    { id: 7, name: "Platos Principales", description: "Comidas del día", menuCount: 2 },
    { id: 8, name: "Postres", description: "Dulces y helados", menuCount: 4 },
    { id: 9, name: "Entradas", description: "Aperitivos y bocadillos", menuCount: 1 },
    { id: 10, name: "Ensaladas", description: "Ensaladas frescas", menuCount: 2 },
    
];


export default function MenuCategoriesPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCategories = mockCategories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
                    <p className="text-muted-foreground">
                        Gestiona las categorías de tu menú aquí.
                    </p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Categoría
                </Button>
            </div>

            {/* Search Box */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar categorías..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Categories List */}
            <Card>
                <CardHeader>
                    <CardTitle>Categorías Existentes</CardTitle>
                    <CardDescription>
                        {filteredCategories.length} {filteredCategories.length === 1 ? 'categoría encontrada' : 'categorías encontradas'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {filteredCategories.map((category) => (
                            <div
                                key={category.id}
                                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="space-y-1 flex-1">
                                        <h3 className="font-semibold">{category.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {category.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">
                                            {category.menuCount} {category.menuCount === 1 ? 'menú' : 'menús'}
                                        </span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon-sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => console.log('Modificar', category.id)}>
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Modificar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => console.log('Eliminar', category.id)}
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