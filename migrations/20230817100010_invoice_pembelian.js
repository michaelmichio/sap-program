/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("invoice_pembelian", (table) => {
        table.increments("id").primary();
        table.string("nomor_invoice", 50).notNullable().unique();
        table.date("tanggal").notNullable();
        table.string("pemasok", 100).notNullable();
        table.enum("status", ["pending", "selesai", "batal"]);

        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("invoice_pembelian");
};
