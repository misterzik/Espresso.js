/**
 * EspressoJS / Espresso is your one-stop 
 * Express Configuration starting point
 */
require("@misterzik/espressojs");
const configuration = require("@misterzik/espressojs/server");

// Create's Sample Routers for API
const router = require("@misterzik/espressojs/routes/api");
const axios = require("axios");
const getAPI = (req, res) => {
  axios
    .get(configuration.api.uri, configuration.api.configs)
    .then(function (response) {
      if (response.status == 200) {
        res.json(response.data);
      } else if (response.status == 400) {
        res.json({ message: "400" });
      }
    })
    .catch((err) => res.send(err));
};
router.get("/v2/", (req, res) => {
  getAPI(req, res);
});
