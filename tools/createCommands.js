// This file was rushed.

import { ApplicationCommands } from '../src/util/commands';
import { InteractionType } from 'discord-interactions';

const DOMAIN = 'https://discord.com/api/v10';
const headers = { Authorization: `Bot ${process.env.CLIENT_BOT_TOKEN}`, 'Content-Type': 'application/json' };

(async () => {
  const currentCommands = (await request('commands')).map(c => ({ type: c.type, name: c.name, id: c.id }));
  const newCommands = [];
  
  for (const command of ApplicationCommands.filter(c => c.type === InteractionType.APPLICATION_COMMAND)) {
    if (typeof command.structure !== 'object') throw new Error('c.structure must be an object', command);
  
    const structure = {
      ...command.structure,
      name: command.name,
  
      dm_permission: false
    };
  
    if (!structure.description && [undefined, 1].includes(structure.type)) structure.description = 'No description provided';
  
    // I'd automate these here.
    /* 
      name_localizations: 
      description: 
      description_localizations: 
    */
  
    if (currentCommands.find(c => c.name === structure.name)) {
      currentCommands.splice(currentCommands.indexOf(currentCommands.find(c => c.name === structure.name)), 1);
    }
  
    newCommands.push(structure);
  }
  
  if (newCommands.length) {
    console.log(await request('commands', { method: 'put', body: JSON.stringify(newCommands) }));
  }
  
  for (const deleteCommand of currentCommands) {
    console.log(await request(`commands/${deleteCommand.id}`, { method: 'delete' }));
  }
  
  async function request(path, options = {}) {
    const req = await fetch(`${DOMAIN}/applications/${process.env.CLIENT_ID}/${path}`, {
      headers,
      ...options
    });
  
    let body = await req.text();
    try {
      body = JSON.parse(body);
    } catch(err) {
      body = null;
    };
  
    if (req.status !== 200 && req.status !== 204) throw { status: req.status, body };
    return body || req.status;
  }
})();