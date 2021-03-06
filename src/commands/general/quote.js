const { MessageEmbed } = require('discord.js');

const Command = require('../../structures/Command');

class QuoteCommand extends Command {
  constructor(client, category) {
    super(client, category, {
      name: 'quote',
    });
  }

  async main(message, [id, ...ch]) {
    const search = ch.join(' ');
    let { channel } = message;
    if (message.guild && search) {
      const found = (this.client.finderUtil.findChannels(message, search) || []).filter((c) => c.type === 'text');
      if (!found) {
        message.error(message._('finder.channels.zero', search));
        return 0;
      }
      if (found.length > 1) {
        message.warn(this.client.finderUtil.formatChannels(message, found, search));
        return 0;
      }
      [channel] = found;
    }

    const msg = await channel.messages.fetch(id)
      .catch(() => null);
    if (!msg) return message.error(message._('quote.unknown', id, channel.name));
    if (!msg.content) return message.info(message._('quote.noContent'));

    const embed = new MessageEmbed()
      .setDescription(msg.content)
      .setFooter(message._(`quote.${msg.editedTimestamp ? 'edit' : 'creation'}`, msg.id), msg.author.displayAvatarURL())
      .setTimestamp(new Date(msg.editedTimestamp || msg.createdTimestamp))
      .setColor(msg.flags.serialize().IS_CROSSPOST ? 0x7289DA : msg.member.displayHexColor);

    message.send(message._('quote.title', (msg.flags.serialize().IS_CROSSPOST ? `**${msg.author.username}**` : msg.author.tag), channel.name), embed);
    return 0;
  }
}

module.exports = QuoteCommand;
