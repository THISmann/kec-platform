/** Kopen Mind — boîte à suggestions — mock */
import { db } from '../../mock/db'
import { respond, uid } from '../../mock/mockUtils'

export const suggestionMock = {
  async create({ message, category = 'other', author = 'Anonyme', contact = '' }) {
    const s = db.insert('suggestions', { id: uid('sug'), message, category, author, contact, status: 'new', createdAt: new Date().toISOString() })
    return respond(s, 600)
  }
}
