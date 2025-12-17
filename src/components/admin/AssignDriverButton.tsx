'use client';

import { useState } from 'react';
import { assignDriver } from '@/app/admin/taxis/actions';

interface Driver {
    id: string;
    name: string | null;
}

export default function AssignDriverButton({ taxiId, drivers }: { taxiId: string, drivers: Driver[] }) {
    const [isAssigning, setIsAssigning] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState("");

    const handleAssign = async () => {
        if (!selectedDriver) return;
        setIsAssigning(true);

        const result = await assignDriver(taxiId, selectedDriver);

        if (result.success) {
            // alert("Chauffeur assigné !"); 
            // In a real app we'd use a toast or just let the revalidation update the UI
            setIsAssigning(false);
            window.location.reload(); // Force refresh to be sure
        } else {
            alert("Erreur: " + result.error);
            setIsAssigning(false);
        }
    };

    return (
        <div className="text-center py-4 bg-gray-50 rounded border border-dashed border-gray-300">
            <div className="mb-3">
                <select
                    className="p-2 border rounded w-full mb-2"
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                >
                    <option value="">-- Choisir un chauffeur --</option>
                    {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name || "Sans Nom"}</option>
                    ))}
                </select>
            </div>
            <button
                onClick={handleAssign}
                disabled={!selectedDriver || isAssigning}
                className={`font-bold hover:underline ${!selectedDriver ? 'text-gray-400 cursor-not-allowed' : 'text-green-600'}`}
            >
                {isAssigning ? "Assignation..." : "Confirmer l'Assignation"}
            </button>
        </div>
    );
}
