export default class AnalysisError extends Error {
  constructor (message) {
    super(`AnalysisError: ${message}`)
  }
}
