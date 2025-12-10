export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
            <p className="text-lg text-center">
                You do not have the necessary permissions to view this page.
            </p>
        </div>
    );
}