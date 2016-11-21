export default class MessageAggregator {
  constructor () {
    this.messages = []
  }

  add (message) {
    this.messages.push(message)
  }
}
