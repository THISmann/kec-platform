/** Stockage du jeton de session (isolé pour pouvoir passer en cookie httpOnly plus tard). */
const KEY = 'kec.token'
export const tokenStorage = {
  get: () => { try { return localStorage.getItem(KEY) } catch { return null } },
  set: (t) => { try { localStorage.setItem(KEY, t) } catch { /* mode privé */ } },
  clear: () => { try { localStorage.removeItem(KEY) } catch { /* mode privé */ } }
}
