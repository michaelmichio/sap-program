/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('orders', function(table) {
        table.string('id');
        table.string('nomorPolisi');
        table.string('jenisKendaraan');
        table.string('nomorRangka');
        table.string('nomorMesin');
        table.string('nomorSPK');
        table.integer('printCount').notNullable().defaultTo('0');
        table.string('customerId');
        table.string('userId');
        table.timestamps(true, true);
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('orders');
};
