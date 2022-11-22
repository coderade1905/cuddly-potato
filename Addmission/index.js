module.exports = (app, express, con, con1, crypto, bp, decrypt) => {
    app.use(bp.json());
    var email;
    app.use(bp.urlencoded({ extended: true }));
    require('./Teacher-Addmission/index.js')(app, express, con, con1, crypto, bp, decrypt);
    app.use("/admission/public", express.static(__dirname + "/public"));
    app.route('/admission').get((req, res) => {
        res.sendFile(__dirname + '/public/index.html');
        }).post((req, res) => {
            email = req.body.email;
            let id;
            let fisrtname;
            let dict = new Object();
            let arr = [];
            email = decrypt(email);
            con.query("SELECT * FROM login WHERE email = ?", email, (err, data) => {
                if (err) throw err;
                if (data.length > 0)
                {
                    id = data[0].Id;
                    con1.query(`SELECT * FROM students${id}`, (err, data) => {
                        if (err) throw err;
                        for (let i = 0; i < data.length; i++)
                        {
                            fisrtname = data[i].Fullname;
                            delete data[i]['Fullname'];
                            delete data[i]['Password'];
                            dict["detail"] = data[i];
                            dict["firstname"] = fisrtname;
                            arr.push(dict);
                        }
                        res.send(arr);
                    })
                }
            })
        });
        app.post('/accept', (req, res) => {
            let email = req.body.email;
            let sid = req.body.sid;
            email = decrypt(email);
            con.query("SELECT * FROM login WHERE email = ?", email, (err, data) => {
                if (err) throw err;
                if (data.length > 0)
                {
                    id = data[0].Id;
                    con1.query(`SELECT * FROM students${id} WHERE Student_id='${sid}'`, (err, data) => {
                        if (err) throw err;
                        if (data.length > 0)
                        {
                            con1.query(`INSERT INTO astudents${id} SELECT * FROM students${id} WHERE Student_id='${sid}';`, (err, data) => {
                                if (err) throw err;
                                con1.query(`DELETE FROM students${id} WHERE Student_id='${sid}'`, (err, data) => {
                                    if (err) throw err;
                                    res.send("Accepted");
                                })
                            })
                    }
                    })
                }
            })
        });
        app.post('/deny', (req, res) => {
            let email = req.body.email;
            let sid = req.body.sid;
            email = decrypt(email);
            con.query("SELECT * FROM login WHERE email = ?", email, (err, data) => {
                if (err) throw err;
                if (data.length > 0)
                {
                    id = data[0].Id;
                    con1.query(`DELETE FROM students${id} WHERE Student_id='${sid}'`, (err, data) => {
                        if (err) throw err;
                        res.send("Denied");
                    })
                }
            })
        })
}