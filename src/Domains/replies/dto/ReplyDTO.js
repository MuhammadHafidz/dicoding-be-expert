class ReplyDTO {
  constructor(row) {
    this.id = row.id;
    this.commentId = row.comment_id;
    this.username = row.username;
    this.date = row.created_at;
    this.content = row.content;
    this.isDeleted = row.deleted_at !== null;
  }
}

module.exports = ReplyDTO;