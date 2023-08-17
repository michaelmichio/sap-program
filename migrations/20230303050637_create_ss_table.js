/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('ss', function(table) {
        table.increments('id');
        table.string('itemId');
        table.string('itemCode');
        table.string('itemName');
        table.float('itemCount', 14, 2);
        table.float('itemPrice', 14, 2);
        table.float('itemTotalPrice', 14, 2);
        table.string('ssGroupId');
        table.string('orderId');
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('ss');
};
