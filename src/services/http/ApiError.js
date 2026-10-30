/**
 * Erreur applicative unique, levée aussi bien par les mocks que par
 * le client HTTP. `message` est une clé i18n quand c'est possible,
 * ce qui permet d'afficher l'erreur dans la langue de l'utilisateur.
 */
export class ApiError extends Error {
  constructor(code, message, status = 400, details = null) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}
