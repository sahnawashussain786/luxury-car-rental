export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <span className="text-2xl font-bold tracking-tight text-zinc-900">Velocity Reserve</span>
            <p className="max-w-xs text-sm text-zinc-500">
              Same-day access to the world’s sharpest supercars and hypercars.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-900">Fleet</h3>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#fleet" className="hover:text-zinc-900">Supercars</a></li>
                <li><a href="#fleet" className="hover:text-zinc-900">Hypercars</a></li>
                <li><a href="#fleet" className="hover:text-zinc-900">Luxury</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-900">Company</h3>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-zinc-900">About</a></li>
                <li><a href="#" className="hover:text-zinc-900">Careers</a></li>
                <li><a href="#" className="hover:text-zinc-900">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-900">Support</h3>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-zinc-900">Help center</a></li>
                <li><a href="#" className="hover:text-zinc-900">Insurance</a></li>
                <li><a href="#" className="hover:text-zinc-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-900">Legal</h3>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-zinc-900">Terms</a></li>
                <li><a href="#" className="hover:text-zinc-900">Privacy</a></li>
                <li><a href="#" className="hover:text-zinc-900">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 text-sm text-zinc-400 md:flex-row">
          <span>© {new Date().getFullYear()} Velocity Reserve. All rights reserved.</span>
          <span>Dummy checkout only — no real payments are processed.</span>
        </div>
      </div>
    </footer>
  );
}
