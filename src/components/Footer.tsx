export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/10 py-8 text-center text-sm text-ink-soft">
      <p>Prime Bites &middot; 123 Market Street &middot; Open daily 5pm&ndash;11pm</p>
      <p className="mt-1">&copy; {new Date().getFullYear()} Prime Bites. All rights reserved.</p>
    </footer>
  )
}
