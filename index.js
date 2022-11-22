const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const app = express();
const http = require('http');
const cors = require('cors');
const bp = require('body-parser');
require('dotenv').config();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const nodeMailer = require('nodemailer');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(__dirname));
const ENC_KEY = Buffer.from(process.env.SEC_KEY, "hex")
const IV = Buffer.from(process.env.INITVEC, "hex")
const encrypt = ((val) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
    });
      
const decrypt = ((encrypted) => {
    let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
    });
const con = mysql.createConnection({
    host: process.env.DATABASEHOST,
    user: process.env.DATABASEUSER,
    password: process.env.DATABASEPASS,
    database: process.env.DATABASE,
    port: 3307,
    multipleStatements: true
})
const con1 = mysql.createConnection({
    host: process.env.DATABASEHOST,
    user: process.env.DATABASEUSER,
    password: process.env.DATABASEPASS,
    database: process.env.DATABASE1,
    port: 3307,
    multipleStatements: true
})
con.connect((err) => {if (err) {throw err};}); 
con1.connect((err) => {if (err) {throw err};}); 


require('./Register/index.js')(app, express, con, con1, crypto, bp);
require('./Register-School/index.js')(app, express, con, con1, crypto, bp, mysql);
require('./Chats/index.js')(app, express, con, io, bp);
require('./Login/index.js')(app, express, con, con1, crypto, bp, encrypt);
require('./School-Login/index.js')(app, express, con, crypto, bp, encrypt);
require('./Home/index.js')(app, express, con, crypto, bp, encrypt);
require('./Cookie-Validate/index.js')(app, express, con, con1, crypto, bp, decrypt);
require('./Search-School/index.js')(app, express, con, con1, crypto, bp, mysql, decrypt);
require('./Send-otp/index.js')(app, express, con, con1, bp, nodeMailer, crypto);
require('./School-home/index.js')(app, express, con, con1, crypto, bp, decrypt);
require('./Addmission/index.js')(app, express, con, con1, crypto, bp, decrypt);
require('./Font/index.js')(app, express);

const port = 3030;

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
