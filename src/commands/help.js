import { InteractionType, InteractionResponseType } from 'discord-interactions';

export const type = InteractionType.APPLICATION_COMMAND;
export const name = 'help';
export const structure = {};

export const execute = ({ res, data }) => {
  // Getting data from header.js
  const test = data.test;
  
  // Responding
  return res.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Hello world, ${test}`,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: 'Click me!',
              style: 1,
              custom_id: 'click_one'
            }
          ]
        }
      ]
    }
  });
};