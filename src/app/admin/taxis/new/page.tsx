import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default function NewTaxiPage() {

    async function createTaxi(formData: FormData) {
        'use server';

        const plateNumber = formData.get('plateNumber') as string;
        const model = formData.get('model') as string;
        const doorNumber = formData.get('doorNumber') as string;
        const company = formData.get('company') as string;

        await prisma.taxi.create({
            data: {
                plateNumber,
                model,
                doorNumber,
                company,
                status: 'AVAILABLE',
            }
        });

        redirect('/admin/taxis');
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Ajouter un Nouveau Taxi</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <form action={createTaxi} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Immatriculation (Plaque)
                        </label>
                        <input
                            name="plateNumber"
                            type="text"
                            required
                            placeholder="Ex: 8A-1234"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        />
                        <p className="text-xs text-gray-500 mt-1">Numéro unique identifiant le véhicule.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Modèle du Véhicule
                        </label>
                        <input
                            name="model"
                            type="text"
                            required
                            placeholder="Ex: Toyota Corolla 2010"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Numéro de Portière
                            </label>
                            <input
                                name="doorNumber"
                                type="text"
                                placeholder="Ex: 1234"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                            />
                            <p className="text-xs text-gray-500 mt-1">Numéro visuel sur la portière.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Compagnie / GIE
                            </label>
                            <input
                                name="company"
                                type="text"
                                placeholder="Ex: GIE Niamey Transport"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end space-x-4">
                        <button type="button" className="text-gray-500 hover:text-gray-700 font-medium">
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition transform active:scale-95"
                        >
                            Enregistrer le Taxi
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
