// Check if .env variables are valid. (doesn't completely check.)

for (const variable of [
  'PORT',
  'CLIENT_ID',
  'CLIENT_BOT_TOKEN',
  'CLIENT_PUBLIC_KEY'
]) {
  if (variable in process.env === false) throw new Error(`env.${variable} cannot be undefined.`);
}

if (
  typeof parseInt(process.env.PORT) !== 'number' ||
  isNaN(parseInt(process.env.PORT) ||
  parseInt(process.env.PORT) < 0 ||
  parseInt(process.env.PORT) > 65535)
) throw new Error('env.PORT must be a number.');

// Starts the web server.
import './clusters.js';