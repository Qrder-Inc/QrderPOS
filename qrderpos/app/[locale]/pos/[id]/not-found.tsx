export default function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Restaurant Not Found</h1>
                <p className="text-gray-600 mb-8">
                    The restaurant you're looking for doesn't exist or has been removed.
                </p>
                <a
                    href="/"
                    className="px-6 py-3 bg-[#ff8f2e] text-white rounded-lg hover:bg-[#e67e26] transition-colors"
                >
                    Go Back Home
                </a>
            </div>
        </div>
    );
}
