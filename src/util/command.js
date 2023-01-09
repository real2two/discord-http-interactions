import { InteractionType, InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';
import { ApplicationCommands } from './loader.js';

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