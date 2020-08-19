/**
 * EspressoJS - Hippie's Fav Server Plate
 * Powered by Vimedev.com Labs
 * ---
 * Client Controller
 *
 * Basic functions to get your started,
 */
const Client = require('./../../models/Client.model.js');

/**
 * Retrieve and return all notes from the documents.
 * @param {*} req - Request data from
 * @param {*} res - Response from call
 */

exports.findAll = (req, res) => {
    Client.find()
        .then(clients => {
            res.send(clients);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error occurred while retrieving your collections."
            });
        });
};

/**
 * Create and Save a new Client's to Collection
 * @param {*} req 
 * @param {*} res 
 */

exports.create = (req, res) => {
    if (!req.body.email) {
        return res.status(400).send({
            message: "E-mail cannot be an empty field."
        });
    }

    /**
     *  Client Body to be created after 
     *  Request byPass of cannot be null
     */
    const client = new Client({
        name: req.body.name || "John Doe",
        email: req.body.email,
        location: req.body.location
    });

    /**
     * Save Client in the document collection 
     */
    client.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Error occurred while creating the Note."
            });
        });
};

/**
 * Find a single client with a clientId 
 * @param {*} req 
 * @param {*} res 
 */
exports.findOne = (req, res) => {
    Client.findById(req.params.clientId)
        .then(client => {
            if (!client) {
                return res.status(404).send({
                    message: "Client not found with the following id " + req.params.clientId
                });
            }
            res.send(client);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Client not found with id " + req.params.clientId
                });
            }
            return res.status(500).send({
                message: "Error retrieving client with id " + req.params.clientId
            });
        });
};

/**
 * Update a client identified by the 
 * clientId in the request collection
 * @param {*} req 
 * @param {*} res 
 */
exports.update = (req, res) => {
    if (!req.body.email) {
        return res.status(400).send({
            message: "Client content cannot be empty"
        });
    }

    /**
     * Find client and update it with the request body 
     * depending on _id
     */
    Client.findByIdAndUpdate(req.params.clientId, {
            name: req.body.name || "John Doe",
            email: req.body.email,
            location: req.body.location
        }, { new: true })
        .then(clients => {
            if (!clients) {
                return res.status(404).send({
                    message: "Client not found with id " + req.params.clientId
                });
            }
            res.send(clients);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Client not found with id " + req.params.clientId
                });
            }
            return res.status(500).send({
                message: "Error updating client with id " + req.params.clientId
            });
        });
};

/**
 * Delete a client with the specified clientId in the request 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = (req, res) => {
    Client.findByIdAndRemove(req.params.clientId)
        .then(Client => {
            if (!note) {
                return res.status(404).send({
                    message: "Client not found with id " + req.params.clientId
                });
            }
            res.send({ message: "Client deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Client not found with id " + req.params.clientId
                });
            }
            return res.status(500).send({
                message: "Could not delete Client with id " + req.params.clientId
            });
        });
};