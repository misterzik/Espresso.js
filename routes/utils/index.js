const axios = require("axios");
const configuration = require("../../server");

const handleResponse = (res, response) => {
  if (response.status === 200) {
    res.json(response.data);
  } else if (response.status === 400) {
    res.json({ message: "400" });
  }
};

const getAPI = (req, res) => {
  axios
    .get(configuration.api.uri, configuration.api.configs)
    .then(function (response) {
      handleResponse(res, response);
    })
    .catch((err) => res.send(err));
};

const getItem = (req, res, params) => {
  axios
    .get(configuration.api.uri + "/" + params, configuration.api.configs)
    .then(function (response) {
      handleResponse(res, response);
    })
    .catch((err) => res.send(err));
};

const getItemId = (req, res, params, paramsId) => {
  axios
    .get(
      configuration.api.uri + params + "/" + paramsId + "/",
      configuration.api.configs
    )
    .then(function (response) {
      handleResponse(res, response);
    })
    .catch((err) => res.send(err));
};

module.exports = { getAPI, getItem, getItemId };
