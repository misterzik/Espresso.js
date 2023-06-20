/**
 * Retrieve and return all clients from the collection.
 * @param {string} clientName - Name of the client model
 * @param {*} req - Request data
 * @param {*} res - Response data
 */
exports.findAll = (clientName, req, res) => {
  const PropertyName = require(`../../models/${clientName}.model.js`);

  PropertyName.find()
    .then((clients) => {
      res.send(clients);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Error occurred while retrieving ${clientName} clients.`,
      });
    });
};

/**
 * Create and save a new client to the collection.
 * @param {string} clientName - Name of the client model
 * @param {*} req - Request data
 * @param {*} res - Response data
 */
exports.create = (clientName, req, res) => {
  const PropertyName = require(`../../models/${clientName}.model.js`);

  if (!req.body.email) {
    return res.status(400).send({
      message: "Email cannot be an empty field.",
    });
  }

  const dataProperty = new PropertyName({
    name: req.body.name,
    email: req.body.email,
    location: req.body.location,
  });

  dataProperty
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Error occurred while creating ${clientName} PropertyName.`,
      });
    });
};

/**
 * Find a single client by clientId.
 * @param {string} clientName - Name of the client model
 * @param {*} req - Request data
 * @param {*} res - Response data
 */
exports.findOne = (clientName, req, res) => {
  const PropertyName = require(`../../models/${clientName}.model.js`);

  PropertyName.findById(req.params.clientId)
    .then((client) => {
      if (!client) {
        return res.status(404).send({
          message:
            `${clientName} client not found with id ` + req.params.clientId,
        });
      }
      res.send(client);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message:
            `${clientName} client not found with id ` + req.params.clientId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving client with id " + req.params.clientId,
      });
    });
};

/**
 * Update a client identified by clientId.
 * @param {string} clientName - Name of the client model
 * @param {*} req - Request data
 * @param {*} res - Response data
 */
exports.update = (clientName, req, res) => {
  const PropertyName = require(`../../models/${clientName}.model.js`);

  if (!req.body.email) {
    return res.status(400).send({
      message: "Client content cannot be empty",
    });
  }

  PropertyName.findByIdAndUpdate(
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
          message:
            `${clientName} client not found with id ` + req.params.clientId,
        });
      }
      res.send(client);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message:
            `${clientName} client not found with id ` + req.params.clientId,
        });
      }
      return res.status(500).send({
        message: "Error updating client with id " + req.params.clientId,
      });
    });
};

/**
 * Delete a client by clientId.
 * @param {string} clientName - Name of the client model
 * @param {*} req - Request data
 * @param {*} res - Response data
 */
exports.delete = (clientName, req, res) => {
  const PropertyName = require(`../../models/${clientName}.model.js`);

  PropertyName.findByIdAndRemove(req.params.clientId)
    .then((client) => {
      if (!client) {
        return res.status(404).send({
          message:
            `${clientName} client not found with id ` + req.params.clientId,
        });
      }
      res.send({ message: "Client deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message:
            `${clientName} client not found with id ` + req.params.clientId,
        });
      }
      return res.status(500).send({
        message: "Could not delete client with id " + req.params.clientId,
      });
    });
};
