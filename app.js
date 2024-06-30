const wa = require('@open-wa/wa-automate');
const fs = require('fs');
var parseJson;
var sum = 0;
var flag = 0;

wa.create({
    sessionId: "chatpay",
    authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    multiDevice: true,
    hostNotificationLang: 'PT_BR',
    logConsole: false,
    popup: true,
    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client) {
    client.onMessage(async message => {
        flag = 0;
        sum = 0;
        out = "";
        fs.readFile('file.json', function (err, content) {
            if (err) throw err;
            parseJson = JSON.parse(content);
            for (var i in parseJson.users) {
                if (parseJson.users[i].number === message.from) {
                    flag = 1;
                    if (parseJson.users[i].order === "1") {
                        parseJson.users[i].order = "2";
                        parseJson.users[i].score = "0";
                        client.sendText(message.from, "Hi, Welcome to LOADA \nSelect the option that matches your request: \n\n1. Register \n2. Make a Booking \n3. Track My Cargo \n4. Contact HelpDesk \n5. Terms of use");
                    }
                    else if (parseJson.users[i].order === "2") {
                        if (message.body === "1") {
                            parseJson.users[i].order = "1";
                            client.sendText(message.from, "Please use the link below to register your company on the platform");
                        }
                        else if (message.body === "2") {
                            // have a status flag that can be used to check order status
                            parseJson.users[i].order = "3";
                            client.sendText(message.from, "Please enter the container number");
                            //client.sendText(message.from, "Please select a timeslot \n\n3 June 2024 \n1. 08h00 \n2. 09h00 \n3. 10h00 \n4. 11h00 \n\n4 June 2024 \n5. 08h00 \n6. 09h00 \n7. 10h00 \n8. 11h00");
                        }
                        else if (message.body === "3") {
                            parseJson.users[i].order = "4";
                            client.sendText(message.from, "Please enter the container number");
                        }
                        else if (message.body === "4") {
                            parseJson.users[i].order = "1";
                            client.sendText(message.from, "A consultant will be in touch shortly");
                        }
                        else {
                            parseJson.users[i].order = "2";
                            client.sendText(message.from, "Invalid response, reply with a number between 1 and 4");
                        }
                    }
                    else if (parseJson.users[i].order === "3") {
                        parseJson.users[i].order = "4";
                        client.sendText(message.from, "Please select a timeslot \n\n3 June 2024 \n1. 08h00 \n2. 09h00 \n3. 10h00 \n4. 11h00 \n\n4 June 2024 \n5. 08h00 \n6. 09h00 \n7. 10h00 \n8. 11h00");
                    }
                    else if (parseJson.users[i].order === "4") {
                        if (message.body === "1") {
                            parseJson.users[i].order = "5";
                            client.sendText(message.from, "You have selected the 3 June 2024 08h00 timeslot\n\nPlease confirm booking \n1. Confirm \n2. Cancel");
                        }
                        else if (message.body === "2") {
                            parseJson.users[i].order = "5";
                            client.sendText(message.from, "You have selected the 3 June 2024 09h00 timeslot\n\nPlease confirm booking \n1. Confirm \n2. Cancel");
                        }
                        else if (message.body === "3") {
                            parseJson.users[i].order = "5";
                            client.sendText(message.from, "You have selected the 3 June 2024 10h00 timeslot\n\nPlease confirm booking \n1. Confirm \n2. Cancel");
                        }
                        else if (message.body === "4") {
                            parseJson.users[i].order = "5";
                            client.sendText(message.from, "You have selected the 3 June 2024 11h00 timeslot\n\nPlease confirm booking \n1. Confirm \n2. Cancel");
                        }
                        else if (message.body === "5") {
                            parseJson.users[i].order = "5";
                            client.sendText(message.from, "You have selected the 4 June 2024 08h00 timeslot\n\nPlease confirm booking \n1. Confirm \n2. Cancel");
                        }
                        else if (message.body === "6") {
                            parseJson.users[i].order = "5";
                            client.sendText(message.from, "You have selected the 4 June 2024 09h00 timeslot\n\nPlease confirm booking \n1. Confirm \n2. Cancel");
                        }
                        else if (message.body === "7") {
                            parseJson.users[i].order = "5";
                            client.sendText(message.from, "You have selected the 4 June 2024 10h00 timeslot\n\nPlease confirm booking \n1. Confirm \n2. Cancel");
                        }
                        else if (message.body === "8") {
                            parseJson.users[i].order = "5";
                            client.sendText(message.from, "You have selected the 4 June 2024 11h00 timeslot\n\nPlease confirm booking \n1. Confirm \n2. Cancel");
                        }
                        else {
                            parseJson.users[i].order = "1";
                            client.sendText(message.from, "Invalid selection, please send a number between 1 and 8");
                        }
                    }
                    else if(parseJson.users[i].order === "4"){
                        parseJson.users[i].order = "1";
                            client.sendText(message.from, "Your cargo is being processed, you will get a message prompting you to book a timeslot");
                    }
                    else if(parseJson.users[i].order === "5"){
                        parseJson.users[i].order = "1";
                        client.sendText(message.from, "Booking confirmed, your reference number is RTFGKHI45306 \nThank you for using LOADA. You will get a series of notifications when its time to pick your cargo");
                    }
                    fs.writeFile('file.json', JSON.stringify(parseJson), function (err) {
                        if (err) throw err;
                        console.log("done");
                    });
                }
            }
            if (flag === 0) {
                parseJson.users.push({ number: message.from, order: "2" });
                client.sendText(message.from, "Hi, Welcome to LOADA \nSelect the option that matches your request: \n\n1. Register \n2. Make a Booking \n3. Track My Package \n4. Speak to Consultant");
                fs.writeFile('file.json', JSON.stringify(parseJson), function (err) {
                    if (err) throw err;
                    console.log("done");
                });
            }
        });
    });
}