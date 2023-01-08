import { InteractionType, InteractionResponseType } from 'discord-interactions';

export const type = InteractionType.APPLICATION_COMMAND;
export const name = 'challenge';

export const execute = async (req, res) => {
  return res.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'Hello world',
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