const CommentLikeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'comment_likes',
  version: '1.0.0',
  register: async (server, { container }) => {
    const commentLikeHandler = new CommentLikeHandler(container);
    server.route(routes(commentLikeHandler));
  },
};