import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { prisma } from '../prisma';

export const inventoryRouter = createTRPCRouter({
  // Get all warehouses
  getWarehouses: publicProcedure.query(async () => {
    console.log('Fetching all warehouses...');
    const warehouses = await prisma.warehouse.findMany({
      include: {
        inventory: true,
      },
    });
    console.log('Found warehouses:', warehouses);
    return warehouses;
  }),

  // Create new warehouse
  createWarehouse: publicProcedure
    .input(z.object({
      name: z.string(),
      location: z.string(),
    }))
    .mutation(async ({ input }) => {
      console.log('Creating warehouse with input:', input);
      try {
        const result = await prisma.warehouse.create({
          data: { name: input.name, location: input.location },
        });
        console.log('Successfully created warehouse:', result);
        return result;
      } catch (error) {
        console.error('Error creating warehouse:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
          });
        }
        throw error;
      }
    }),

  // Update warehouse
  updateWarehouse: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
      location: z.string(),
    }))
    .mutation(async ({ input }) => {
      return prisma.warehouse.update({
        where: { id: input.id },
        data: { name: input.name, location: input.location },
      });
    }),

  // Delete warehouse
  deleteWarehouse: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // Delete all inventory for this warehouse first (to avoid FK constraint)
      await prisma.inventory.deleteMany({ where: { warehouseId: input.id } });
      return prisma.warehouse.delete({ where: { id: input.id } });
    }),

  // Create new inventory item
  createInventory: publicProcedure
    .input(z.object({
      warehouseId: z.number(),
      orderNo: z.string(),
      orderDate: z.string(),
      customerName: z.string(),
      correspondenceAddress: z.string(),
      city: z.string(),
      state: z.string(),
      shippingAddress: z.string(),
      itemName: z.string(),
      hsnCode: z.string(),
      packing: z.string(),
      quantity: z.string(),
      totalQuantity: z.string(),
      taxPercent: z.string(),
      taxAmt: z.string(),
      rate: z.string(),
      amount: z.string(),
      netPayable: z.string(),
    }))
    .mutation(async ({ input }) => {
      console.log('Creating inventory with input:', input);
      try {
        // First verify the warehouse exists
        const warehouse = await prisma.warehouse.findUnique({
          where: { id: input.warehouseId }
        });

        if (!warehouse) {
          throw new Error(`Warehouse with ID ${input.warehouseId} not found`);
        }

        const result = await prisma.inventory.create({
          data: {
            warehouseId: input.warehouseId,
            orderNo: input.orderNo,
            orderDate: input.orderDate,
            customerName: input.customerName,
            correspondenceAddress: input.correspondenceAddress,
            city: input.city,
            state: input.state,
            shippingAddress: input.shippingAddress,
            itemName: input.itemName,
            hsnCode: input.hsnCode,
            packing: input.packing,
            quantity: input.quantity,
            totalQuantity: input.totalQuantity,
            taxPercent: input.taxPercent,
            taxAmt: input.taxAmt,
            rate: input.rate,
            amount: input.amount,
            netPayable: input.netPayable,
          },
          include: {
            warehouse: true
          }
        });
        console.log('Successfully created inventory:', result);
        return result;
      } catch (error) {
        console.error('Error creating inventory:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
          });
        }
        throw error;
      }
    }),

  // Update inventory item
  updateInventory: publicProcedure
    .input(z.object({
      id: z.number(),
      warehouseId: z.number(),
      orderNo: z.string(),
      orderDate: z.string(),
      customerName: z.string(),
      correspondenceAddress: z.string(),
      city: z.string(),
      state: z.string(),
      shippingAddress: z.string(),
      itemName: z.string(),
      hsnCode: z.string(),
      packing: z.string(),
      quantity: z.string(),
      totalQuantity: z.string(),
      taxPercent: z.string(),
      taxAmt: z.string(),
      rate: z.string(),
      amount: z.string(),
      netPayable: z.string(),
    }))
    .mutation(async ({ input }) => {
      console.log('Updating inventory with input:', input);
      try {
        // First verify both the inventory and warehouse exist
        const [inventory, warehouse] = await Promise.all([
          prisma.inventory.findUnique({ where: { id: input.id } }),
          prisma.warehouse.findUnique({ where: { id: input.warehouseId } })
        ]);

        if (!inventory) {
          throw new Error(`Inventory with ID ${input.id} not found`);
        }
        if (!warehouse) {
          throw new Error(`Warehouse with ID ${input.warehouseId} not found`);
        }

        const result = await prisma.inventory.update({
          where: { id: input.id },
          data: {
            warehouseId: input.warehouseId,
            orderNo: input.orderNo,
            orderDate: input.orderDate,
            customerName: input.customerName,
            correspondenceAddress: input.correspondenceAddress,
            city: input.city,
            state: input.state,
            shippingAddress: input.shippingAddress,
            itemName: input.itemName,
            hsnCode: input.hsnCode,
            packing: input.packing,
            quantity: input.quantity,
            totalQuantity: input.totalQuantity,
            taxPercent: input.taxPercent,
            taxAmt: input.taxAmt,
            rate: input.rate,
            amount: input.amount,
            netPayable: input.netPayable,
          },
          include: {
            warehouse: true
          }
        });
        console.log('Successfully updated inventory:', result);
        return result;
      } catch (error) {
        console.error('Error updating inventory:', error);
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
          });
        }
        throw error;
      }
    }),

  // Delete inventory item
  deleteInventory: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return prisma.inventory.delete({ where: { id: input.id } });
    }),
}); 