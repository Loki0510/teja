export function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Rukshaa";
  return (
    <footer className="border-t border-line mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted flex flex-col md:flex-row justify-between gap-2">
        <p>
          &copy; {new Date().getFullYear()} {siteName}. Handcrafted, made to order.
        </p>
        <p>All orders confirmed via WhatsApp.</p>
      </div>
    </footer>
  );
}
