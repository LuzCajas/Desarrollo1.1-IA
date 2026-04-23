import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { handleIncomingMessage } from './bot_logic.js';

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './wwebjs_auth' }),
  puppeteer: { headless: true }
});

client.on('qr', (qr) => {
  console.log('Escaneá el código QR con tu WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
  console.log('✅ Sesión de WhatsApp autenticada');
});

client.on('ready', () => {
  console.log('✅ Bot de WhatsApp listo!');
});

client.on('message', async (msg) => {
  if (msg.fromMe) return;
  
  const userId = msg.from;
  const messageText = msg.body.trim();
  
  console.log(`Mensaje de ${userId}: ${messageText}`);

  try {
    const response = await handleIncomingMessage(userId, messageText);
    await msg.reply(response);
  } catch (error) {
    console.error('Error:', error.message);
    await msg.reply('Disculpa, hubo un error. Intentá de nuevo.');
  }
});

client.initialize();

process.on('SIGINT', async () => {
  console.log('Cerrando sesión...');
  await client.destroy();
  process.exit(0);
});