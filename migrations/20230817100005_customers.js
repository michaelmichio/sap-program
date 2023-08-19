/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("customers", (table) => {
        table.increments("id").primary(); // Menggunakan auto-increment
        table.string("name", 100).notNullable();
        table.string("address", 255);
        table.string("email", 100); // .unique()
        table.string("phone", 20);
        table.date("birthdate");
        table.enum("gender", ["pria", "wanita", "lainnya"]);
        
        table.timestamps(true, true);
    })
    .then(() => {
        // Set nilai awal ID
        return knex.raw('ALTER TABLE customers AUTO_INCREMENT = 10000'); // Nilai awal 10000
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("customers");
};
