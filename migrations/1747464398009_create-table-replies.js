
exports.up = (pgm) => {
  pgm.createTable('replies', {
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
      referencesConstraintName: 'fk_replies.user_id_users.id',
      onDelete: 'SET NULL',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      references: '"comments"',
      referencesConstraintName: 'fk_replies.comment_id_comments.id',
      onDelete: 'SET NULL',
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    deleted_at: {
      type: 'TIMESTAMP',
      notNull: false
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
