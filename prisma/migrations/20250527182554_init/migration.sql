-- CreateTable
CREATE TABLE "warehouses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" SERIAL NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "order_no" TEXT NOT NULL,
    "order_date" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "correspondence_address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "shipping_address" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "hsn_code" TEXT NOT NULL,
    "packing" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "total_quantity" TEXT NOT NULL,
    "tax_percent" TEXT NOT NULL,
    "tax_amt" TEXT NOT NULL,
    "rate" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "net_payable" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
