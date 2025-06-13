class CommentDTO {
  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.date = row.created_at;
    this.content = row.content;
    this.likeCount = row.like_count;
    this.isDeleted = row.deleted_at !== null;
  }
}

module.exports = CommentDTO;