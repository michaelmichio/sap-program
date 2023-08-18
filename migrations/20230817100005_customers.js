/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("customers", (table) => {
        table.increments("id").primary();
        table.string("name", 100).notNullable();
        table.string("address", 255);
        table.string("email", 100).unique();
        table.string("phone", 20);
        table.date("birthdate");
        table.enum("gender", ["male", "female", "other"]);
        
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("customers");
};
