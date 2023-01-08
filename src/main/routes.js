import app from './listen.js';
import { verifyKey, InteractionType, InteractionResponseType, InteractionResponseFlags } from 'discord-interactions';
import { ApplicationCommands } from '../util/loader.js';

const started = Date.now();

app.post("/interactions", async (req, res) => {
  // Checks if the request is from Discord
  const signature = req.get('X-Signature-Ed25519');
  const timestamp = req.get('X-Signature-Timestamp');
  const body = await req.text();
  const isValidRequest = verifyKey(body, signature, timestamp, process.env.CLIENT_PUBLIC_KEY);
  if (!isValidRequest) return res.status(401).end('Bad request signature');

  // Gets the interaction 'message' content which the interaction information
  req.body = JSON.parse(body);

  // Handles PING responses
  if (req.body.type === InteractionType.PING) return res.json({ type: InteractionResponseType.PONG });

  // Handles expired interations.
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

  // Finds the application command to execute
  let command;
  const commands = ApplicationCommands.filter(c => req.body.type === c.type);
  switch (req.body.type) {
    // Slash commands and autocomplete
    case InteractionType.APPLICATION_COMMAND:
    case InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE:
      command = commands.find(c => req.body.data.name === c.name);
      break;
    // Message components (eg. buttons) and modal submit
    case InteractionType.MESSAGE_COMPONENT:
    case InteractionType.APPLICATION_MODAL_SUBMIT:
      command = commands.find(c => {
        if (typeof c.custom_id === 'string') {
          if (req.body.data.custom_id === c.custom_id) {
            return true;
          }
        } else if (c.custom_id instanceof RegExp) {
          if (c.custom_id.test(req.body.data.custom_id)) {
            return true;
          }
        }
      });
      break;
  }

  // If there is no provided function for the application command, it warns unknown component in the console.
  if (!command) return console.warn('Unknown component', req.body);

  try {
    return command.execute(req, res);
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
});

app.listen(parseInt(process.env.PORT || '80') || 80);