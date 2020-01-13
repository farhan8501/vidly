import http from "./httpService";
import { apiURL } from "../config.json";
const apiEndpoint = apiURL + "/users";

export function register(user) {
  //return because after sending http request to get back the promise which inturn has data object to get result
  return http.post(apiEndpoint, {
    email: user.username,
    password: user.password,
    name: user.name
  });
}
