'use client';

import Link from 'next/link';

interface TaxiQRSectionProps {
    taxi: {
        id: string;
        plateNumber: string;
        doorNumber: string | null;
    };
    qrCodeDataUrl: string;
}

export default function TaxiQRSection({ taxi, qrCodeDataUrl }: TaxiQRSectionProps) {
    const handlePrint = () => {
        const win = window.open('', '_blank');
        win?.document.write(`
            <html>
                <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
                    <h1 style="margin-bottom:20px;">Taxi ${taxi.plateNumber}</h1>
                    <img src="${qrCodeDataUrl}" style="width:500px;" />
                    <p style="margin-top:20px; font-size:24px; font-weight:bold;">#${taxi.doorNumber || "---"}</p>
                    <script>setTimeout(() => { window.print(); window.close(); }, 500);</script>
                </body>
            </html>
        `);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Code QR Unique</h3>
            <div className="bg-white p-2 inline-block border border-gray-100 rounded-lg shadow-inner mb-4">
                <img src={qrCodeDataUrl} alt="QR Code" className="w-48 h-48" />
            </div>
            <p className="text-xs text-gray-400 mb-4 break-all px-4">{taxi.id}</p>

            <div className="flex flex-col space-y-2">
                <a
                    href={qrCodeDataUrl}
                    download={`taxi-${taxi.plateNumber}-qr.png`}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-bold transition w-full"
                >
                    Télécharger l'Image
                </a>
                <button
                    onClick={handlePrint}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-bold transition w-full"
                >
                    Imprimer le QR Code
                </button>
                <Link
                    href={`/taxi/${taxi.id}`}
                    target="_blank"
                    className="bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 px-4 rounded font-bold transition w-full"
                >
                    Simuler le Scan (Web)
                </Link>
            </div>
        </div>
    );
}
