
exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: '"users"',
      referencesConstraintName: 'fk_comments.user_id_users.id',
      onDelete: 'SET NULL',
    },
    thread_id: {
      type: 'VARCHAR(50)',
      references: '"threads"',
      referencesConstraintName: 'fk_comments.thread_id_threads.id',
      onDelete: 'SET NULL',
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    deleted_at: {
      type: 'TIMESTAMP',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
