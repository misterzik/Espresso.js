/**
 * EspressoJS - Hippie's Favorite Express Server
 * Powered by Vimedev.com Labs
 * ----
 * Required Dependencies & Depencies
 * ---
 */
require("@misterzik/espressojs");
const configuration = require("@misterzik/espressojs/server");
// Create's Extra Sample Routers for API
const router = require("@misterzik/espressojs/routes/api");
const axios = require("axios");
const getAPI = (req, res) => {
  axios
    .get(configuration.swapi.uri, configuration.swapi.configs)
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
