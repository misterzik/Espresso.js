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

module.exports = (app) => {
  const clientRouter = require("../../server/controllers/client/client.controller.js");
  const url = "/api/clients/";
  /**
   * Create
   */
  app.post(url, clientRouter.create);
  /**
   * Get All
   */
  app.get(url, clientRouter.findAll);
  /**
   * Retrieve a single Note with clientId
   */
  app.get(url + ":clientId", clientRouter.findOne);
  /**
   * Update a Note with clientId
   */
  app.put(url + ":clientId", clientRouter.update);
  /**
   * Delete a Note with clientId
   */
  app.delete(url + ":clientId", clientRouter.delete);
};
