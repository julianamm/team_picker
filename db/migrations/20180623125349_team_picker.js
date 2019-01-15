
exports.up = (knex, Promise) => {
    return knex.schema.createTable("cohorts", table => {
        table.increments("id");
        table.text("logo");
        table.string("name");
        table.string("members");
        table.timestamp("createdAt").default(knex.fn.now());
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.droptable("cohorts");
  };
  
