const { Router } = require('express');
const client = require('../../../index');

const router = Router()
  .use((req, res, next) => {
    if (req.isAuthenticated() && client.config.owners.includes(req.user.id)) return next();
    return res.render('error.pug', { errorCode: '403' });
  })
  .get('/', async (req, res) => {
    const guilds = client.guilds
      .sort((a, b) => a.name - b.name)
      .map(guild => ({
        name: guild.name,
        id: guild.id,
        owner: {
          id: guild.ownerID,
          tag: guild.owner ? guild.owner.user.tag : 'Unknown',
        },
        members: guild.memberCount,
        bots: Math.floor((guild.members.filter(m => m.user.bot).size / guild.memberCount) * 100),
        join: guild.joinedTimestamp,
      }));

    res.render('admin_guilds.pug', {
      guilds,
      success: req.query.success || false,
      guildName: req.query.guildName || null,
    });
  })
  .get('/leave', (req, res) => {
    if (!req.query.id) return res.render('error.pug', { errorCode: '500' });

    const guild = client.guilds.get(req.query.id);
    if (!guild) return res.render('error.pug', { errorCode: '500' });

    guild.leave()
      .then(() => res.redirect(`/admin/servers?success=guildLeft&guildName=${guild.name}`))
      .catch(() => res.render('error.pug', { errorCode: '500' }));
  });

module.exports = router;
