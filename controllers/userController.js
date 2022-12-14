const { Thought, User } = require('../models');

//here, we are exporting directly all functions connected to userRoutes

//just like our thoughtController, we will be exporting directly through module.exports

module.exports = {
  // Get all users
  getUsers(req, res) {
    console.log("getUsers function triggered")
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single user
  getSingleUser(req, res) {
    console.log("getSingleUser function triggered")
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'No user with that ID' })
        } else {
          res.status(200).json(user)
        }
      })

      .catch((err) => res.status(500).json(err));
  },
  // Create new user.
  createUser(req, res) {
    console.log("createUser function triggered", req.body);


    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  //Update User (need to work on this)
  // req = params, body? need to figure out request

  updateUser({ params, body }, res) {
    console.log("updateUser function triggered***")
    User.findOneAndUpdate({ _id: params.userId }, body, { new: true })
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'No user found with this id.'});
          return;
        }
        res.json(user);
      })

      .catch(err => res.status(400).json(err))
  },

  // Delete a User
  deleteUser(req, res) {
    console.log("deleteUser function triggered***")
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and all thoughts associated by user are now deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  // add friend (need to work on this)
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendsId } },
      { new: true }
    )
      .then((friends) => {
          res.json(friends)
    })
      .catch((err) => res.status(500).json(err));
  },

  // remove friend (need to work on this too)
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendsId } },
      { new: true }
    )
      .then((thought) => {
          res.json(thought)
    })
      .catch((err) => res.status(500).json(err));
  },
  
};
