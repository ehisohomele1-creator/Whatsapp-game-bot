const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const http = require("http");

// ======================
// 🔥 ALIVE SERVER (RENDER FIX)
// ======================
http.createServer((req, res) => {
  res.write("🤖 WhatsApp GC Bot is running");
  res.end();
}).listen(process.env.PORT || 3000);

// ======================
// 🎮 TRUTH & DARE DATA
// ======================

const truths = [
"Have you ever lied to your best friend?",
"What is your biggest fear?",
"Who was your first crush?",
"Have you ever cheated in a game?",
"What is your secret habit?",
"What’s your most embarrassing moment?",
"Have you ever stalked someone online?",
"Who do you like in this group?",
"What’s your biggest insecurity?",
"Have you ever been rejected?",
"Who was your last text to?",
"Have you ever faked being sick?",
"What’s your guilty pleasure?",
"Have you ever cried in public?",
"Who do you trust the most?",
"What’s your secret hobby?",
"Have you ever lied to your parents?",
"What’s your dream relationship?",
"Have you ever cheated on a test?",
"What’s your worst habit?",
"Who is your favorite person here?",
"Have you ever been jealous?",
"What’s your biggest regret?",
"Have you ever sent a wrong message?",
"What’s your darkest secret?",
"Who was your last call to?",
"What’s your dream job?",
"Have you ever broken a promise?",
"What’s your biggest fear in life?",
"Who do you miss right now?"
];

const dares = [
"Send ❤️ to your crush",
"Text someone 'I miss you'",
"Act like a robot for 2 messages",
"Send your last emoji",
"Call a friend and say hi dramatically",
"Spam 😂 in the group 10 times",
"Write your crush name (or fake one)",
"Talk only in emojis for 5 mins",
"Send a voice note singing",
"Change your name to 'King/Queen' for 10 mins",
"Say something romantic to the group",
"Act like a gangster for 2 messages",
"Send your battery percentage",
"Say I love coding loudly",
"Compliment everyone in the group",
"Type with eyes closed",
"Say something funny about yourself",
"Send your most used emoji",
"Talk like a baby for 2 messages",
"Say your biggest secret (fake allowed)",
"Act like a teacher for 1 minute",
"Say your dream superpower",
"Write your name backwards",
"Say something dramatic",
"Send a random selfie (optional)",
"Say 'I'm innocent 😇' 5 times",
"Speak only in questions",
"Say something in caps only",
"Act like you are angry",
"Send 3 random facts about you"
];

// ======================
// 🎲 RANDOM FUNCTION
// ======================
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ======================
// 🤖 BOT START
// ======================
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection } = update;
    if (connection === "open") {
      console.log("✅ Bot is ONLINE");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    if (!text) return;

    const sender = msg.key.remoteJid;

    // 🎮 COMMANDS
    if (text === "!truth") {
      await sock.sendMessage(sender, {
        text: "🧠 Truth: " + random(truths)
      });
    }

    if (text === "!dare") {
      await sock.sendMessage(sender, {
        text: "🔥 Dare: " + random(dares)
      });
    }

    if (text === "!td") {
      const result =
        Math.random() < 0.5
          ? "🧠 Truth: " + random(truths)
          : "🔥 Dare: " + random(dares);

      await sock.sendMessage(sender, { text: result });
    }

    if (text === "!menu") {
      await sock.sendMessage(sender, {
        text: `🎮 *GC GAME BOT*
Commands:
!truth - get truth
!dare - get dare
!td - random game`
      });
    }
  });
}

startBot();
