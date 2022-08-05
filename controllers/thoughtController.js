const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

//here, we are exporting directly all functions connected to thoughtRoutes
//returning all results in JSON format.
module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    console.log("getThoughts function invoked.")
    Thought.find()
      .then(thoughtData => {

        return res.json(thoughtData);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Get a single thought via findOneandUpdate
  // Pass through the thought ID, then respond with it.
  getSingleThought(req, res) {
    console.log("getSingleThought function triggered.")
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then(thought => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with that ID' });
          return;
        } else {
          res.json(thought);
            }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // create a new thought (MAP THIS OUT)
  // accept request body, which contains the entire thought, or object
  // thoughts are also associated with user; 
  // user is then updated, by adding the ID of the thought to the thoughts array.
  createThought(req, res) {
    console.log("createThought function invoked.")
    Thought.create(req.body)
      .then((thought) => {
        console.log("***req.body accepted, findOneandUpdate for current user")
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addtoSet: { thoughts: thought._id } },
          { new: true }
        );
      })

      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'No user found with that ID.'})
        } else {
          res.status(200).json({ message: 'New thought created.' })
        }
      })
      
      .catch((err) => res.status(500).json(err));
  },

  //Update Thought
  updateThought(req, res) {
    console.log("updateThought function triggered")
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with this id!' })
        } else {
          res.json(thought)
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Delete a thought
  //look by ID; first we remove, then update the array so it no longer shows.
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: 'No such thought exists' })
        } else {
           return User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
        }
      })
      .then((user) => {
        if (!user) {
          res.status(404).json({
              message: 'thought created, but no user found with this id.',
            })
        } else {
          res.json(user)
          console.log("Thought successfully deleted.")
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add Reaction (need to work on this)
  
  // Remove Reaction (need to work on this)

};
