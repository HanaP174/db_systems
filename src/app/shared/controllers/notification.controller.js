const { Notification } = require("../model/library.model");

exports.add = async function (req, res) {
    if (req.body == null || req.body == undefined) {
      res.status(400).send("Content can not be empty!");
      return;
    }
  
    const notification = new Notification({
      userId: req.body.userId,
      description: req.body.name.description,
      published: req.body.name.published,
      type: req.body.type
    });
  
    await notification
      .save()
      .then(data => {
        res.send(data);
      })
      .catch(error => {
        res.status(500).send({
          message:
          error.message || "Something went wrong during adding a new notification."
        });
      });
  };

  exports.getAll = async (req, res) => {
    const notificationsDb = await Notification.find().exec();
    const notifications = notificationsDb.map(notification => notification.toJSON());
  
    res.json(notifications);
  }

  exports.get = async (req, res) => {
    if (req.params == null || req.params.id == null) {
      res.status(400).send("Notification id missing!");
      return;
    }
  
    const notification = await Notification.find({ _id: req.params.id });
    res.json(notification);
  };

  exports.update = async (req, res) => {
    if (req.params == null || req.params.id == null || req.body == null) {
      res.status(400).send("Request content or notification id missing!");
      return;
    }
  
    const filter = { _id: req.params.id };
    const udpate = {
      $set: {
        userId: req.body.userId,
        description: req.body.name.description,
        published: req.body.name.published,
        type: req.body.type
      }
    };
  
    try {
      const updated = await Notification.updateOne(filter, udpate);
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
      res.status(400).send("Notification id missing!");
      return;
    }
  
    try {
      const deleted = await Notification.deleteOne({ _id: req.params.id });
      if (deleted.acknowledged === true) {
        res.json(deleted.deletedCount);
      } else {
        res.status(400).send("Delete operation was not acknowledged by the server");
      }
    } catch (error) {
      res.status(400).send("Error whend deleting: " + error);
    }
  };