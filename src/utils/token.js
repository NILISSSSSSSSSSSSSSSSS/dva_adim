import Cookies from 'js-cookie'

const TokenKey = 'Auth-Token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (TokenKey, token, expiresIn) {
  const now = new Date()

  return Cookies.set(TokenKey, token, {
    path: '',
    domain: process.env.VUE_APP_COOKIE_DOMAIN,
    expires: now.setTime(expiresIn * 1000)
  })
}

export function removeToken () {
  return Cookies.remove(TokenKey, {
    domain: process.env.VUE_APP_COOKIE_DOMAIN
  })
}
