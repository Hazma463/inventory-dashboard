import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create three warehouses
  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: 'North Distribution Center',
      location: 'New York, NY',
    },
  })

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: 'South Logistics Hub',
      location: 'Miami, FL',
    },
  })

  const warehouse3 = await prisma.warehouse.create({
    data: {
      name: 'West Coast Facility',
      location: 'Los Angeles, CA',
    },
  })

  // Create two items for each warehouse
  // Warehouse 1 Items
  await prisma.inventory.create({
    data: {
      warehouseId: warehouse1.id,
      orderNo: 'ORD-001',
      orderDate: '2024-03-15',
      customerName: 'Tech Solutions Inc',
      correspondenceAddress: '123 Tech Street',
      city: 'New York',
      state: 'NY',
      shippingAddress: '123 Tech Street, New York, NY',
      itemName: 'Laptop Pro X1',
      hsnCode: '8471',
      packing: 'Box',
      quantity: '10',
      totalQuantity: '10',
      taxPercent: '8.5',
      taxAmt: '850',
      rate: '10000',
      amount: '100000',
      netPayable: '108500',
    },
  })

  await prisma.inventory.create({
    data: {
      warehouseId: warehouse1.id,
      orderNo: 'ORD-002',
      orderDate: '2024-03-16',
      customerName: 'Office Supplies Co',
      correspondenceAddress: '456 Office Ave',
      city: 'New York',
      state: 'NY',
      shippingAddress: '456 Office Ave, New York, NY',
      itemName: 'Office Chair Deluxe',
      hsnCode: '9401',
      packing: 'Carton',
      quantity: '5',
      totalQuantity: '5',
      taxPercent: '8.5',
      taxAmt: '425',
      rate: '5000',
      amount: '25000',
      netPayable: '25425',
    },
  })

  // Warehouse 2 Items
  await prisma.inventory.create({
    data: {
      warehouseId: warehouse2.id,
      orderNo: 'ORD-003',
      orderDate: '2024-03-15',
      customerName: 'Fashion Retail LLC',
      correspondenceAddress: '789 Style Blvd',
      city: 'Miami',
      state: 'FL',
      shippingAddress: '789 Style Blvd, Miami, FL',
      itemName: 'Designer Handbag',
      hsnCode: '4202',
      packing: 'Box',
      quantity: '20',
      totalQuantity: '20',
      taxPercent: '7.0',
      taxAmt: '1400',
      rate: '2000',
      amount: '40000',
      netPayable: '41400',
    },
  })

  await prisma.inventory.create({
    data: {
      warehouseId: warehouse2.id,
      orderNo: 'ORD-004',
      orderDate: '2024-03-16',
      customerName: 'Beach Wear Inc',
      correspondenceAddress: '321 Beach Road',
      city: 'Miami',
      state: 'FL',
      shippingAddress: '321 Beach Road, Miami, FL',
      itemName: 'Summer Collection Set',
      hsnCode: '6204',
      packing: 'Carton',
      quantity: '50',
      totalQuantity: '50',
      taxPercent: '7.0',
      taxAmt: '1750',
      rate: '500',
      amount: '25000',
      netPayable: '26750',
    },
  })

  // Warehouse 3 Items
  await prisma.inventory.create({
    data: {
      warehouseId: warehouse3.id,
      orderNo: 'ORD-005',
      orderDate: '2024-03-15',
      customerName: 'Electronics World',
      correspondenceAddress: '555 Tech Lane',
      city: 'Los Angeles',
      state: 'CA',
      shippingAddress: '555 Tech Lane, Los Angeles, CA',
      itemName: 'Smart TV 55"',
      hsnCode: '8528',
      packing: 'Box',
      quantity: '8',
      totalQuantity: '8',
      taxPercent: '8.0',
      taxAmt: '3200',
      rate: '4000',
      amount: '32000',
      netPayable: '35200',
    },
  })

  await prisma.inventory.create({
    data: {
      warehouseId: warehouse3.id,
      orderNo: 'ORD-006',
      orderDate: '2024-03-16',
      customerName: 'Home Decor Plus',
      correspondenceAddress: '888 Design Street',
      city: 'Los Angeles',
      state: 'CA',
      shippingAddress: '888 Design Street, Los Angeles, CA',
      itemName: 'Modern Sofa Set',
      hsnCode: '9401',
      packing: 'Carton',
      quantity: '3',
      totalQuantity: '3',
      taxPercent: '8.0',
      taxAmt: '2400',
      rate: '10000',
      amount: '30000',
      netPayable: '32400',
    },
  })

  console.log('Demo data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 