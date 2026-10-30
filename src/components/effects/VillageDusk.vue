<script setup>
/**
 * Paysage du village au crépuscule (SVG animé) :
 * soleil couchant, baobab-arbre à palabres, cases, route de latérite,
 * oiseaux et lucioles. Section "nostalgie" pour la diaspora.
 */
</script>

<template>
  <svg class="village" viewBox="0 0 1200 520" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs>
      <linearGradient id="vd-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2a1a12" />
        <stop offset=".45" stop-color="#8a3218" />
        <stop offset=".75" stop-color="#d98a55" />
        <stop offset="1" stop-color="#f0c08a" />
      </linearGradient>
      <radialGradient id="vd-sun" cx="50%" cy="50%" r="50%">
        <stop offset="0" stop-color="#fff1c9" />
        <stop offset=".5" stop-color="#f0b45a" />
        <stop offset="1" stop-color="#f0b45a" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="vd-road" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#a8401f" />
        <stop offset="1" stop-color="#6e2a14" />
      </linearGradient>
    </defs>

    <rect width="1200" height="520" fill="url(#vd-sky)" />
    <circle class="sun" cx="760" cy="330" r="150" fill="url(#vd-sun)" />
    <circle cx="760" cy="330" r="58" fill="#fff1c9" opacity=".95" />

    <!-- Oiseaux -->
    <g class="birds" fill="none" stroke="#2a1a12" stroke-width="2.4" stroke-linecap="round">
      <path d="M0 0q8-8 16 0q8-8 16 0" transform="translate(300 140)" />
      <path d="M0 0q6-6 12 0q6-6 12 0" transform="translate(350 120)" />
      <path d="M0 0q7-7 14 0q7-7 14 0" transform="translate(390 160)" />
    </g>

    <!-- Collines lointaines -->
    <path d="M0 380c120-40 240-60 360-40s220 50 340 30 260-70 500-30v180H0z" fill="#5a2a16" opacity=".75" />
    <path d="M0 420c160-30 300-20 460 0s300 10 420-10 220-30 320-10v120H0z" fill="#3a1d10" />

    <!-- Route de latérite -->
    <path d="M560 520c20-60 60-100 120-130 20-10 50-14 60-12-50 20-80 60-90 142z" fill="url(#vd-road)" opacity=".9" />

    <!-- Baobab, arbre à palabres -->
    <g fill="#1a110b" transform="translate(-70 46)">
      <path d="M190 440c6-60 4-110-6-150-8-30 2-40 14-30 6-20 30-20 34 0 14-12 26-4 20 26-10 44-12 100-4 154z" />
      <path d="M200 300c-30-10-60-30-80-60M206 290c-10-40-4-70 10-90M226 290c20-30 50-50 90-56M232 300c30 0 60 10 84 30M196 312c-40 6-70 0-96-16" stroke="#1a110b" stroke-width="9" stroke-linecap="round" />
      <ellipse cx="116" cy="236" rx="40" ry="18" />
      <ellipse cx="214" cy="196" rx="44" ry="20" />
      <ellipse cx="318" cy="228" rx="46" ry="20" />
      <ellipse cx="322" cy="326" rx="30" ry="14" />
      <ellipse cx="96" cy="292" rx="30" ry="13" />
    </g>

    <!-- Cases rondes à toit conique -->
    <g class="huts" fill="#1a110b">
      <rect x="880" y="392" width="78" height="52" rx="6" />
      <path d="M862 398l57-58 57 58z" />
      <rect x="980" y="404" width="60" height="40" rx="5" />
      <path d="M966 410l44-46 44 46z" />
      <rect x="400" y="410" width="54" height="34" rx="4" />
      <path d="M388 414l39-38 39 38z" />
      <rect class="window" x="912" y="410" width="14" height="16" rx="7" fill="#f0b45a" />
    </g>

    <!-- Silhouettes : femme portant une jarre, enfant -->
    <g fill="#1a110b" class="walkers">
      <g transform="translate(690 392)">
        <ellipse cx="0" cy="-58" rx="12" ry="8" />
        <circle cx="0" cy="-44" r="6" />
        <path d="M-6-38h12l6 34-4 46h-6l-2-34-2 34h-6l-4-46z" />
      </g>
      <g transform="translate(716 410) scale(.65)">
        <circle cx="0" cy="-44" r="6" />
        <path d="M-6-38h12l4 30-3 40h-5l-2-28-2 28h-5l-3-40z" />
      </g>
    </g>

    <!-- Lucioles -->
    <g class="fireflies" fill="#f0cf86">
      <circle cx="260" cy="400" r="2" /><circle cx="330" cy="370" r="1.6" /><circle cx="840" cy="380" r="1.8" />
      <circle cx="1080" cy="360" r="1.6" /><circle cx="520" cy="390" r="1.8" /><circle cx="140" cy="380" r="1.5" />
    </g>
    <rect y="440" width="1200" height="80" fill="#140c07" />
  </svg>
</template>

<style scoped>
.village { width: 100%; height: 100%; display: block; }
.sun { animation: glow 6s ease-in-out infinite; transform-origin: 760px 330px; }
@keyframes glow { 50% { transform: scale(1.06); opacity: .85; } }
.birds { animation: fly 22s linear infinite; }
@keyframes fly { from { transform: translateX(-200px); } to { transform: translateX(1100px) translateY(-40px); } }
.fireflies circle { animation: blink 3s ease-in-out infinite; }
.fireflies circle:nth-child(2n) { animation-delay: 1.2s; }
.fireflies circle:nth-child(3n) { animation-delay: 2.1s; }
@keyframes blink { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
.window { animation: flicker 4s infinite; }
@keyframes flicker { 0%, 100% { opacity: .9; } 45% { opacity: .6; } 50% { opacity: 1; } }
.walkers { animation: walk 60s linear infinite; }
@keyframes walk { from { transform: translateX(0); } to { transform: translateX(-260px); } }
</style>
