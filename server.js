const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

const SESSION_FILE_PATH = "./whatsapp-session.json";
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
  puppeteer: { headless: true },
  session: sessionCfg,
});

client.on("qr", (qr) => {
  console.log("QR Received", qr);
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", (session) => {
  console.log("AUTHENTICATED", session);
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) console.log(err);
  });
});

client.on("ready", () => {
  console.log("Client is ready!");

  const number = "+6289657115121";
  // Your message.
  const text = "Hey 132";
  // Getting chatId from the number.
  // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
  const chatId = number.substring(1) + "@c.us";

  // Sending message.
  client.sendMessage(chatId, text);
});

client.on("message", (msg) => {
  if (msg.body === "!ping") {
    msg.reply("pong");
  }
});

client.initialize();
