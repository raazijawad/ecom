export default function NotAuthorizedPage() {
    return (
        <main className="mx-auto mt-16 max-w-xl rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-2xl font-bold text-red-700">Not Authorized</h1>
            <p className="mt-2 text-sm text-red-600">You do not have permission to access this page.</p>
        </main>
    );
}
