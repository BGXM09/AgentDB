import Link from "next/link";

export default function NotFound() { return <main className="container page-content"><div className="empty"><span className="empty-symbol">404</span><b>Record not found</b><p>The requested explorer object is not indexed.</p><Link href="/">Return home</Link></div></main>; }
