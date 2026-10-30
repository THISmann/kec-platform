<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Pluie de cauris 🐚
 * ─────────────────────────────────────────────────────────────
 * Calque global (monté une fois dans App.vue). Déclenché partout via :
 *     useUiStore().rainCowries(80)
 *
 * Deux comportements, choisis par `useUiStore().cowriesSettle` :
 *  - false (espaces connectés, célébrations) : les cauris tombent en
 *    tournoyant, rebondissent au sol puis s'effacent ;
 *  - true (accueil, salle d'attente) : chute lente « en feuille », un petit
 *    rebond, puis le cauri RESTE au sol. Chaque colonne de 24 px mémorise
 *    sa pile (3 rangs maximum, ensuite on roule vers la colonne voisine) ;
 *    les cauris posés bougent d'un ou deux pixels de temps en temps, un
 *    par un. En mode « posé », le calque fait aussi tomber tout seul 2 à 5
 *    cauris toutes les 5 à 10 s (pluie ambiante).
 *
 * Le vent 🌬️ : quand assez de cauris se sont entassés (40 sur bureau, 18 sur
 * téléphone, ou 12 après 90 s), une rafale de poussière de latérite traverse
 * l'écran, de gauche à droite ou l'inverse. On la voit (volutes et grains de
 * sable, voile poussiéreux qui avance avec elle, jamais de traits), dans le quart bas de l'écran et on voit ses effets : le front de vent
 * soulève les cauris posés les uns après les autres, du côté d'où il vient,
 * et les roule hors de l'écran où ils disparaissent. Puis la pluie reprend,
 * la pile se reforme, et le vent revient.
 * Les sprites sont pré-rendus pour rester fluides sur mobile d'entrée de gamme.
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useUiStore } from '@/stores/ui'
import { COWRIE_BODY, COWRIE_SLIT, COWRIE_TEETH } from '@/components/brand/cowriePath'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const ui = useUiStore()
const canvas = ref(null)
let ctx, w, h, dpr, raf = null
let shells = []
let settled = [] // cauris posés, du plus ancien au plus récent
let pile = {} // hauteur de pile par colonne de 24 px
const COL = 24
const sprites = []
const maxSettled = () => (window.innerWidth < 700 ? 30 : 60)
const windThreshold = () => (window.innerWidth < 700 ? 18 : 40)
const WIND_MIN_GAP = 20000 // au moins 20 s entre deux rafales
const WIND_FALLBACK = 90000 // et une rafale au bout de 90 s dès qu'il y a 12 cauris posés
let wind = null // { dir: -1 | 1, t0, duration, env }
let lastWind = 0
let dust = [] // poussière de latérite portée par le vent
let ambientTimer = null

/** Pluie ambiante (mode posé) : 2 à 5 cauris toutes les 5 à 10 s, jamais quand l'onglet est caché */
function scheduleAmbient(first = false) {
  clearTimeout(ambientTimer)
  ambientTimer = setTimeout(() => {
    if (!ui.cowriesSettle) return
    if (!document.hidden && !prefersReducedMotion()) spawn(2 + Math.floor(Math.random() * 4))
    scheduleAmbient()
  }, first ? 1500 : 5000 + Math.random() * 5000)
}

/** La rafale démarre : chaque cauri posé a son heure d'envol, selon sa distance au côté d'où vient le vent */
function startWind(now) {
  const dir = Math.random() < 0.5 ? -1 : 1
  wind = { dir, t0: now, duration: 5600, env: 0 }
  for (const s of settled) {
    const from = dir > 0 ? s.x : w - s.x // distance au bord d'où souffle le vent
    s.blowAt = now + 600 + (from / w) * 2600 + Math.random() * 500
  }
}

/** Enveloppe de la rafale : monte en 1 s, souffle, retombe sur la fin */
function windEnvelope(p) {
  if (p < 0.18) return p / 0.18
  if (p > 0.78) return Math.max(0, (1 - p) / 0.22)
  return 1
}

/** Poussière : des volutes floues et de fins grains de sable portés par le vent, surtout près du sol (pas de traits) */
function emitDust(speed) {
  const n = window.innerWidth < 700 ? 4 : 8
  for (let i = 0; i < n; i++) {
    const puff = Math.random() < 0.3
    dust.push({
      puff,
      x: Math.random() * w,
      y: h - Math.random() * h * (puff ? 0.21 : 0.25) - 4, // le quart bas de l'écran seulement
      vx: speed * (puff ? 0.45 + Math.random() * 0.4 : 0.6 + Math.random() * 0.7),
      vy: (Math.random() - 0.5) * (puff ? 0.35 : 0.7),
      width: puff ? 18 + Math.random() * 40 : 0.7 + Math.random() * 1.1,
      life: 1,
      decay: puff ? 0.005 + Math.random() * 0.006 : 0.008 + Math.random() * 0.012,
      tone: Math.random()
    })
  }
}

function drawWind(now) {
  const p = (now - wind.t0) / wind.duration
  if (p >= 1) { wind = null; lastWind = now; return 0 }
  const env = windEnvelope(p)
  wind.env = env
  const speed = wind.dir * (7 + 5 * env) * env
  if (env > 0.05) emitDust(speed)
  // Voile de poussière : un dégradé ocre qui avance avec le vent, plus dense au sol et du côté d'où il vient
  const front = wind.dir > 0 ? -w * 0.6 + p * w * 1.8 : w * 1.6 - p * w * 1.8
  const haze = ctx.createLinearGradient(front - wind.dir * w * 0.7, 0, front + wind.dir * w * 0.3, 0)
  haze.addColorStop(0, 'rgba(192, 97, 47, 0)')
  haze.addColorStop(0.55, `rgba(232, 206, 160, ${0.3 * env})`)
  haze.addColorStop(1, 'rgba(192, 97, 47, 0)')
  const floorHaze = ctx.createLinearGradient(0, h * 0.7, 0, h) // le voile ne monte pas au-dessus du tiers bas
  floorHaze.addColorStop(0, 'rgba(0,0,0,0)'); floorHaze.addColorStop(1, 'rgba(0,0,0,1)')
  ctx.save()
  ctx.fillStyle = haze; ctx.fillRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'destination-in'
  ctx.fillStyle = floorHaze; ctx.fillRect(0, 0, w, h)
  ctx.restore()
  // Les traînées
  ctx.save()
  for (const d of dust) {
    d.x += d.vx; d.y += d.vy + Math.sin(d.x * 0.02) * 0.3; d.life -= d.decay
    const a = Math.min(1, env * 1.4) * d.life
    if (d.puff) {
      // Volute de poussière : un disque flou, étiré dans le sens du vent
      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.width)
      g.addColorStop(0, `rgba(240, 220, 180, ${0.14 * a})`); g.addColorStop(1, 'rgba(240, 220, 180, 0)')
      ctx.save(); ctx.translate(d.x, d.y); ctx.scale(2.2, 1); ctx.translate(-d.x, -d.y)
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(d.x, d.y, d.width, 0, Math.PI * 2); ctx.fill(); ctx.restore()
    } else {
      // Grain de sable : un point discret, jamais un trait
      ctx.fillStyle = d.tone < 0.6 ? `rgba(250, 236, 205, ${0.5 * a})` : `rgba(214, 165, 72, ${0.45 * a})`
      ctx.beginPath(); ctx.arc(d.x, d.y, d.width, 0, Math.PI * 2); ctx.fill()
    }
  }
  ctx.restore()
  dust = dust.filter((d) => d.life > 0 && d.x > -60 && d.x < w + 60)
  return speed
}

/** Pré-rend un cauri dans un petit canvas (plusieurs teintes) */
function makeSprite(tint) {
  const c = document.createElement('canvas')
  c.width = 60 * 2; c.height = 80 * 2
  const g = c.getContext('2d')
  g.scale(2, 2)
  const grad = g.createRadialGradient(22, 22, 2, 30, 40, 48)
  grad.addColorStop(0, '#fffaf0')
  grad.addColorStop(0.55, tint)
  grad.addColorStop(1, '#b39469')
  g.fillStyle = grad
  g.fill(new Path2D(COWRIE_BODY))
  g.strokeStyle = '#5a3a24'
  g.lineCap = 'round'
  g.lineWidth = 3.2
  g.stroke(new Path2D(COWRIE_SLIT))
  g.lineWidth = 1.5
  g.globalAlpha = 0.7
  g.stroke(new Path2D(COWRIE_TEETH))
  g.globalAlpha = 0.35
  g.fillStyle = '#fff'
  g.beginPath(); g.ellipse(20, 20, 6, 9, -0.35, 0, Math.PI * 2); g.fill()
  return c
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = window.innerWidth; h = window.innerHeight
  canvas.value.width = w * dpr; canvas.value.height = h * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  // Les cauris posés suivent le bas de la fenêtre
  for (const s of settled) s.y = h - 8 - s.row * 9 - s.size * 0.6
}

function spawn(amount) {
  const settle = ui.cowriesSettle
  for (let i = 0; i < amount; i++) {
    const size = 18 + Math.random() * 20
    shells.push({
      x: Math.random() * w,
      y: -40 - Math.random() * h * 0.9,
      vx: (Math.random() - 0.5) * (settle ? 0.4 : 0.6),
      vy: settle ? 0.6 + Math.random() * 1.0 : 1.5 + Math.random() * 2.5,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.12,
      flip: Math.random() * Math.PI, // simulation 3D (aplatissement horizontal)
      vflip: 0.03 + Math.random() * 0.06,
      size,
      sprite: sprites[(Math.random() * sprites.length) | 0],
      life: 1,
      bounced: 0,
      sway: Math.random() * Math.PI * 2,
      swayAmp: settle ? 0.9 + Math.random() * 0.9 : 0, // chute « en feuille »
      settle,
      settled: false,
      nudge: 0 // petit déplacement en cours (cauri posé)
    })
  }
  if (!raf) raf = requestAnimationFrame(loop)
}

/** Pose un cauri sur la carte de hauteur : 3 rangs maximum, sinon il roule à côté */
function land(s) {
  let col = Math.max(0, Math.min(Math.floor(w / COL), Math.floor(s.x / COL)))
  let tries = 0
  while ((pile[col] ?? 0) >= 3 && tries < 6) { col += Math.random() < 0.5 ? -1 : 1; col = Math.max(0, Math.min(Math.floor(w / COL), col)); tries++ }
  s.row = Math.min(2, pile[col] ?? 0)
  pile[col] = (pile[col] ?? 0) + 1
  s.col = col
  s.x = col * COL + COL / 2 + (Math.random() - 0.5) * 6
  s.y = h - 8 - s.row * 9 - s.size * 0.6
  s.settled = true
  s.vx = 0; s.vy = 0; s.vr = 0; s.vflip = 0
  s.nextNudge = performance.now() + 4000 + Math.random() * 4000
  if (wind) s.blowAt = performance.now() + 300 // posé en pleine rafale : il repart aussitôt
  // Les voisins sentent le contact : un pixel de décalage
  for (const o of settled) if (Math.abs(o.col - col) === 1 && Math.random() < 0.6) o.x += o.col < col ? -1 : 1
  settled.push(s)
  // Plafond : les plus anciens s'effacent lentement (3 s)
  const over = settled.length - maxSettled()
  for (let i = 0; i < over; i++) settled[i].fading = true
}

function loop(now) {
  ctx.clearRect(0, 0, w, h)
  // Faut-il lancer une rafale ? Assez de cauris au sol, ou une pile modeste qui attend depuis longtemps
  if (!wind && ui.cowriesSettle && now - lastWind > WIND_MIN_GAP && !prefersReducedMotion()
    && (settled.length >= windThreshold() || (settled.length >= 12 && now - lastWind > WIND_FALLBACK))) startWind(now)
  const gust = wind ? drawWind(now) : 0 // vitesse horizontale du vent (px / image), 0 sans vent
  for (const s of shells) {
    if (s.settled && wind && now > s.blowAt) {
      // Le front de vent arrive : le cauri décolle du sol et quitte la pile
      s.settled = false; s.blown = true
      pile[s.col] = Math.max(0, (pile[s.col] ?? 1) - 1)
      settled = settled.filter((o) => o !== s)
      s.vx = wind.dir * (2 + Math.random() * 2); s.vy = -(1 + Math.random() * 1.6)
      s.vr = wind.dir * (0.08 + Math.random() * 0.1); s.vflip = 0.05
    }
    if (s.blown) {
      // Roulé et poussé par le vent, avec de petits bonds, jusqu'à sortir de l'écran
      s.vx += gust * 0.06 + (wind ? wind.dir * 0.08 : 0)
      s.vx = Math.max(-16, Math.min(16, s.vx))
      s.vy += 0.14
      s.x += s.vx; s.y += s.vy
      s.rot += s.vr + s.vx * 0.02; s.flip += s.vflip
      const floor = h - 8
      if (s.y + s.size * 0.6 > floor) { s.y = floor - s.size * 0.6; s.vy = -Math.abs(s.vy) * 0.45 - Math.random() * 0.8 }
      if (s.x < -80 || s.x > w + 80) s.life = 0
      if (!wind) s.life -= 0.02 // le vent est tombé avant la sortie : on s'efface
    } else if (!s.settled) {
      s.vy += s.settle ? 0.035 : 0.09
      s.sway += 0.03
      s.x += s.vx + Math.sin(s.sway) * s.swayAmp + gust * 0.4 // en l'air, la chute dérive avec le vent
      s.y += s.vy
      s.rot += s.vr
      s.flip += s.vflip
      const floor = h - 8 - (s.settle ? Math.min(2, pile[Math.floor(s.x / COL)] ?? 0) * 9 : 0)
      if (s.y + s.size * 0.6 > floor) {
        s.y = floor - s.size * 0.6
        s.vy *= s.settle ? -0.22 : -0.35
        s.vr *= 0.4
        s.vflip *= 0.4
        s.bounced++
        if (s.settle && (s.bounced >= 2 || Math.abs(s.vy) < 0.4)) land(s)
        else if (!s.settle && s.bounced > 2) s.life -= 0.02
      }
      if (!s.settle && s.bounced > 2) s.life -= 0.03
    } else {
      // Cauri posé : un léger mouvement horizontal de 1 à 2 px toutes les 4 à 8 s, un par un
      if (now > s.nextNudge) { s.nudge = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random()); s.nextNudge = now + 4000 + Math.random() * 4000 }
      if (s.nudge) { const step = Math.sign(s.nudge) * 0.1; s.x += step; s.nudge -= step; if (Math.abs(s.nudge) < 0.1) s.nudge = 0 }
      if (s.fading) s.life -= 1 / 180 // ~3 s à 60 images/s
    }
    ctx.save()
    ctx.globalAlpha = Math.max(0, s.life)
    ctx.translate(s.x, s.y)
    ctx.rotate(s.rot)
    ctx.scale(0.6 + Math.abs(Math.cos(s.flip)) * 0.4, 1)
    ctx.drawImage(s.sprite, -s.size / 2, -(s.size * 80 / 60) / 2, s.size, s.size * 80 / 60)
    ctx.restore()
  }
  const gone = shells.filter((s) => s.life <= 0)
  if (gone.length) {
    for (const s of gone) if (s.settled) pile[s.col] = Math.max(0, (pile[s.col] ?? 1) - 1)
    shells = shells.filter((s) => s.life > 0)
    settled = settled.filter((s) => s.life > 0)
  }
  if (shells.length || wind || dust.length) raf = requestAnimationFrame(loop)
  else { raf = null; ctx.clearRect(0, 0, w, h) }
}

watch(() => ui.rainRequest, () => {
  if (prefersReducedMotion()) return
  spawn(ui.rainAmount)
})

// Quand on quitte l'accueil / la salle d'attente, les cauris posés s'effacent en douceur
watch(() => ui.cowriesSettle, (on) => {
  if (on) { lastWind = performance.now(); scheduleAmbient(true) }
  else { for (const s of settled) s.fading = true; pile = {}; clearTimeout(ambientTimer); if (wind) { wind = null; dust = [] } }
}, { immediate: true })

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  sprites.push(makeSprite('#efe3c9'), makeSprite('#f3e8d2'), makeSprite('#e6d2ad'))
  resize()
  window.addEventListener('resize', resize)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(ambientTimer)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas ref="canvas" class="cowrie-rain" aria-hidden="true" />
</template>

<style scoped>
/* Sous la barre consultant (90), Manu (95) et les fenêtres modales : les cauris posés ne cachent jamais un bouton */
.cowrie-rain { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 80; }
</style>
