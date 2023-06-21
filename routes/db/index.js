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

const clientController = require("../../server/controllers");
const url = "/api/clients/";

module.exports = (app) => {
  /*  Get All */
  app.get(url, (req, res) => {
    clientController.findAll("client", req, res);
  });
  /* Create */
  app.post(url, (req, res) => {
    clientController.create("client", req, res);
  });
  /* Retrieve a single Note with clientId */
  app.get(url + ":clientId", (req, res) => {
    clientController.findOne("client", req, res);
  });
  /** Update a Note with clientId */
  app.put(url + ":clientId", (req, res) => {
    clientController.update("client", req, res);
  });
  /* Delete a Note with clientId */
  app.delete(url + ":clientId", (req, res) => {
    clientController.delete("client", req, res);
  });
};
