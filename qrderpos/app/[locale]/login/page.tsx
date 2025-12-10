"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { PUBLIC_ROUTES } from "@/config/routes";

// import components and icons
import { ArrowLeft } from 'lucide-react';
import { Toast, useToast } from "@/components/ui/toast";

export default function LoginPageComponent() {
    const { toast, showToast, hideToast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const t = useTranslations("login");

    const supabase = createClient();

    async function handleLogin() {
    if (!email || !password) {
      showToast(t("missingFields"), "error");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showToast(t("incorrectCredentials"), "error");
      return;
    }

    showToast(t("loginSuccess"), "success");

    // Redirect to authorization page after successful login
    router.push(PUBLIC_ROUTES.HOME);
  }

    return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <ArrowLeft onClick={() => router.back()} className="absolute top-6 left-6 w-6 h-6 text-gray-600 cursor-pointer" />
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">{t("title")}</h2>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            {t("emailLabel")}
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8f2e]"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            {t("passwordLabel")}
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff8f2e]"
                            placeholder="********"
                            required
                        />
                    </div>
                    <button
                        onClick={handleLogin}
                        type="button"
                        className="w-full px-4 py-2 font-semibold text-white bg-[#ff8f2e] rounded-md hover:bg-[#e67e26] transition-colors"
                    >
                        {t("loginBtn")}
                    </button>
                </form>
            </div>

            {toast && (
                <Toast
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onClose={hideToast}
                position="top"
                />
            )}
        </div>
    );
}