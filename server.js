// const express = require("express");
// const app = express();

const config = require("./config/site_keys");
const twilio = require("twilio")(config.accountSid, config.authToken);
const request = require("request");

function sendMessage() {
  twilio.messages.create(
    {
      to: config.mynumber,
      from: config.number,
      body: `Site Down`
    },
    (err, message) => {
      if (err) {
        console.log("Twilio Error");
        console.log(err);
        res.status(444).json("SMS error");
      }
      console.log(message.sid);
    }
  );
}

function pingServer() {
  return new Promise((resolve, reject) => {
    request("http://www.mapper.bike", function(error, response, body) {
      if (error || response.statusCode !== 200) {
        sendMessage();
        reject();
      } else {
        resolve();
      }
    });
  });
}

function main() {
  pingServer()
    .then(() => {
      console.log("All good");
      setTimeout(main, 3600000); //check every hour
    })
    .catch(() => {
      sendMessage();
    });
}

main();
