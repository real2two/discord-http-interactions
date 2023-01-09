import glob from 'glob';
import { InteractionType } from 'discord-interactions';

const PATH = './src/commands/';
const files = await new Promise((resolve, reject) => {
  glob(`${PATH}**/*.js`, { matchBase: true, nodir: true }, async (err, files) => {
    if (err) reject(err);
    resolve(files.map(f => f.slice(PATH.length)).filter(f => !f.startsWith('-')));
  });
});

export const ApplicationCommands = [];
for (const file of files) {
  try {
    const command = await import(`../commands/${file}`);

    switch (command.type) {
      // Interaction header (custom)
      case 'header':
        break;
      // Slash commands and autocomplete
      case InteractionType.APPLICATION_COMMAND:
      case InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE:
        if (typeof command.name !== 'string') console.warn('c.name must be a string', command);
        break;
      // Message components (eg. buttons) and modal submit
      case InteractionType.MESSAGE_COMPONENT:
      case InteractionType.APPLICATION_MODAL_SUBMIT:
        if (typeof command.custom_id !== 'string' && command.custom_id instanceof RegExp === false) console.warn('c.custom_id must be a string or RegExp', command);
        break;
      default:
        console.warn('Missing type', command);
        break;
    }
    
    if (typeof command.execute === 'function') {
      ApplicationCommands.push(command);
    } else {
      console.warn('c.execute must be a function', command);
    }
  } catch(err) {
    console.error(err);
  }
}