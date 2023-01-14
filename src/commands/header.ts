import { InteractionType, InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';
import { InteractionData } from '../types/types';

export const type = 'header';
const started = new Date();

export const execute = ({ req, res, data } : InteractionData) => {
  // Handles expired interations
  if (
    req.body.type === InteractionType.MESSAGE_COMPONENT ||
    req.body.type === InteractionType.APPLICATION_MODAL_SUBMIT
  ) {
    if (req.body.message) {
      if (started > new Date(req.body.message.timestamp)) {
        return res.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Interaction expired',
            flags: InteractionResponseFlags.EPHEMERAL
          }
        });
      }
    }
  }

  // 'data' can be used to transfer data to application commands
  // WARNING: Do not do `data = { ...stuff }`.
  data.test = 'hi';
}