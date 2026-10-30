/**
 * Coffre-fort juridique — mock.
 * Les fichiers sont lus localement ; les petites images sont gardées en
 * aperçu (dataURL). En production : upload multipart vers un stockage
 * chiffré au repos (cahier des charges §12).
 */
import { db } from '../../mock/db'
import { respond, uid, delay } from '../../mock/mockUtils'
import { ApiError } from '../../http/ApiError'
import { APP_CONFIG } from '@/config/app.config'

const readAsDataUrl = (file) => new Promise((resolve) => {
  const r = new FileReader()
  r.onload = () => resolve(r.result)
  r.onerror = () => resolve(null)
  r.readAsDataURL(file)
})

export const vaultMock = {
  async list(companyId) {
    return respond(db.find('documents', (d) => d.companyId === companyId))
  },

  async upload(companyId, kind, file, onProgress) {
    const { maxSizeMb, accept } = APP_CONFIG.upload
    if (file.size > maxSizeMb * 1024 * 1024) throw new ApiError('FILE_TOO_LARGE', 'errors.fileTooLarge', 413)
    if (!accept.includes(file.type)) throw new ApiError('FILE_TYPE', 'errors.fileType', 415)

    // Progression simulée pour l'UI
    for (let p = 0; p <= 100; p += 20) { onProgress?.(p); await delay(120) }

    const preview = file.type.startsWith('image/') && file.size < 1.5 * 1024 * 1024 ? await readAsDataUrl(file) : null
    const doc = db.insert('documents', {
      id: uid('doc'), companyId, kind, name: file.name, size: file.size, mime: file.type,
      status: 'uploaded', preview, uploadedAt: new Date().toISOString()
    })
    return respond(doc, 0)
  },

  async remove(id) {
    db.remove('documents', id)
    return respond(true, 200)
  }
}
