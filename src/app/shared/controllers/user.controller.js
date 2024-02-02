const { User } = require("../model/library.model");
const jwt = require('jsonwebtoken');

exports.signUp = async function (req, res) {
  if (req.body == null || req.body == undefined) {
    res.status(400).send("Content can not be empty!");
    return;
  }

  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    username: req.body.username,
    password: req.body.password,
    birthNumber: req.body.birthNumber,
    address: {
      street: req.body.address.street,
      streetNumber: req.body.address.streetNumber,
      zipcode: req.body.address.zipcode,
      city: req.body.address.city,
    },
    role: "USER",
    activated: false
  });

  await user
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.status(500).send({
        message:
        error.message || "Something went wrong during signing up new user."
      });
    });
};

exports.get = async (req, res) => {
  if (req.params == null || req.params.id == null) {
    res.status(400).send("User id missing!");
    return;
  }

  const user = await User.find({ _id: req.params.id });
  res.json(user);
};

exports.update = async (req, res) => {
  if (req.params == null || req.params.id == null || req.body == null) {
    res.status(400).send("Request content or user id missing!");
    return;
  }

  const filter = { _id: req.params.id };
  const udpate = {
    $set: {
      name: req.body.name,
      surname: req.body.surname,
      role: req.body.role,
      birthNumber: req.body.birthNumber,
      address: req.body.address,
      password: req.body.password,
      activated: req.body.activated
    }
  };

  try {
    const updated = await User.updateOne(filter, udpate);
    if (updated.acknowledged === true) {
      res.json(updated.matchedCount);
    } else {
      res.status(400).send("Update operation was not acknowledged by the server");
    }
  } catch (error) {
    res.status(400).send("Error whend updating: " + error);
  }
}

exports.delete = async (req, res) => {
  if (req.params == null || req.params.id == null) {
    res.status(400).send("User id missing!");
    return;
  }

  try {
    const deleted = await User.deleteOne({ _id: req.params.id });
    if (deleted.acknowledged === true) {
      res.json(deleted.deletedCount);
    } else {
      res.status(400).send("Delete operation was not acknowledged by the server");
    }
  } catch (error) {
    res.status(400).send("Error whend deleting: " + error);
  }
};

exports.getAllUsers = async (req, res) => {
  const allUsersDb = await User.find().exec();
  const allUsers = allUsersDb.map(user => user.toJSON());

  res.json(allUsers);
}

exports.login = async (req, res) => {
  let userFound;

  User.findOne({username: req.body.username})
    .then(user => {
      if(!user){
        return res.status(401).json({
          message: 'User not found'
        })
      }
      userFound = user
      return req.body.password === user.password;
    })
    .then(result => {
      if(!result){
        return res.status(401).json({
          message: 'Password is incorrect'
        })
      }
      const token = jwt.sign({username: userFound.username, userId: userFound._id}, "secret_string", {expiresIn:"1h"})
      return res.status(200).json({
        token: token,
        expiresIn: 3600,
        user: userFound
      })
    })
    .catch(() => {
      return res.status(401).json({
        message: 'Error with authentication'
      })
    })
}
