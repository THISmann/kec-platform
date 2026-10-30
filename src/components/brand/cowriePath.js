/**
 * Géométrie du cauri (Monetaria moneta), face ventrale.
 * Partagée entre le composant SVG, la pluie de cauris (canvas)
 * et l'animation de poussière qui dessine le logo.
 * Repère : viewBox 0 0 60 80.
 */
export const COWRIE_BODY = 'M30 2C46 2 57 18 58 38C59 58 48 77 30 78C12 77 1 58 2 38C3 18 14 2 30 2Z'
export const COWRIE_SLIT = 'M31 9C27 22 33 34 29 47C27 56 31 64 30 72'

/** Dents de l'ouverture : petits traits de part et d'autre de la fente */
export const COWRIE_TEETH = (() => {
  const teeth = []
  for (let i = 0; i < 9; i++) {
    const y = 15 + i * 6.4
    // la fente ondule : on suit approximativement sa position x
    const x = 30 + Math.sin((y - 9) / 10) * 1.6
    const len = 4.5 + Math.sin((i / 8) * Math.PI) * 2.5
    teeth.push(`M${(x - 2).toFixed(1)} ${y.toFixed(1)}h-${len.toFixed(1)}`)
    teeth.push(`M${(x + 2).toFixed(1)} ${(y + 1.5).toFixed(1)}h${len.toFixed(1)}`)
  }
  return teeth.join('')
})()
