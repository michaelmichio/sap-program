/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("harga_jual", (table) => {
        table.increments("id").primary();
        table.integer("kode_barang").unsigned().notNullable(); // Foreign key to barang.kode
        table.decimal("harga_jual", 12, 2).notNullable(); // Decimal type for price with precision of 12 digits and 2 decimal places

        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("harga_jual");
};
