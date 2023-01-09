import glob from 'glob';
import { InteractionType, InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';

const files = await new Promise((resolve, reject) => {
  const PATH = './src/commands/';
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

export const handleCommand = async (command, { req, res, data }) => {
  try {
    return await command.execute({ req, res, data });
  } catch(err) {
    console.error(err);
    return res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'An unexpected error has occured',
        flags: InteractionResponseFlags.EPHEMERAL
      }
    });
  }
}

export const findCommand = interaction => {
  // Finds the application command to execute
  const commands = ApplicationCommands.filter(c => interaction.type === c.type);
  switch (interaction.type) {
    // Slash commands and autocomplete
    case InteractionType.APPLICATION_COMMAND:
    case InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE:
      return commands.find(c => interaction.data.name === c.name);
    
    // Message components (eg. buttons) and modal submit
    case InteractionType.MESSAGE_COMPONENT:
    case InteractionType.APPLICATION_MODAL_SUBMIT:
      return commands.find(c => {
        if (typeof c.custom_id === 'string') {
          if (interaction.data.custom_id === c.custom_id) {
            return true;
          }
        } else if (c.custom_id instanceof RegExp) {
          if (c.custom_id.test(interaction.data.custom_id)) {
            return true;
          }
        }
      });
  }
  
  // If there is no provided function for the application command, it warns unknown component in the console
  return null;
}