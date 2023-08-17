/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('item_edit_qty_logs', function(table) {
        table.increments('id');
        table.string('item_code');
        table.string('item_name');
        table.float('initial_qty', 14, 2);
        table.float('qty', 14, 2);
        table.float('updated_qty', 14, 2);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('item_edit_qty_logs');
};
