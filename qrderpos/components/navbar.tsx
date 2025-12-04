"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import { PUBLIC_ROUTES } from "@/config/routes";

export function Navbar() {
    const router = useRouter();

    const handleSignOut = async () => {
    router.push(PUBLIC_ROUTES.LOGIN);
    };

    const user = null;
    const loading = false;

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-8">
            {/* Logo */}
            <Link href={PUBLIC_ROUTES.HOME} className="flex items-center">
            <div className="font-bold text-xl text-primary flex items-center space-x-2">
                <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                <span>QRDER</span>
            </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-6">
            {loading ? (
                // Loading state - show skeleton/placeholder
                <div className="flex items-center space-x-6">
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
                </div>
            ) : (
                <>
                {!user && (
                    <Link href={PUBLIC_ROUTES.REGISTER} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                    Formar Parte
                    </Link>
                )}
                {/* Auth Buttons */}
                {user ? (
                    <Button variant="outline" size="sm" onClick={handleSignOut}>Cerrar Sesión</Button>
                ) : (
                    <Link href={PUBLIC_ROUTES.LOGIN}>
                    <Button variant="outline" size="sm">Ingresar</Button>
                    </Link>
                )}
                </>
            )}
            </div>
        </div>
        </nav>
    );
}
