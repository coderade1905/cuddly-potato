module.exports =  (app, express, con, con1, crypto, bp, mysql) => {
    app.use("/register-school/public", express.static(__dirname + "/public"));
    app.route('/register-school').get((req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    }).post((req, res) => {
    const Email = req.body.Email;
    const query1 = `SELECT * FROM login WHERE email = ?`;
    con.query(query1, Email , (err, data) => {
        if (err) {
            throw err;
        }
        if (data.length > 0)
        {
        const Sid = data[0].Id;
        const q = `CREATE TABLE chat${Sid} (Msg_Id int(11) NOT NULL, Fro int(10) NOT NULL, T int(10) NOT NULL, Body varchar(1000) NOT NULL, Status int(1) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                    CREATE TABLE chats${Sid} (Sender int(1) NOT NULL,Receiver int(1) NOT NULL,Chat_Id int(11) NOT NULL,ChatDate timestamp(6) NOT NULL DEFAULT current_timestamp(6)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                    CREATE TABLE news${Sid} (Id int(10) NOT NULL,Title varchar(40) NOT NULL,Main varchar(1000) NOT NULL,Date timestamp(6) NOT NULL DEFAULT current_timestamp(6)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                    CREATE TABLE results${Sid} (Id int(10) NOT NULL,Subject varchar(20) NOT NULL,Result int(10) NOT NULL,Outof int(10) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                    CREATE TABLE schema${Sid} (Field_Name varchar(20) NOT NULL,Field_Type varchar(10) NOT NULL,Length int(10) NOT NULL,Is_option tinyint(1) NOT NULL, options varchar(100) NOT NULL, t varchar(2) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                    ALTER TABLE chat${Sid}
                    ADD PRIMARY KEY (Msg_Id);
                    ALTER TABLE chats${Sid}
                    ADD PRIMARY KEY (Chat_Id);
                    ALTER TABLE news${Sid}
                    ADD PRIMARY KEY (Id);
                    ALTER TABLE chat${Sid}
                    MODIFY Msg_Id int(11) NOT NULL AUTO_INCREMENT;
                    ALTER TABLE chats${Sid}
                    MODIFY Chat_Id int(11) NOT NULL AUTO_INCREMENT;
                    ALTER TABLE news${Sid}
                    MODIFY Id int(10) NOT NULL AUTO_INCREMENT;`
        con1.query(q, (err, data) => {
            if (err) throw err;
            res.json({red : '/school-login', status : 200}); 
        });
    }
    });
});
app.post('/verify-otp', (req, res) => {
    let email = req.body.email;
    let otp = req.body.otp;
    const Sname = req.body.Sname;
    const City = req.body.City;
    const PA1 = req.body.Pass;
    const PA2 = req.body.CPass;
    const PA = crypto.createHash('md5').update(PA1).digest('hex');
    if (!Sname|| !City || !PA1 || !PA2|| !email) {
        res.json({error : 'Please Fill All The Fields.', status : 400});
    }
    else{
        con.query("SELECT * FROM login WHERE email = ?", email, (err, data) =>
        {
            if (err) throw err;
            if (data.length > 0)
            {
                res.json({message : "EMAIL ALREADY EXISTS", status: 400})
            }
            else
            {
                let query = "SELECT * FROM email_verfc WHERE email = ? AND otp = ? ORDER BY Id DESC"
                con.query(query, [email, otp], (err, data) => {
                    if (err) throw err;
                    if (data.length > 0)
                    {
                        const generatedAt = new Date(data[0].hour);
                        const currentDate = new Date();
                        const diffTime = Math.abs(currentDate - generatedAt);


                        if (diffTime < 600000)
                        {
                            const query1 = `INSERT INTO login (school_name, password, email, City) VALUES (?, ?, ?, ?)`;
                            con.query(query1, [Sname, PA, email, City], (err, data) => {
                                if (err) throw err;
                                res.json({message : "Successfully verified we are getting things ready for you!", status : 200});
                            });
                        }
                        else 
                        {
                            res.json({message : "Your otp is expired!"});
                        }
                    }
                    else {
                        res.json({message : "Incorrect otp", status : 401});
                    }
                });
            }
        })
    }
});
}