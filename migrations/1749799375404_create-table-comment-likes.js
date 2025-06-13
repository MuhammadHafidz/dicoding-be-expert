
exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      references: '"users"',
      referencesConstraintName: 'fk_comment_likes.user_id_users.id',
      onDelete: 'SET NULL',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      references: '"comments"',
      referencesConstraintName: 'fk_comment_likes.comment_id_comments.id',
      onDelete: 'SET NULL',
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comment_likes');
};
