const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const P = require("pino");

const prefix = ".";

let scores = {};
let activeGame = {};

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        auth: state,
        logger: P({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, qr } = update;

        if (qr) {
            console.log("Scan QR:");
            qrcode.generate(qr, { small: true });
        }

        if (connection === "open") {
            console.log("Bot online");
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const chat = msg.key.remoteJid;
        const sender = msg.key.participant || chat;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text;

        if (!text) return;

        const command = text.toLowerCase();

        if (command === ".help") {
            return sock.sendMessage(chat, {
                text: ".guess start | .guess 5 | .trivia | .answer | .score"
            });
        }

        if (command === ".guess start") {
            activeGame[chat] = Math.floor(Math.random() * 10) + 1;
            return sock.sendMessage(chat, { text: "Guess 1-10" });
        }

        if (command.startsWith(".guess ")) {
            const guess = parseInt(command.split(" ")[1]);
            if (!activeGame[chat]) return sock.sendMessage(chat, { text: "Start game first" });

            if (guess === activeGame[chat]) {
                scores[sender] = (scores[sender] || 0) + 1;
                delete activeGame[chat];
                return sock.sendMessage(chat, { text: "Correct +1" });
            } else {
                return sock.sendMessage(chat, { text: "Wrong" });
            }
        }

        if (command === ".trivia") {
            activeGame[chat] = "abuja";
            return sock.sendMessage(chat, { text: "Capital of Nigeria?" });
        }

        if (command.startsWith(".answer ")) {
            const ans = command.replace(".answer ", "").trim().toLowerCase();
            if (ans === activeGame[chat]) {
                scores[sender] = (scores[sender] || 0) + 2;
                delete activeGame[chat];
                return sock.sendMessage(chat, { text: "Correct +2" });
            } else {
                return sock.sendMessage(chat, { text: "Wrong answer" });
            }
        }

        if (command === ".score") {
            return sock.sendMessage(chat, {
                text: `Score: ${scores[sender] || 0}`
            });
        }
    });
}

startBot();
