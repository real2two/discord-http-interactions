import prisma from '@/util/prisma.js';
import { InteractionType, InteractionResponseType } from 'discord-interactions';

export const type = InteractionType.MESSAGE_COMPONENT;
export const custom_id = 'click_one'; // or regex: /click_one/

export const execute = async (req, res) => {
  const test = await prisma.test.create();
  return res.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: test.id
    }
  });
};