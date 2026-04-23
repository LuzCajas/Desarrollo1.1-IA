# WhatsApp Bot - Chat con Roles

Bot de WhatsApp que conecta con el chat inteligente de roles.

## Instalación

```bash
cd wa-bot
npm install
```

## Configuración

El bot se conecta al backend en `http://localhost:8000` por defecto. Para cambiar la URL:

```bash
export BACKEND_URL=http://tu-servidor:8000
npm start
```

## Uso

```bash
npm start
```

1. Aparecerá un código QR en la terminal
2. Escaneá el QR con tu WhatsApp (WhatsApp Web)
3. ¡Listo! Ya podés chatear

## Comandos

| Comando | Descripción |
|---------|-------------|
| `/start` | Mensaje de bienvenida |
| `/roles` | Ver roles disponibles |
| `/rol [nombre]` | Cambiar rol actual |
| `/historial` | Ver conversación anterior |

## Roles disponibles

- **profesor** - Explicaciones paso a paso
- **programador** - Respuestas técnicas con código
- **psicologo** - Apoyo emocional empático
- **negocios** - Estrategia y análisis de negocios

## Ejemplo

```
Vos: Hola
Bot: ¡Hola! Soy tu asistente...

Vos: /rol programador
Bot: ✅ Rol cambiado a 💻 Programador

Vos: Cómo hago un array en JavaScript?
Bot: En JavaScript podés crear un array así:
     const numeros = [1, 2, 3];
```

## Estructura del proyecto

```
wa-bot/
├── index.js        # Inicialización del cliente WhatsApp
├── bot_logic.js    # Lógica de comandos y conexión al backend
└── package.json    # Dependencias
```