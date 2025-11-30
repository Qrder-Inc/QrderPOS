import { Card } from "@/components/ui/card"
import { BarChart3, DollarSign, Package, Users } from "lucide-react"
import { useTranslations } from "next-intl"


export default function Dashboard() {
  const t = useTranslations('dashboard');


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de control de QRDER
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Ventas Totales</h3>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold">$12,345</p>
            <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Clientes</h3>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Órdenes</h3>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold">567</p>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Productos</h3>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold">89</p>
            <p className="text-xs text-muted-foreground">+3 nuevos esta semana</p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Órdenes Recientes</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">#ORD-001</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$45.99</p>
                <p className="text-sm text-green-600">Completado</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">#ORD-002</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$32.50</p>
                <p className="text-sm text-yellow-600">En proceso</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">#ORD-003</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$78.25</p>
                <p className="text-sm text-blue-600">Pendiente</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Productos Populares</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Hamburguesa Clásica</p>
                <p className="text-sm text-muted-foreground">23 vendidos hoy</p>
              </div>
              <p className="font-medium">$12.99</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Pizza Margherita</p>
                <p className="text-sm text-muted-foreground">18 vendidos hoy</p>
              </div>
              <p className="font-medium">$15.50</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Papas Fritas</p>
                <p className="text-sm text-muted-foreground">31 vendidos hoy</p>
              </div>
              <p className="font-medium">$5.99</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}