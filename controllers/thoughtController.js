const{User, Thought} = require('../models');

module.exports = {
  // find all thoughts
  getThoughts(req, res) {
    Thought.find()
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
  },

  // Get a single thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then(async (thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json({thought})
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // create a new thought
  createThought(req, res) {
    Thought.create(req.body)
    .then(({_id}) => {
      return User.findOneAndUpdate(
        {_id: req.body.userId},
        {$push: {thoughts: _id}},
        {new: true}
      );
    })
    .then((thought) =>
    !thought
      ? res.status(404).json({message: 'No user with that ID'})
      : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
  },

  // Delete a thought and remove them from the user
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.throughtId })
      .then((throught) =>
        !throught
          ? res.status(404).json({ message: 'No such throught exists' })
          : User.findOneAndUpdate(
              { throughts: req.params.throughtId },
              { $pull: { throughts: req.params.throughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'Thought deleted, but no users found',
            })
          : res.json({ message: 'Thought successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Create a reaction
  createReaction(req, res) {
    Thought.findOneAndUpdate(
      {_id: req.body.thoughtId},
      {$addToSet: {reactions: req.body}},
      {new: true, runValidators: true}
      
    )
  },

  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, New: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No thought find with this ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  
  // Remove reaction from a user
  removeReaction(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};