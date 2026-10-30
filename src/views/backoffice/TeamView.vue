
<script setup>
/**
 * Back-office — Équipe & rôles : membres, rôle, droits par rôle (matrice),
 * invitation, désactivation, 2FA (§12), journal d'audit des actions.
 */
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/services'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { APP_CONFIG } from '@/config/app.config'
import KBadge from '@/components/ui/KBadge.vue'
import KButton from '@/components/ui/KButton.vue'
import KField from '@/components/ui/KField.vue'
import KModal from '@/components/ui/KModal.vue'
import KLoader from '@/components/ui/KLoader.vue'
import { initials, timeAgo, formatDate, formatTime } from '@/utils/format'
import { MEMBER_TONE } from '@/utils/status'

const { t, locale } = useI18n()
const auth = useAuthStore()
const ui = useUiStore()
const tab = ref('members')
const team = ref(null)
const audit = ref(null)
const invite = ref(false)
const form = ref({ name: '', email: '', role: 'agent', title: '' })
const error = ref('')
const { roles, permissions, rolePermissions } = APP_CONFIG.team
const ROLE_TONE = { admin: 'gold', manager: 'clay', agent: 'olive', consultant: 'indigo', viewer: 'muted' }

onMounted(async () => { ;[team.value, audit.value] = await Promise.all([api.backoffice.listTeam(), api.backoffice.listAudit({ limit: 80 })]) })
const byRole = computed(() => roles.map((r) => ({ role: r, n: (team.value ?? []).filter((m) => m.role === r).length })))
const twoFactorRate = computed(() => { const a = (team.value ?? []).filter((m) => m.status === 'active'); return a.length ? Math.round((a.filter((m) => m.twoFactor).length / a.length) * 100) : 0 })

async function setRole(m, role) {
  try { Object.assign(m, await api.backoffice.updateMember(m.id, { role }, auth.actor)); ui.toast(t('team.roleChanged', { name: m.name, role: t(`team.roles.${role}`) }), { type: 'success' }) } catch (e) { ui.toast(t(e.message || 'errors.generic'), { type: 'error' }) }
}
async function toggle(m) {
  const status = m.status === 'disabled' ? 'active' : 'disabled'
  if (status === 'disabled' && !confirm(t('team.confirmDisable', { name: m.name }))) return
  try { Object.assign(m, await api.backoffice.updateMember(m.id, { status }, auth.actor)) } catch (e) { ui.toast(t(e.message || 'errors.generic'), { type: 'error' }) }
}
async function sendInvite() {
  error.value = ''
  if (!form.value.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.value.email)) { error.value = t('validation.email'); return }
  try {
    team.value.push(await api.backoffice.inviteMember(form.value, auth.actor))
    invite.value = false
    form.value = { name: '', email: '', role: 'agent', title: '' }
    ui.toast(t('team.invited'), { type: 'success' })
    audit.value = await api.backoffice.listAudit({ limit: 80 })
  } catch (e) { error.value = t(e.message || 'errors.generic') }
}
</script>

<template>
  <div class="team">
    <header class="head">
      <div><span class="eyebrow">{{ $t('bo.eyebrow') }}</span><h1>{{ $t('team.title') }}</h1><p class="text-muted">{{ $t('team.lead') }}</p></div>
      <div class="tabs" role="tablist">
        <button v-for="tb in ['members', 'roles', 'audit']" :key="tb" type="button" role="tab" :class="{ on: tab === tb }" @click="tab = tb">{{ $t(`team.tabs.${tb}`) }}</button>
      </div>
    </header>
    <KLoader v-if="!team" />

    <!-- ═══ Membres ═══ -->
    <template v-else-if="tab === 'members'">
      <div class="summary">
        <span v-for="r in byRole" :key="r.role" class="pill"><KBadge :tone="ROLE_TONE[r.role]">{{ $t(`team.roles.${r.role}`) }}</KBadge><b>{{ r.n }}</b></span>
        <span class="pill tfa">🔐 2FA {{ twoFactorRate }} %</span>
        <KButton size="sm" @click="invite = true">{{ $t('team.invite') }}</KButton>
      </div>
      <div class="members">
        <article v-for="m in team" :key="m.id" class="member wood-panel" :class="{ off: m.status === 'disabled' }">
          <span class="ava" :style="{ background: m.initialsColor }">{{ initials(m.name) }}</span>
          <div class="who">
            <strong>{{ m.name }}<span v-if="m.id === auth.user.id" class="you">{{ $t('team.you') }}</span></strong>
            <small>{{ m.title || '—' }} · {{ m.email }}</small>
            <small class="text-muted">{{ m.lastLoginAt ? $t('team.lastLogin', { when: timeAgo(m.lastLoginAt, locale) }) : $t('team.neverLogged') }}<template v-if="m.speciality"> · {{ $t(`consultant.speciality.${m.speciality}`) }}</template></small>
          </div>
          <div class="ctl">
            <select class="k-input" :value="m.role" :disabled="m.id === auth.user.id" @change="setRole(m, $event.target.value)"><option v-for="r in roles" :key="r" :value="r">{{ $t(`team.roles.${r}`) }}</option></select>
            <div class="flags">
              <KBadge :tone="MEMBER_TONE[m.status]" :dot="m.status === 'invited'">{{ $t(`team.status.${m.status}`) }}</KBadge>
              <KBadge :tone="m.twoFactor ? 'olive' : 'danger'">{{ m.twoFactor ? '2FA ✓' : '2FA ✕' }}</KBadge>
            </div>
            <button v-if="m.id !== auth.user.id" type="button" class="lnk" @click="toggle(m)">{{ m.status === 'disabled' ? $t('team.enable') : $t('team.disable') }}</button>
          </div>
        </article>
      </div>
    </template>

    <!-- ═══ Matrice des droits ═══ -->
    <div v-else-if="tab === 'roles'" class="wood-panel table-wrap">
      <p class="text-muted hint">{{ $t('team.matrixLead') }}</p>
      <table>
        <thead><tr><th>{{ $t('team.permission') }}</th><th v-for="r in roles" :key="r"><KBadge :tone="ROLE_TONE[r]">{{ $t(`team.roles.${r}`) }}</KBadge></th></tr></thead>
        <tbody>
          <tr v-for="p in permissions" :key="p">
            <td><strong>{{ $t(`team.permissions.${p}`) }}</strong></td>
            <td v-for="r in roles" :key="r" class="c"><span :class="rolePermissions[r].includes(p) ? 'yes' : 'no'">{{ rolePermissions[r].includes(p) ? '✓' : '·' }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ═══ Audit ═══ -->
    <div v-else class="wood-panel table-wrap">
      <p class="text-muted hint">{{ $t('team.auditLead') }}</p>
      <table>
        <thead><tr><th>{{ $t('team.audit.when') }}</th><th>{{ $t('team.audit.who') }}</th><th>{{ $t('team.audit.action') }}</th><th>{{ $t('team.audit.details') }}</th></tr></thead>
        <tbody>
          <tr v-for="a in audit" :key="a.id">
            <td><span>{{ formatDate(a.at, locale) }}</span><small>{{ formatTime(a.at, locale) }}</small></td>
            <td><strong>{{ a.actor }}</strong></td>
            <td>{{ a.label }}<small class="code">{{ a.action }}</small></td>
            <td class="det">{{ a.details || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <KModal :open="invite" :title="$t('team.invite')" @close="invite = false">
      <div class="form">
        <KField :label="$t('team.form.name')" required><input v-model="form.name" class="k-input" /></KField>
        <KField :label="$t('team.form.email')" required :error="error"><input v-model="form.email" type="email" class="k-input" /></KField>
        <KField :label="$t('team.form.role')"><select v-model="form.role" class="k-input"><option v-for="r in roles" :key="r" :value="r">{{ $t(`team.roles.${r}`) }} — {{ $t(`team.roleHints.${r}`) }}</option></select></KField>
        <KField :label="$t('team.form.title')"><input v-model="form.title" class="k-input" /></KField>
        <p class="text-muted small">{{ $t('team.inviteHint') }}</p>
      </div>
      <template #footer><KButton variant="ghost" :icon="false" @click="invite = false">{{ $t('common.close') }}</KButton><KButton @click="sendInvite">{{ $t('team.sendInvite') }}</KButton></template>
    </KModal>
  </div>
</template>

<style scoped lang="scss">
.team { display: grid; gap: 1.25rem; }
.head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 1rem; h1 { margin: 0; } p { margin: .2rem 0 0; font-size: .9rem; } }
.tabs { display: flex; gap: .4rem; button { background: rgba(20,12,7,.4); border: 1px solid var(--kec-border); color: var(--kec-text-muted); padding: .55rem 1.1rem; border-radius: 999px; font-weight: 700; &.on { background: var(--kec-cowrie); color: #2a1a12; } } }
.summary { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; .pill { display: inline-flex; gap: .4rem; align-items: center; b { font-size: .86rem; } } .tfa { padding: .25rem .7rem; border-radius: 99px; border: 1px solid var(--kec-border); font-size: .78rem; font-weight: 700; } :deep(.k-btn) { margin-inline-start: auto; } }
.members { display: grid; gap: .8rem; }
.member { display: grid; grid-template-columns: 46px 1fr; gap: .9rem; padding: 1rem 1.2rem; align-items: center; @include md-up { grid-template-columns: 46px 1fr auto; } &.off { opacity: .55; } }
.ava { width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; color: #1a110b; font-size: .85rem; }
.who { display: flex; flex-direction: column; min-width: 0; strong { font-size: 1rem; display: flex; gap: .5rem; align-items: center; } small { font-size: .76rem; color: var(--kec-text-muted); } .you { font-size: .62rem; padding: .05rem .4rem; border-radius: 99px; background: var(--kec-gold); color: #2a1a12; text-transform: uppercase; letter-spacing: .08em; } }
.ctl { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: .6rem; align-items: center; @include md-up { grid-column: auto; justify-content: flex-end; } .k-input { width: auto; padding: .5rem 2.2rem .5rem .8rem; font-size: .84rem; border-radius: 10px; } }
.flags { display: flex; gap: .3rem; }
.lnk { background: none; border: 0; color: var(--kec-text-muted); font-size: .8rem; font-weight: 700; &:hover { color: #f08a6e; } }
.table-wrap { overflow-x: auto; }
.hint { margin: 0; padding: 1rem 1rem 0; font-size: .84rem; }
table { width: 100%; border-collapse: collapse; font-size: .86rem; th { text-align: start; padding: .8rem 1rem; font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; color: var(--kec-text-muted); border-bottom: 1px solid var(--kec-border); } td { padding: .65rem 1rem; border-bottom: 1px dashed var(--kec-border); vertical-align: top; small { display: block; font-size: .7rem; color: var(--kec-text-muted); } } .c { text-align: center; } .yes { color: #b9c27a; font-weight: 900; } .no { color: var(--kec-text-muted); } .code { font-family: monospace; } .det { color: var(--kec-text-muted); } }
.form { display: grid; gap: 1rem; } .small { font-size: .8rem; margin: 0; }
</style>
