module.exports =  (app, express, con, crypto, bp, encrypt) => {
    app.use("/school-login/public", express.static(__dirname + "/public"));
    app.route('/school-login').get((req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    }).post((req, res) => {
        const Email = req.body.email;
        const PA1 = req.body.Pass;
        const PA = crypto.createHash('md5').update(PA1).digest('hex');
        if (!Email || !PA1) {
            res.json({message: 'Please Fill All The Fields.', status : 400});
        }
        else{
            const query = `SELECT * FROM login WHERE email=? AND password=?`
                    con.query(query, [Email, PA] ,(err, data) => {
                        if (err) {
                            throw err;
                        }
                        if(data.length == 1)
                        {
                            res.json({SCID : encrypt(data[0].Id+ ""), SSN : data[0].school_name, Email : encrypt(data[0].email), Pass: encrypt(data[0].password),City : encrypt(data[0].City), red : "/school-home", status : 200});
                        }
                        else{
                            res.json({message : 'Incorrect email or password', status : 401});
                        }        
                    });
        }
    });
}