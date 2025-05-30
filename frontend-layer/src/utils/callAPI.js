// const connect4server = "https://gccis-dio.gccis.rit.edu/v1";
const connect4server = "http://localhost:8080/v1";

/**
 * Call our backend via a REST api call. 
 * @param {String} endpoint - the route you want to access, after the /v1 for example: /organization
 * @param {API_METHODS} method - what REST method do you want, GET, POST, PUT, DELETE?
 * @param {Object} payload - this is the request body, leave it an empty obj for GET
 * @returns {Object} data that the api returns
 */
export async function getAPIData(endpoint, method, payload, isFile = false) {

  let details = {
    method: method,
    credentials: "include",
  };

  // If it's NOT a file upload, set JSON headers
  if (!isFile) {
    details.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  // If sending a file, use FormData instead of JSON
  if (method !== API_METHODS.get) {
    details.body = isFile ? payload : JSON.stringify(payload);
  } 

  let link = `${connect4server}${endpoint}`;

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
