/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("username", 20).notNullable().unique();
        table.string("password", 128).notNullable();
        table.string("name", 50).notNullable();
        table.enum("role", ["admin", "manajer", "karyawan"]).defaultTo("karyawan"); // Set default role to "karyawan"
        
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("users");
};
