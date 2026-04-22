// snippet-start:[ses.JavaScript.email.sendEmailV3]
const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("../utils/sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, fromName, toName) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: [
        
      ],
      ToAddresses: [
        toAddress,
        
      ],
    },
    Message: {
      
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h2> ${fromName} send a request to ${toName} </h2>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `${fromName} sent a connection request to ${toName}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data:  "New Connection Request 🚀",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (fromName,toName) => {
  const sendEmailCommand = createSendEmailCommand(
    "pranaysalavadhi@gmail.com",
    "pranaysalavadhi001@gmail.com",
    fromName,
    toName
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };