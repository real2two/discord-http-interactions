import app from './listen';
import { verifyKey, InteractionType, InteractionResponseType } from 'discord-interactions';
import { ApplicationCommands, findCommand, handleCommand } from '../util/commands';

if (typeof process.env.CLIENT_PUBLIC_KEY !== 'string') throw new Error('env.CLIENT_PUBLIC_KEY is not defined');
const CLIENT_PUBLIC_KEY = process.env.CLIENT_PUBLIC_KEY;

app.post("/interactions", async (req, res) => {
  // Checks if the request is from Discord
  const signature = req.get('X-Signature-Ed25519');
  const timestamp = req.get('X-Signature-Timestamp');
  const body = await req.text();
  const isValidRequest = verifyKey(body, signature, timestamp, CLIENT_PUBLIC_KEY);
  if (!isValidRequest) return res.status(401).end('Bad request signature');

  // Gets the interaction 'message' content which the interaction information
  req.body = JSON.parse(body);

  // Creates 'data' variable to easily transfer data from the header to application commands
  const data = {};

  // Handles PING responses
  if (req.body.type === InteractionType.PING) return res.json({ type: InteractionResponseType.PONG });

  // Handle interaction headers (custom)
  const headers = ApplicationCommands.filter(c => c.type === 'header');
  for (const header of headers) {
    // @ts-ignore
    await handleCommand(header, { req, res, data });
    if (res.aborted) return;
  }

  // Finds the command based on the 'req.body' object
  const command = findCommand(req.body);
  if (!command) return console.warn('Unknown interaction', req.body);
  
  // Handles the application command.
  // @ts-ignore
  await handleCommand(command, { req, res, data });
});

app.listen(parseInt(process.env.PORT || '3000') || 3000);