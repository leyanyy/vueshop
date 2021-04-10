import { request } from "./request"
export function loginNet(user, word) {
  return request({
    url: "login",
    method: "post",
    data: {
      username: user,
      password: word
    }

  })
}