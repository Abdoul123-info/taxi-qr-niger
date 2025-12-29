import Link from 'next/link';
import { prisma } from '@/lib/prisma'; // We will create this lib file
import { PrismaClient } from '@prisma/client';

// Quick Prisma instantiation for Server Components if lib not ready
const db = new PrismaClient();

export default async function AdminDashboard() {
    // Fetch stats (mocking or real if DB ready)
    const taxiCount = await db.taxi.count({ where: { NOT: { status: 'PENDING_ADMIN' } } });
    const pendingTaxiCount = await db.taxi.count({ where: { status: 'PENDING_ADMIN' } });
    const incidentCount = await db.incident.count();
    const lostItemCount = await db.lostItem.count();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Taxis Enregistrés"
                    value={taxiCount.toString()}
                    color="bg-orange-500"
                    icon="🚕"
                />
                <StatsCard
                    title="Incidents Signalés"
                    value={incidentCount.toString()}
                    color="bg-red-500"
                    icon="🚨"
                />
                <StatsCard
                    title="Objets Perdus"
                    value={lostItemCount.toString()}
                    color="bg-blue-500"
                    icon="💼"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Actions Rapides</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/taxis/validate"
                        className="relative flex flex-col items-center justify-center p-6 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition cursor-pointer group"
                    >
                        {pendingTaxiCount > 0 && (
                            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                                {pendingTaxiCount}
                            </div>
                        )}
                        <div className="h-12 w-12 bg-green-200 text-green-700 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
                            +
                        </div>
                        <span className="font-semibold text-green-900 text-center">Ajouter un Taxi (Validation)</span>
                    </Link>

                    <Link
                        href="/admin/taxis"
                        className="flex flex-col items-center justify-center p-6 bg-orange-50 border border-orange-100 rounded-lg hover:bg-orange-100 transition cursor-pointer group"
                    >
                        <div className="h-12 w-12 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
                            QR
                        </div>
                        <span className="font-semibold text-orange-900 text-center">Gérer les Codes QR</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, color, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className={`h-14 w-14 rounded-full flex items-center justify-center text-2xl text-white ${color} mr-4`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}
