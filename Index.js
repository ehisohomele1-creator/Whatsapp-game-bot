const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");

const truths = [
"Have you ever lied to your best friend?",
"What is your biggest fear?",
"Who was your first crush?",
"Have you ever cheated in a game?",
"What is your secret habit?",
"Have you ever stalked someone online?",
"What's the most embarrassing thing you've done?",
"Who do you secretly admire?",
"Have you ever told a secret you shouldn't?",
"What’s your guilty pleasure?",
"Have you ever been caught lying?",
"What’s your biggest insecurity?",
"Who in this group do you like most?",
"Have you ever had a crush on a teacher?",
"What’s your weirdest dream?",
"Have you ever cried watching a movie?",
"What’s your most embarrassing nickname?",
"Have you ever been rejected?",
"What’s your biggest regret?",
"Who was your last text to?",
"Have you ever faked being sick?",
"What’s something you’ve never told anyone?",
"Have you ever talked in sleep?",
"Who do you trust most?",
"What’s your darkest secret?",
"Have you ever been jealous of someone here?",
"What’s your worst habit?",
"Have you ever been in trouble at school/work?",
"What’s your dream date?",
"Who was your last call to?",
"Have you ever cheated on a test?",
"What’s your biggest fantasy (non-explicit)?",
"Have you ever lied about your age?",
"Who do you miss right now?",
"What’s your most awkward moment?",
"Have you ever sent a wrong message?",
"What’s your biggest weakness?",
"Have you ever pretended to like someone?",
"What’s your happiest memory?",
"Who knows you best?",
"Have you ever been heartbroken?",
"What’s your favorite secret hobby?",
"Have you ever ignored someone on purpose?",
"What’s your dream job?",
"Have you ever cried in public?",
"What’s your biggest crush type?",
"Have you ever broken a promise?",
"What’s something you fear losing?",
"Who would you switch lives with for a day?"
];

const dares = [
"Send ❤️ to your crush (or pretend)",
"Talk in emojis only for 5 minutes",
"Say something flirty to a random person in GC",
"Send your last emoji keyboard screenshot",
"Type with eyes closed for one message",
"Call a friend and say 'I miss you'",
"Change your profile name for 10 minutes",
"Send a voice note singing any song",
"Write a romantic message to yourself",
"Spam '😂' 10 times in GC",
"Confess a fake secret",
"Say 'I love coding' in a dramatic way",
"Send a random selfie (if comfortable)",
"Act like a robot for 3 messages",
"Say something nice to everyone in GC",
"Text your crush 'hi' (or pretend)",
"Don’t use vowels for 2 messages",
"Reply only in GIF style words",
"Say your crush name out loud (or fake one)",
"Send your funniest emoji combo",
"Write a poem about food",
"Change your status to 'I'm watching you 👀'",
"Say something in caps only",
"Compliment the last person who texted",
"Act like a celebrity for 1 minute",
"Send 5 random emojis that describe your mood",
"Say your last Google search",
"Send 'lol' after every message for 5 mins",
"Type like a baby for 3 messages",
"Say something dramatic like a movie scene",
"Send your battery percentage screenshot",
"Say something you never told anyone",
"Send 'I'm innocent 😇' 5 times",
"Speak only in questions for 2 messages",
"Write your name backwards",
"Say something romantic to the group",
"Send a fake confession",
"Act like you are angry for 2 messages",
"Say your favorite food dramatically",
"Send 3 random facts about yourself",
"Replace every word with 'banana' for 2 messages",
"Say something funny about yourself",
"Do a fake apology message",
"Say your dream superpower",
"Send your most used emoji",
"Talk like a gangster for 2 messages",
"Say something in another language",
"Send a motivational quote",
"Act like a teacher for 1 minute",
"End every message with 😂 for 5 minutes"
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

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
      console.log("✅ Bot is online!");
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

    if (text === "!truth") {
      await sock.sendMessage(sender, { text: "🧠 Truth: " + random(truths) });
    }

    if (text === "!dare") {
      await sock.sendMessage(sender, { text: "🔥 Dare: " + random(dares) });
    }

    if (text === "!td") {
      const choice = Math.random() < 0.5 ? "🧠 Truth: " + random(truths) : "🔥 Dare: " + random(dares);
      await sock.sendMessage(sender, { text: choice });
    }

    if (text === "!menu") {
      await sock.sendMessage(sender, {
        text: `🎮 *Truth & Dare Bot*
Commands:
!truth - get truth
!dare - get dare
!td - random game`
      });
    }
  });
}

startBot();
