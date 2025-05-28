const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection...');
    
    // Try to create a test warehouse
    const warehouse = await prisma.warehouse.create({
      data: {
        name: 'Test Warehouse',
        location: 'Test Location',
      },
    });
    console.log('Successfully created warehouse:', warehouse);

    // Try to fetch all warehouses
    const allWarehouses = await prisma.warehouse.findMany();
    console.log('All warehouses in database:', allWarehouses);

  } catch (error) {
    console.error('Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 