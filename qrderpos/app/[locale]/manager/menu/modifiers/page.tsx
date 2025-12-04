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
import { useRouter } from "next/navigation";

// Mock data for modifiers
const mockModifiers = [
    { id: 1, name: "Tamaño", description: "Selecciona el tamaño del producto", optionsCount: 3 },
    { id: 2, name: "Extras", description: "Ingredientes adicionales", optionsCount: 5 },
    { id: 3, name: "Temperatura", description: "Temperatura de la bebida", optionsCount: 2 },
    { id: 4, name: "Nivel de Picante", description: "Qué tan picante quieres tu comida", optionsCount: 4 },
    { id: 5, name: "Pan", description: "Tipo de pan para tu sandwich", optionsCount: 3 },
    { id: 6, name: "Queso", description: "Tipos de queso disponibles", optionsCount: 4 },
    { id: 7, name: "Proteína", description: "Elige tu proteína", optionsCount: 5 },
    { id: 8, name: "Aderezo", description: "Aderezos disponibles", optionsCount: 6 },
];

export default function ModifiersPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredModifiers = mockModifiers.filter(modifier =>
        modifier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        modifier.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Modificadores</h1>
                    <p className="text-muted-foreground">
                        Gestiona los modificadores y opciones de tu menú aquí.
                    </p>
                </div>
                <Button onClick={() => router.push('/manager/menu/modifiers/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Modificador
                </Button>
            </div>

            {/* Search Box */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar modificadores..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Modifiers List */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Modificadores</CardTitle>
                    <CardDescription>
                        {filteredModifiers.length} {filteredModifiers.length === 1 ? 'modificador encontrado' : 'modificadores encontrados'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {filteredModifiers.map((modifier) => (
                            <div
                                key={modifier.id}
                                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{modifier.name}</h3>
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                {modifier.optionsCount} {modifier.optionsCount === 1 ? 'opción' : 'opciones'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {modifier.description}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon-sm">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => console.log('Editar', modifier.id)}>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Editar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => console.log('Eliminar', modifier.id)}
                                                className="text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}