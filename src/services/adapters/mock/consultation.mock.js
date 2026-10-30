/**
 * Demandes de consultation (carte « Que pouvons-nous faire pour vous ? ») : mock.
 * Ouvert à tout visiteur, sans compte. Chaque demande crée un fil de
 * messagerie de type `consultation` pour l'équipe (statut à traiter,
 * délai de réponse suivi comme les autres) et une entrée d'audit.
 */
import { db } from '../../mock/db'
import { respond, uid } from '../../mock/mockUtils'
import { openThread, systemMessage } from './messaging.mock'

const CHANNEL = { whatsapp: 'WhatsApp', call: 'appel téléphonique', email: 'e-mail' }

export const consultationMock = {
  /** @param {{ name, country?, phone?, email?, need, channel, consent, locale?, userId?, page? }} payload */
  async request(payload) {
    const reference = `DC-${new Date().getFullYear()}-${String(db.nextSequence('consultation')).padStart(4, '0')}`
    const contact = [payload.phone, payload.email, payload.country].filter(Boolean).join(' · ')
    const thread = openThread({
      kind: 'consultation', reason: 'consultationRequest', priority: 'normal',
      fellowId: payload.userId ?? null, fellowName: payload.name,
      subject: `${reference} · ${payload.need.slice(0, 60)}${payload.need.length > 60 ? '…' : ''}`,
      tags: ['consultation', (payload.locale ?? 'fr').toUpperCase(), payload.channel].filter(Boolean),
      messages: [
        { from: 'fellow', author: payload.name, text: payload.need },
        systemMessage(`Demande de consultation ${reference} reçue depuis ${payload.page || 'le site'}. Contact : ${contact || 'non renseigné'}. Canal souhaité : ${CHANNEL[payload.channel] ?? payload.channel}. Rappel attendu sous 24 h ouvrées.`)
      ]
    })
    db.update('threads', thread.id, { contact: { name: payload.name, phone: payload.phone ?? '', email: payload.email ?? '', country: payload.country ?? '', channel: payload.channel }, reference })
    db.insert('audit', { id: uid('aud'), at: new Date().toISOString(), actor: payload.name, action: 'consultation.request', label: `Demande de consultation ${reference}`, details: payload.channel })
    return respond({ reference, threadId: thread.id }, 700)
  }
}
