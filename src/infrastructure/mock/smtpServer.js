const { SMTPServer } = require("smtp-server");

const emails = [];

const server = new SMTPServer({
  authOptional: true,
  onData(stream, session, callback) {
    let email = "";
    stream.on("data", (chunk) => {
      email += chunk.toString();
    });
    stream.on("end", () => {
      emails.push(email);
      console.log("Received email:\n", email);
      callback();
    });
  },
});

server.listen(2525, () => {
  console.log("SMTP server listening on port 2525");
});

module.exports = {
  getEmails: () => emails,
};
