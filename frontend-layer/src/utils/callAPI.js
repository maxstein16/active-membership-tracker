const connect4server = "http://localhost:8080/v1";

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
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  };


  console.log("getAPIData is attempting its thing");
  // If payload is FormData (for file uploads), do NOT stringify or set Content-Type
  if (payload instanceof FormData) {
    details.body = payload;
    // Remove "Content-Type" header so browser sets it automatically
  } else if (method !== API_METHODS.get) {
    details.headers["Content-Type"] = "application/json";
    details.body = JSON.stringify(payload);
  }

  let link = `${connect4server}${endpoint}`;
  return fetch(link, details)
    .then(async (res) => {
      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        // If the response is an error (non-2xx status), read it as text to prevent JSON.parse errors
        const text = await res.text();
        throw new Error(`API error ${res.status}: ${text}`);
      }

      // Only parse JSON if the response type is actually JSON
      if (contentType && contentType.includes("application/json")) {
        return res.json();
      } else {
        return { message: "Response is not JSON", raw: await res.text() };
      }
    })
    .catch((err) => {
      console.error("API error:", err);
      return { error: err.message }; // Ensure the function always returns an object
    });

}


export const API_METHODS = {
  get: "GET",
  post: "POST",
  put: "PUT",
  delete: "DELETE"
};
