const { User } = require("../model/library.model");
const jwt = require('jsonwebtoken');

exports.signUp = async function (req, res) {
  if (req.body == null || req.body == undefined) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const user = new User({
    name: req.body.name,
    surname: req.body.surname,
    username: req.body.username,
    password: req.body.password,
    birthNumber: req.body.birthNumber,
    address: {
      street: req.body.street,
      streetNumber: req.body.streetNumber,
      zipcode: req.body.zipcode,
      city: req.city.zipcode,
    },
    role: "USER"
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

exports.getAllUsers = async (res) => {
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
    .then(() => {
      const token = jwt.sign({username: userFound.username, userId: userFound._id}, "secret_string", {expiresIn:"1h"})
      return res.status(200).json({
        token: token,
        expiresIn: 3600
      })
    })
    .catch(() => {
      return res.status(401).json({
        message: 'Error with authentication'
      })
    })
}
