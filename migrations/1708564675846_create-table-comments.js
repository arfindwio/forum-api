/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    owner: {
      type: "VARCHAR(50)",
      references: "users",
      notNull: true,
    },
    thread_id: {
      type: "VARCHAR(50)",
      references: "threads",
      notNull: true,
    },
    content: {
      type: "TEXT",
      notNull: true,
    },
    is_deleted: {
      type: "BOOLEAN",
      default: false,
    },
    date: {
      type: "VARCHAR(50)",
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("comments");
};
