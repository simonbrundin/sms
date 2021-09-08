const imessage = require("osa-imessage");
require("dotenv").config();
var database = require("knex")({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
const smsText =
  "Det kommer många frågor på när vi kommer igång med serien. På den här länken kan ni läsa vad läget är just nu :) https://superelitserien.se/status/";

async function textAllPlayers() {
  const players = await database.from("spelare").select("tel");
  // .where("ID", 216);

  for (let player = 0; player < players.length; player++) {
    let tel = players[player].tel;
    if (tel.startsWith("46")) {
      const newString = await tel.replace("46", "");

      tel = newString;
    }
    const tel1 = tel.split("-").join("");
    const tel2 = tel1.split(" ").join("");
    let tel3 = tel2.split("+46").join("0");
    if (tel3.startsWith("046")) {
      console.log("ok");
      const newString = tel3.replace("046", "");
      tel3 = newString;
    }

    if (tel3.charAt(0) === "7") {
      tel3 = "0" + tel;
    }
    tel3 = tel3.substring(1);
    tel3 = "+46" + tel3;
    imessage.send(tel3, smsText);
  }
}

textAllPlayers();
