const { Comment, Pizza } = require('../models');

const commentController = {
  //add comment to Pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          //MongoDB $push works like the push in JavaScript but requires a $ in front of it
          { $push: { comments: _id } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  addReply({ params, body }, res) {
      Comment.findOneAndUpdate(
          { _id: params.commentId },
          { $push: { replies: body }},
          { new: true }
      )
      .then(dbPizzaData => {
          if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
          }
          res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },
  removeReply({ params, body }, res) {
      Comment.findOneAndDelete(
          { _id: params.commentId },
          {$pull: {replies: { replyId: params.reployId } } },
          { new: true }
      )
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.json(err));
  },

  //remove comment
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: 'No comment with this id!' });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
