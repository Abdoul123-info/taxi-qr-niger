import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">

      {/* Hero Section */}
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full border border-gray-100">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-5xl">
            🚕
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-green-800 mb-2">Niger Taxi Sûr</h1>
        <p className="text-gray-500 mb-8 font-medium">Système d'Identification & Sécurité</p>

        <div className="space-y-4">
          <Link
            href="/admin"
            className="block w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-[1.02]"
          >
            🔐 Accéder à l'Administration
          </Link>

          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 text-sm text-orange-800">
            <span className="font-bold block mb-1">Passagers</span>
            Scannez le code QR dans un taxi pour accéder à sa fiche.
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
          <p>République du Niger 🇳🇪</p>
          <p>Ministère des Transports</p>
        </div>
      </div>

    </div>
  );
}
