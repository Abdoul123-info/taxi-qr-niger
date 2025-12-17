const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({});

async function main() {
    const taxi = await prisma.taxi.create({
        data: {
            plateNumber: 'SIM-9999',
            model: 'Peugeot 504 (Test)',
            status: 'AVAILABLE',
            driver: {
                create: {
                    email: 'driver.test@niger.ne',
                    password: 'hashed_secret',
                    name: 'Ibrahim (Test)',
                    phone: '+227 99 00 00 00',
                }
            }
        }
    });
    console.log(`Created Taxi with ID: ${taxi.id}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
