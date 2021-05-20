'use strict';

const ClientApplication = require('../../../structures/ClientApplication');
let ClientUser;

module.exports = (client, { d: data }, shard) => {
  if (client.user) {
    client.user._patch(data.user);
  } else {
    if (!ClientUser) ClientUser = require('../../../structures/ClientUser');
    client.user = new ClientUser(client, data.user);
    client.users.cache.set(client.user.id, client.user);
  }

  for (const guild of data.guilds) {
    guild.shardID = shard.id;
    client.guilds.add(guild);
  }

  for (const privateChannel of data.private_channels) {
    client.channels.add(privateChannel);
  }

  for (const relationship of data.relationships) {
    client.user.relationships.add(relationship);
  }

  for (const presence of data.presences) {
    client.presences.add(presence);
  }

  if (client.application) {
    client.application._patch(data.application);
  } else {
    client.application = new ClientApplication(client, data.application);
  }

  shard.checkReady();
};
