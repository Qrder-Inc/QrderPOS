import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "../globals.css";

import {NextIntlClientProvider} from "next-intl";
import {setRequestLocale} from "next-intl/server";
import {routing} from "@/i18n/routing";

const geistSans = Geist({variable: "--font-geist-sans", subsets: ["latin"]});

const geistMono = Geist_Mono({variable: "--font-geist-mono", subsets: ["latin"]});

export const metadata: Metadata = {
    title: "QrderPOS",
    description: "The modern POS system for your restaurant or cafe.",
    manifest: "/manifest.json",
    icons: {
        icon: "/logo.svg"
    }
};

export async function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    setRequestLocale(locale);

    const messages = (await import(`@/locale/${locale}/translation`)).default;

    return (
        <html lang={locale}>
            <NextIntlClientProvider locale={locale} messages={messages}>
                <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                    {/* <Navbar /> */}
                    {children}
                </body>
            </NextIntlClientProvider>
        </html>
    );
}
