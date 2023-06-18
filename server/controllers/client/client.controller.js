/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - EspressoJS / Espresso is your one-stop
 * Express Configuration starting point
 */

const Client = require("../../models/client.model.js");

/**
 * Retrieve and return all clients from the collection.
 * @param {*} req - Request data
 * @param {*} res - Response data
 */
exports.findAll = (req, res) => {
  Client.find()
    .then((clients) => {
      res.send(clients);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error occurred while retrieving clients.",
      });
    });
};

/**
 * Create and save a new client to the collection.
 * @param {*} req - Request data
 * @param {*} res - Response data
 */
exports.create = (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({
      message: "Email cannot be an empty field.",
    });
  }

  const client = new Client({
    name: req.body.name || "John Doe",
    email: req.body.email,
    location: req.body.location,
  });

  client
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error occurred while creating the client.",
      });
    });
};

/**
 * Find a single client by clientId.
 * @param {*} req - Request data
 * @param {*} res - Response data
 */
exports.findOne = (req, res) => {
  Client.findById(req.params.clientId)
    .then((client) => {
      if (!client) {
        return res.status(404).send({
          message: "Client not found with id " + req.params.clientId,
        });
      }
      res.send(client);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Client not found with id " + req.params.clientId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving client with id " + req.params.clientId,
      });
    });
};

/**
 * Update a client identified by clientId.
 * @param {*} req - Request data
 * @param {*} res - Response data
 */
exports.update = (req, res) => {
  if (!req.body.email) {
    return res.status(400).send({
      message: "Client content cannot be empty",
    });
  }

  Client.findByIdAndUpdate(
    req.params.clientId,
    {
      name: req.body.name || "John Doe",
      email: req.body.email,
      location: req.body.location,
    },
    { new: true }
  )
    .then((client) => {
      if (!client) {
        return res.status(404).send({
          message: "Client not found with id " + req.params.clientId,
        });
      }
      res.send(client);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Client not found with id " + req.params.clientId,
        });
      }
      return res.status(500).send({
        message: "Error updating client with id " + req.params.clientId,
      });
    });
};

/**
 * Delete a client by clientId.
 * @param {*} req - Request data
 * @param {*} res - Response data
 */
exports.delete = (req, res) => {
  Client.findByIdAndRemove(req.params.clientId)
    .then((client) => {
      if (!client) {
        return res.status(404).send({
          message: "Client not found with id " + req.params.clientId,
        });
      }
      res.send({ message: "Client deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Client not found with id " + req.params.clientId,
        });
      }
      return res.status(500).send({
        message: "Could not delete client with id " + req.params.clientId,
      });
    });
};
