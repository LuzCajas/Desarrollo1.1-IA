const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const DEFAULT_ROLE = 'profesor';

const userSessions = new Map();

export async function handleIncomingMessage(userId, messageText) {
  const session = getOrCreateSession(userId);
  
  if (messageText.toLowerCase() === '/start') {
    return getWelcomeMessage();
  }
  
  if (messageText.toLowerCase() === '/roles') {
    return getRolesMessage();
  }
  
  if (messageText.toLowerCase().startsWith('/rol ')) {
    const role = messageText.slice(5).trim().toLowerCase();
    return setRole(userId, role);
  }
  
  if (messageText.toLowerCase() === '/historial') {
    return getHistory(userId);
  }
  
  return sendToBackend(session, messageText);
}

function getOrCreateSession(userId) {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, { role: DEFAULT_ROLE, conversation_id: null });
  }
  return userSessions.get(userId);
}

function getWelcomeMessage() {
  return `¡Hola! 👋 Soy tu asistente virtual con roles.

Puedo responder como:
👨‍🏫 Profesor
💻 Programador  
🧠 Psicólogo
💼 Experto en Negocios

Comandos:
/roles - Ver lista de roles
/rol [nombre] - Cambiar rol (ej: /rol programador)
/historial - Ver mi historial de chat

¡Escríbeme tu pregunta!`;
}

function getRolesMessage() {
  return `📋 Roles disponibles:

1️⃣ /rol profesor - Explicaciones paso a paso
2️⃣ /rol programador - Respuestas técnicas con código
3️⃣ /rol psicologo - Apoyo emocional empático
4️⃣ /rol negocios - Estrategia y análisis`;

}

function setRole(userId, role) {
  const validRoles = ['profesor', 'programador', 'psicologo', 'psicólogo', 'negocios'];
  const normalizedRole = role === 'psicólogo' ? 'psicologo' : role;
  
  if (!validRoles.includes(normalizedRole)) {
    return `❌ Rol "${role}" no válido. Usá /roles para ver los roles disponibles.`;
  }
  
  const session = getOrCreateSession(userId);
  session.role = normalizedRole;
  
  const roleNames = {
    profesor: '👨‍🏫 Profesor',
    programador: '💻 Programador',
    psicologo: '🧠 Psicólogo',
    negocios: '💼 Experto en Negocios'
  };
  
  return `✅ Rol cambiado a ${roleNames[normalizedRole]}`;
}

async function sendToBackend(session, messageText) {
  const payload = {
    message: messageText,
    role: session.role,
    channel: 'whatsapp',
    user_id: session.user_id
  };
  
  if (session.conversation_id) {
    payload.conversation_id = session.conversation_id;
  }
  
  const response = await fetch(`${BACKEND_URL}/api/v1/chat/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (session.conversation_id === null) {
    session.conversation_id = data.conversation_id;
  }
  
  return data.assistant_message.content;
}

async function getHistory(userId) {
  const session = getOrCreateSession(userId);
  
  if (!session.conversation_id) {
    return '📭 No tenés historial de chat aún. ¡Escríbeme algo!';
  }
  
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/chat/conversations/${session.conversation_id}/messages`
    );
    
    if (!response.ok) {
      return '❌ No pude obtener el historial.';
    }
    
    const data = await response.json();
    return formatHistory(data.messages);
  } catch {
    return '❌ No pude conectar con el servidor.';
  }
}

function formatHistory(messages) {
  if (!messages || messages.length === 0) {
    return '📭 No hay mensajes en el historial.';
  }
  
  let history = '📝 *Historial de conversación:*\n\n';
  
  messages.forEach((msg, i) => {
    const isUser = msg.role === 'user';
    const prefix = isUser ? '👤 Vos' : '🤖 Bot';
    history += `${prefix}: ${msg.text}\n\n`;
  });
  
  return history;
}