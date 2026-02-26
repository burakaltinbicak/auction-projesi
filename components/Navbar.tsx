import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Sol Taraf: Logo */}
        <Link href="/" className="text-3xl font-black text-black tracking-tighter">
          Açık<span className="text-amber-600">Artırma</span>.
        </Link>

        {/* Sağ Taraf: Linkler ve Butonlar */}
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-black font-semibold transition-colors">
            Ana Sayfa
          </Link>
          
          <Link href="/create" className="bg-black text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-md">
            + Yeni İlan Ver
          </Link>
        </nav>

      </div>
    </header>
  );
}