import prisma from '../util/prisma';
import { InteractionType, InteractionResponseType } from 'discord-interactions';
import { InteractionData } from '../types/types';

export const type = InteractionType.MESSAGE_COMPONENT;
export const custom_id = 'click_one'; // or regex: /click_one/

export const execute = async ({ res } : InteractionData) => {
  const test = await prisma.test.create({});
  return res.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: test.id
    }
  });
};