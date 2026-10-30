<script setup>
/**
 * ─────────────────────────────────────────────────────────────
 *  Poussière de latérite qui virevolte puis dessine le logo KEC
 * ─────────────────────────────────────────────────────────────
 * 1. Des grains de terre rouge sont soufflés par le vent (harmattan).
 * 2. Ils tourbillonnent puis convergent pour former le cauri + « KEC ».
 * 3. Une fois formé, le logo "respire" ; la souris/le doigt souffle
 *    sur la poussière, qui revient ensuite à sa place.
 * Rendu canvas 2D, ~2 500 particules, mis en pause hors écran.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { COWRIE_BODY, COWRIE_SLIT } from '@/components/brand/cowriePath'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const props = defineProps({
  text: { type: String, default: 'KEC' },
  /** Hauteur relative du logo dans le canvas (0-1) */
  scale: { type: Number, default: 0.42 },
  ambient: { type: Number, default: 260 }
})
const emit = defineEmits(['formed'])

const canvas = ref(null)
let ctx, w, h, dpr, raf, ro, io
let particles = []
let startTime = 0
let visible = true
let formedEmitted = false
const pointer = { x: -9999, y: -9999, active: false }

const COLORS = ['#a8401f', '#c0612f', '#d98a55', '#8a3218', '#e3a06b', '#b5532f', '#f0c08a']

/** Échantillonne les pixels du logo dessiné hors écran -> points cibles */
function sampleLogo() {
  const off = document.createElement('canvas')
  off.width = w; off.height = h
  const o = off.getContext('2d')
  const logoH = Math.min(h * props.scale, w * 0.22)
  const fontSize = logoH * 0.95
  o.font = `700 ${fontSize}px "Fraunces Variable", Georgia, serif`
  const textW = o.measureText(props.text).width
  const cowrieW = logoH * 0.75 * 0.75
  const gap = logoH * 0.22
  const totalW = cowrieW + gap + textW
  const x0 = (w - totalW) / 2
  const y0 = h * 0.5 - logoH / 2

  // Cauri
  o.save()
  o.translate(x0, y0)
  o.scale(cowrieW / 60, logoH / 80)
  o.fillStyle = '#fff'
  o.fill(new Path2D(COWRIE_BODY))
  o.globalCompositeOperation = 'destination-out'
  o.lineWidth = 5
  o.stroke(new Path2D(COWRIE_SLIT))
  o.restore()

  // Monogramme
  o.globalCompositeOperation = 'source-over'
  o.fillStyle = '#fff'
  o.textBaseline = 'middle'
  o.fillText(props.text, x0 + cowrieW + gap, h * 0.5 + fontSize * 0.04)

  // Échantillonnage fin puis sous-échantillonnage aléatoire : logo net, nombre de grains maîtrisé
  const step = 3
  const data = o.getImageData(0, 0, w, h).data
  let pts = []
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 140) pts.push({ x: x + (Math.random() - 0.5) * 1.5, y: y + (Math.random() - 0.5) * 1.5 })
    }
  }
  const max = w < 700 ? 1800 : 3600
  if (pts.length > max) pts = pts.sort(() => Math.random() - 0.5).slice(0, max)
  return pts
}

function build() {
  const pts = sampleLogo()
  particles = pts.map((p) => ({
    // départ : soufflé depuis la gauche/bas, comme un coup de vent
    x: -Math.random() * w * 0.4 + Math.random() * w * 0.3,
    y: h * (0.3 + Math.random() * 0.9),
    vx: 0, vy: 0,
    tx: p.x, ty: p.y,
    size: 1 + Math.random() * 1.8,
    color: COLORS[(Math.random() * COLORS.length) | 0],
    alpha: 0.55 + Math.random() * 0.45,
    delay: Math.random() * 0.9,
    seed: Math.random() * 1000
  }))
  for (let i = 0; i < props.ambient; i++) {
    particles.push({
      x: Math.random() * w, y: Math.random() * h, vx: 0, vy: 0, tx: null, ty: null,
      size: 0.5 + Math.random() * 1.6, color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: 0.15 + Math.random() * 0.4, delay: 0, seed: Math.random() * 1000
    })
  }
  startTime = performance.now()
  formedEmitted = false
  if (prefersReducedMotion()) {
    particles.forEach((p) => { if (p.tx != null) { p.x = p.tx; p.y = p.ty } })
    startTime -= 10000
  }
}

function resize() {
  const rect = canvas.value.parentElement.getBoundingClientRect()
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = Math.max(320, Math.floor(rect.width))
  h = Math.max(240, Math.floor(rect.height))
  canvas.value.width = w * dpr
  canvas.value.height = h * dpr
  canvas.value.style.width = `${w}px`
  canvas.value.style.height = `${h}px`
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  build()
}

/** Champ de vent pseudo-turbulent (somme de sinusoïdes, sans dépendance) */
const wind = (x, y, t, s) =>
  Math.sin(x * 0.0042 + t * 0.7 + s) * Math.cos(y * 0.0051 - t * 0.45) * Math.PI * 2

function frame(now) {
  raf = requestAnimationFrame(frame)
  if (!visible) return
  const t = (now - startTime) / 1000
  ctx.clearRect(0, 0, w, h)

  // Phase : 0 -> 1.1s tourbillon ; 1.1 -> 3.6s convergence ; ensuite maintien
  const gather = Math.min(1, Math.max(0, (t - 1.1) / 2.5))
  const ease = gather * gather * (3 - 2 * gather)

  for (const p of particles) {
    const a = wind(p.x, p.y, t, p.seed)
    if (p.tx == null) {
      // Poussière ambiante : dérive avec le vent, boucle sur les bords
      p.vx += Math.cos(a) * 0.05 + 0.03
      p.vy += Math.sin(a) * 0.05 - 0.004
      p.vx *= 0.96; p.vy *= 0.96
    } else {
      const local = Math.min(1, Math.max(0, ease * 1.2 - p.delay * 0.25))
      const turbulence = (1 - local) * 0.55 + 0.012
      p.vx += Math.cos(a) * turbulence + (p.tx - p.x) * 0.06 * local
      p.vy += Math.sin(a) * turbulence + (p.ty - p.y) * 0.06 * local
      p.vx *= 0.82 + (1 - local) * 0.12
      p.vy *= 0.82 + (1 - local) * 0.12
    }
    // Le visiteur "souffle" sur la poussière
    if (pointer.active) {
      const dx = p.x - pointer.x
      const dy = p.y - pointer.y
      const d2 = dx * dx + dy * dy
      if (d2 < 9000) {
        const f = (1 - d2 / 9000) * 2.2
        const d = Math.sqrt(d2) || 1
        p.vx += (dx / d) * f
        p.vy += (dy / d) * f
      }
    }
    p.x += p.vx
    p.y += p.vy
    if (p.tx == null) {
      if (p.x > w + 10) p.x = -10
      if (p.x < -10) p.x = w + 10
      if (p.y > h + 10) p.y = -10
      if (p.y < -10) p.y = h + 10
    }
    // Scintillement léger une fois le logo formé
    const twinkle = p.tx != null && gather === 1 ? 0.85 + Math.sin(t * 3 + p.seed) * 0.15 : 1
    ctx.globalAlpha = p.alpha * twinkle
    ctx.fillStyle = p.color
    ctx.fillRect(p.x, p.y, p.size, p.size)
  }
  ctx.globalAlpha = 1

  if (gather === 1 && !formedEmitted) {
    formedEmitted = true
    emit('formed')
  }
}

function onPointer(e) {
  const r = canvas.value.getBoundingClientRect()
  pointer.x = e.clientX - r.left
  pointer.y = e.clientY - r.top
  pointer.active = true
}
const onLeave = () => { pointer.active = false }

onMounted(async () => {
  ctx = canvas.value.getContext('2d')
  // Attendre la police pour que le monogramme soit échantillonné avec Fraunces
  try { await document.fonts.load('700 80px "Fraunces Variable"') } catch { /* fallback serif */ }
  resize()
  ro = new ResizeObserver(() => resize())
  ro.observe(canvas.value.parentElement)
  io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
  io.observe(canvas.value)
  raf = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro?.disconnect()
  io?.disconnect()
})

/** Rejouer l'animation (ex : clic sur le logo) */
defineExpose({ replay: build })
</script>

<template>
  <canvas
    ref="canvas" class="laterite-dust" aria-hidden="true"
    @pointermove="onPointer" @pointerleave="onLeave" @pointerdown="onPointer" @pointerup="onLeave"
  />
</template>

<style scoped>
.laterite-dust { position: absolute; inset: 0; width: 100%; height: 100%; touch-action: pan-y; }
</style>
