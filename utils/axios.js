const { default: Axios } = require('axios');
const { getAuthToken } = require('./authTokenUtils');

module.exports = (async () => {
  const axios = Axios.create({
    baseURL: 'https://dev.to/api/',
    headers: {
      api_key: await getAuthToken(),
    },
  });

  return { axios };
})();
