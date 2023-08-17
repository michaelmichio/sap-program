/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('items', function(table) {
        table.increments('id');
        table.string('code');
        table.string('name');
        table.float('price', 14, 2);
        table.float('stock', 14, 2).notNullable().defaultTo('0');
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('items');
};
