/**
 * ─────────────────────────────────────────────────────────────
 *  Point d'entrée UNIQUE de la couche de services.
 * ─────────────────────────────────────────────────────────────
 * Les composants et stores n'importent JAMAIS un adaptateur directement :
 *
 *     import { api } from '@/services'
 *     await api.waitlist.join(form)
 *
 * Le choix mock / http se fait ici selon VITE_API_MODE.
 * Migration progressive possible : surcharger un seul domaine via
 * VITE_API_HTTP_DOMAINS="waitlist,auth" (les autres restent en mock).
 */
import { authMock } from './adapters/mock/auth.mock'
import { waitlistMock } from './adapters/mock/waitlist.mock'
import { companyMock } from './adapters/mock/company.mock'
import { vaultMock } from './adapters/mock/vault.mock'
import { paymentMock } from './adapters/mock/payment.mock'
import { consultantMock } from './adapters/mock/consultant.mock'
import { suggestionMock } from './adapters/mock/suggestion.mock'
import { assistantMock } from './adapters/mock/assistant.mock'
import { investorMock } from './adapters/mock/investor.mock'
import { backofficeMock } from './adapters/mock/backoffice.mock'
import { messagingMock } from './adapters/mock/messaging.mock'
import { consultationMock } from './adapters/mock/consultation.mock'
import * as httpAdapters from './adapters/http'
import { realtimeMock } from './realtime/realtime.mock'
import { realtimeHttp } from './realtime/realtime.http'

export const API_MODE = import.meta.env.VITE_API_MODE === 'http' ? 'http' : 'mock'

const httpDomains = new Set(
  String(import.meta.env.VITE_API_HTTP_DOMAINS || '').split(',').map((s) => s.trim()).filter(Boolean)
)

/** Sélectionne l'adaptateur d'un domaine */
const pick = (domain, mock, real) => (API_MODE === 'http' || httpDomains.has(domain) ? real : mock)

export const api = {
  auth: pick('auth', authMock, httpAdapters.authHttp),
  waitlist: pick('waitlist', waitlistMock, httpAdapters.waitlistHttp),
  company: pick('company', companyMock, httpAdapters.companyHttp),
  vault: pick('vault', vaultMock, httpAdapters.vaultHttp),
  payment: pick('payment', paymentMock, httpAdapters.paymentHttp),
  consultant: pick('consultant', consultantMock, httpAdapters.consultantHttp),
  suggestion: pick('suggestion', suggestionMock, httpAdapters.suggestionHttp),
  assistant: pick('assistant', assistantMock, httpAdapters.assistantHttp),
  investor: pick('investor', investorMock, httpAdapters.investorHttp),
  backoffice: pick('backoffice', backofficeMock, httpAdapters.backofficeHttp),
  messaging: pick('messaging', messagingMock, httpAdapters.messagingHttp),
  consultation: pick('consultation', consultationMock, httpAdapters.consultationHttp),
  realtime: pick('realtime', realtimeMock, realtimeHttp)
}

export { ApiError } from './http/ApiError'
