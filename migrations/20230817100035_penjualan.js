/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("penjualan", (table) => {
        table.increments("id").primary();
        table.string("kode_barang", 20).notNullable();
        table.string("nama_barang", 255).notNullable();
        table.enum("kategori", ["spare_part", "oli", "jasa", "tune_up", "balancing", "storing"]);
        table.integer("jumlah").notNullable();
        table.decimal("harga_beli", 12, 2).notNullable();
        table.decimal("harga_jual", 12, 2).notNullable();
        table.decimal("diskon", 12, 2).defaultTo(0);
        table.decimal("ppn", 12, 2).defaultTo(0);
        table.decimal("cost", 12, 2).notNullable(); // Harga beli total sebelum dikenakan ppn dan cost penjualan
        table.decimal("sales", 12, 2).notNullable(); // Harga jual total
        table.integer("invoice_penjualan_id").unsigned().references("id").inTable("invoice_penjualan");

        table.timestamps(true, true);

        table.foreign("invoice_penjualan_id", "fk_penjualan_invoice_penjualan").references("id").inTable("invoice_penjualan");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("penjualan");
};
