import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { MENU_ROUTES } from "@/config/routes"

export default function MenusPage() {
    return (
        <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Menús</h1>
                <p className="text-muted-foreground">
                Gestiona los menús de tu restaurante aquí.
                </p>
            </div>
            <Link href={MENU_ROUTES.CREATE_MENU}>
                <Button variant="black"><Plus className="mr-2 h-4 w-4" />Crear menú</Button>
            </Link>
        </div>
        {/* Content */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Example Menu Card */}
            <Card className="p-6">
            <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium">Menú Desayuno</h3>
            </div>
            <div className="mt-2">
                <p className="text-2xl font-bold">15 Ítems</p>
                <p className="text-xs text-muted-foreground">Última actualización: Hace 2 días</p>
            </div>
            </Card>
            {/* Add more menu cards as needed */}
        </div>
        </div>
    )
}