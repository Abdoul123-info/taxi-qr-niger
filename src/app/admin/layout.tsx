import Link from 'next/link';
import '../globals.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-green-900 text-white flex-shrink-0">
        <div className="p-6 border-b border-green-800">
          <h1 className="text-2xl font-bold text-orange-400">Admin Taxi</h1>
          <p className="text-xs text-green-200 uppercase tracking-widest mt-1">NIGER SYSTEM</p>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink href="/admin" label="Tableau de Bord" icon="dashboard" />
          <NavLink href="/admin/taxis" label="Gestion des Taxis" icon="taxi" />
          <NavLink href="/admin/drivers" label="Chauffeurs" icon="person" />
          <NavLink href="/admin/incidents" label="Incidents" icon="warning" />
          <NavLink href="/admin/lost-found" label="Objets Perdus" icon="backpack" />
        </nav>
        <div className="p-4 mt-auto border-t border-green-800">
          <button className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 rounded text-white font-bold transition">
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-green-900">Administration</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Admin User</span>
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, label, icon, disabled = false }: { href: string; label: string; icon: string; disabled?: boolean }) {
  // Simple styling, in a real app use usePathname for active state
  if (disabled) {
    return (
      <div className="block py-3 px-4 rounded text-green-400 cursor-not-allowed opacity-60">
        <span className="inline-block w-6 mr-2 opacity-50">●</span>
        {label} <span className="text-[10px] ml-1 bg-green-800 px-1 rounded">Bientôt</span>
      </div>
    );
  }
  return (
    <Link
      href={href}
      className="block py-3 px-4 rounded hover:bg-green-800 transition duration-150 ease-in-out text-green-50"
    >
      <span className="inline-block w-6 mr-2">
        {/* Simple icon emulation */}
        {icon === 'dashboard' && '📊'}
        {icon === 'taxi' && 'yw'}
        {icon === 'person' && '👤'}
        {icon === 'warning' && '⚠️'}
        {icon === 'backpack' && '🎒'}
      </span>
      {label}
    </Link>
  );
}
