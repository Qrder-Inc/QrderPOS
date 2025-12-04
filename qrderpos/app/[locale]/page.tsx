import Link from 'next/link';
import { BarChart3, TrendingUp, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-5xl w-full">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Choose Your Interface
            </h1>
            <p className="text-lg text-gray-600">
              Select where you'd like to go to begin your work session.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Point of Sale Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl">Point of Sale</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <CardDescription className="text-base leading-relaxed">
                  Start a new sale, process transactions, and manage daily operations.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Link href="/pos" className="w-full">
                  <Button className="w-full" size="lg">
                    Launch POS
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Manager Dashboard Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Manager Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-6">
                <CardDescription className="text-base leading-relaxed">
                  View reports, manage inventory, and configure system settings.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Link href="/manager/dashboard" className="w-full">
                  <Button className="w-full" variant="secondary" size="lg">
                    Open Dashboard
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
              <span className="text-gray-400">|</span>
              <span>Version 1.0.0</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 QrderInc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
