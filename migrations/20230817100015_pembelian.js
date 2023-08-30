/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("pembelian", (table) => {
        table.increments("id").primary();
        table.string("kode_barang", 20).notNullable();
        table.string("nama_barang", 255).notNullable();
        table.enum("kategori", ["spare_part", "oli", "jasa", "tune_up", "balancing", "storing"]);
        table.integer("jumlah").notNullable();
        table.decimal("harga", 12, 2).notNullable();
        table.decimal("gross", 12, 2).notNullable(); // Harga total sebelum diskon
        table.decimal("diskon", 12, 2).defaultTo(0);
        table.decimal("ppn", 12, 2).defaultTo(0);
        table.decimal("total_harga", 12, 2).notNullable();
        table.integer("invoice_pembelian_id").unsigned().references("id").inTable("invoice_pembelian");

        table.timestamps(true, true);

        table.foreign("invoice_pembelian_id", "fk_pembelian_invoice_pembelian").references("id").inTable("invoice_pembelian");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("pembelian");
};
