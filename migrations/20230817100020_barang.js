/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("barang", (table) => {
        table.increments("id").primary();
        table.string("kode", 20).notNullable().unique();
        table.string("nama", 255).notNullable();
        table.decimal("harga_beli", 12, 2).notNullable(); // Decimal type for price with precision of 12 digits and 2 decimal places
        table.decimal("jumlah", 10, 2).notNullable(); // Decimal type for quantity with precision of 10 digits and 2 decimal places
        table.enum("kategori", ["spare_part", "oli", "jasa", "tune_up", "balancing", "storing"]);
        table.integer("pembelian_id").unsigned().references("id").inTable("pembelian"); // Foreign key to pembelian.id
        table.timestamp("tanggal_perubahan").defaultTo(knex.fn.now()); // Added timestamp for change date

        table.timestamps(true, true);

        table.foreign("pembelian_id", "fk_barang_pembelian").references("id").inTable("pembelian");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("barang");
};
