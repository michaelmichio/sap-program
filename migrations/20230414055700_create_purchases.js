/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('purchases', function(table) {
        table.increments('id');
        table.string('document_id');
        table.string('date');
        table.string('supplier');
        table.string('item_code');
        table.float('qty', 14, 2);
        table.float('price', 14, 2);
        table.float('gross', 14, 2);
        table.float('disc', 14, 2);
        table.float('ppn', 14, 2);
        table.float('total', 14, 2);
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('purchases');
};
