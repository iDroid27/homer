const Event = require('../structures/Event');

class ReadyEvent extends Event {
  constructor(client) {
    super(client, 'ready');
  }

  async handle() {
    this.client.logger.log(`[ready] Bot initialized successfully - Serving as ${this.client.user.username}`);
    this.client.ready = true;
  }
}

module.exports = ReadyEvent;
