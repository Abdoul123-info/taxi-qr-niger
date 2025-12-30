const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const drivers = await prisma.driver.findMany({
        include: { taxis: true }
    });
    console.log('--- CHAUFFEURS ---');
    drivers.forEach(d => {
        console.log(`Driver: ${d.name} (${d.email}) - Taxis: ${d.taxis.length}`);
        d.taxis.forEach(t => console.log(`  -> Taxi: ${t.plateNumber} (Status: ${t.status})`));
    });

    const pendingTaxis = await prisma.taxi.findMany({
        where: { status: 'PENDING_ADMIN' }
    });
    console.log('\n--- TAXIS EN ATTENTE DE VALIDATION ---');
    console.log(`Nombre: ${pendingTaxis.length}`);
}

check().finally(() => prisma.$disconnect());
