/** Kia — canal investisseurs — mock */
import { respond } from '../../mock/mockUtils'
import { computeKpis, recentActivity } from './stats'

export const investorMock = {
  async dashboard() { return respond(computeKpis(), 350) },
  async activity(limit = 25) { return respond(recentActivity(limit), 200) }
}
