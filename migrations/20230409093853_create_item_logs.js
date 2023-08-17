/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('item_logs', function(table) {
        table.increments('id');
        table.string('item_code');
        table.string('item_name');
        table.float('initial_qty', 14, 2);
        table.float('qty', 14, 2);
        table.float('price', 14, 2);
        table.float('total_price', 14, 2);
        table.float('updated_qty', 14, 2);
        table.string('ss_id');
        table.string('order_id');
        table.string('purchase_id');
        table.string('type');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('item_logs');
};
