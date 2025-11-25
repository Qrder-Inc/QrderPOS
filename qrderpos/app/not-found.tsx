import Link from 'next/link';

export default function NotFound() {
    return (
        <>
        404 - Page Not Found
        <br />
        <Link href="/">Go to Home</Link>
        </>
    );
}