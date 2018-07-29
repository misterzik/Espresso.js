/**
 * Client DB
 * Controller
 * Insanen.com Labs
 * Extendable to any requirement.
 */
const Client = require('../../models/Client.model.js');

/**
 * Retrieve and return all notes from the database.
 * @param {*} req 
 * @param {*} res 
 */
exports.findAll = (req, res) => {
    Client.find()
    .then(clients => {
        res.send(clients);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

/**
 * Create and Save a new Client to Mongo Collection
 * @param {*} req 
 * @param {*} res 
 */
exports.create = (req, res) => {
    // Validate request
    if(!req.body.email) {
        return res.status(400).send({
            message: "E-mail content can not be empty"
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
     * Save Client in the database collection 
     */
    client.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
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
        if(!client) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.clientId
            });            
        }
        res.send(client);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.clientId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving note with id " + req.params.clientId
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
    // Validate Request
    if(!req.body.email) {
        return res.status(400).send({
            message: "Note content can not be empty"
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
    }, {new: true})
    .then(clients => {
        if(!clients) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.clientId
            });
        }
        res.send(clients);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.clientId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.clientId
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
    .then(note => {
        if(!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.clientId
            });
        }
        res.send({message: "Note deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.clientId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.clientId
        });
    });
};