/*
 * _|      _|  _|      _|  _|_|_|
 * _|      _|  _|_|  _|_|  _|    _|
 * _|      _|  _|  _|  _|  _|    _|
 *   _|  _|    _|      _|  _|    _|
 *     _|      _|      _|  _|_|_|
 * EspressoJS - Client Model
 * --
 * Basic Clients Collection - API CRUD
 * @param {*} app - Vimedev.com Labs
 */

const clientController = require("../../server/controllers/client/client.controller.js");
const { create, findAll, findOne, update } = clientController;
const url = "/api/clients/";

module.exports = (app) => {
  /* Create */
  app.post(url, create);
  /*  Get All */
  app.get(url, findAll);
  /* Retrieve a single Note with clientId */
  app.get(url + ":clientId", findOne);
  /** Update a Note with clientId */
  app.put(url + ":clientId", update);
  /* Delete a Note with clientId */
  app.delete(url + ":clientId", clientController.delete);
};
