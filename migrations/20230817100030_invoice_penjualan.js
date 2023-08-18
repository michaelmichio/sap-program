/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("invoice_penjualan", (table) => {
        table.increments("id").primary();
        table.string("nomor_invoice", 50).notNullable().unique();
        table.date("tanggal").notNullable();
        table.enum("status", ["pending", "selesai", "batal"]);
        table.integer("id_customer").unsigned().references("id").inTable("customers").notNullable();
        table.string("jenis_kendaraan", 50).notNullable();
        table.string("nomor_polisi", 20).notNullable();
        table.string("nomor_rangka", 50);
        table.string("nomor_mesin", 50);
        table.string("nomor_spk", 50);
        table.integer("id_user").unsigned().references("id").inTable("users").notNullable();

        table.timestamps(true, true);
        
        table.foreign("id_customer", "fk_invoice_penjualan_customers").references("id").inTable("customers");
        table.foreign("id_user", "fk_invoice_penjualan_users").references("id").inTable("users");

        // Menambahkan indeks pada kolom referensi
        table.index("id_customer");
        table.index("id_user");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("invoice_penjualan");
};
