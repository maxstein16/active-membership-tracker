const connect4server = "http://gccis-dio.gccis.rit.edu:8081/v1";

/**
 * Call our backend via a REST api call. 
 * @param {String} endpoint - the route you want to access, after the /v1 for example: /organization
 * @param {API_METHODS} method - what REST method do you want, GET, POST, PUT, DELETE?
 * @param {Object} payload - this is the request body, leave it empty for GET
 * @returns {Object} data that the api returns
 */
export async function getAPIData(endpoint, method, payload) {
  let details = {
    method: method,
    credentials: 'include',
    headers: {
      Accept: "application/json",
      "Content-Type": 'application/json',
    },
  };
  if (method !== API_METHODS.get) {
    details["body"] = JSON.stringify(payload);
  }

  let link = `${connect4server}${endpoint}`;
  // console.log("LINK", link)

  return fetch(link, details)
    .then((res) => res.json())
    .catch((err) => {
      console.log("err:", err);
    });
}

export const API_METHODS = {
  get: "GET",
  post: "POST",
  put: "PUT",
  delete: "DELETE"
};
