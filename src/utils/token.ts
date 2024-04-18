enum TokenKey {
  TOKEN = 'TOKEN'
}

export const GET_TOKEN = () => localStorage.getItem(TokenKey.TOKEN)
export const SET_TOKEN = (token: string) => localStorage.setItem(TokenKey.TOKEN, token)
export const REMOVE_TOKEN = () => localStorage.removeItem(TokenKey.TOKEN)
