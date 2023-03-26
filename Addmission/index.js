module.exports = (app, express, con, con1, crypto, bp, decrypt) => {
    app.use(bp.json());
    var email;
    app.use(bp.urlencoded({ extended: true }));
    app.use("/admission/public", express.static(__dirname + "/public"));
    app.use("/admission-teacher/public", express.static(__dirname + "/public"));
    app.route('/admission').get((req, res) => {
        res.sendFile(__dirname + '/public/student.html');
        }).post((req, res) => {
            email = req.body.email;
            let id;
            let fisrtname;
            let arr = [];
            email = decrypt(email);
            con.query("SELECT * FROM login WHERE email = ?", email, (err, data) => {
                if (err) throw err;
                if (data.length > 0)
                {
                    id = data[0].Id;
                    con1.query(`SELECT * FROM students${id} WHERE Status = "W"`, (err, data) => {
                        if (err) throw err;
                        for (let i = 0; i < data.length; i++)
                        {
                            let dict = new Object();
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
        app.route('/admission-teacher').get((req, res) => {
            res.sendFile(__dirname + '/public/teacher.html');
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
                        con1.query(`SELECT * FROM teachers${id}`, (err, data) => {
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
            let ty;
            let ty1;
            let ty2;
            if (req.body.url == "/admission")
            {
                ty = "students";
                ty1 = "astudents";
                ty2 = "Student_id";
            }
            else
            {
                ty = "teachers";
                ty1 = "ateachers";
                ty2 = "Teacher_id";
            }
            email = decrypt(email);
            con.query("SELECT * FROM login WHERE email = ?", email, (err, data) => {
                if (err) throw err;
                if (data.length > 0)
                {
                    id = data[0].Id;
                    con1.query(`SELECT * FROM ${ty+id} WHERE ${ty2}='${sid}'`, (err, data) => {
                        if (err) throw err;
                        if (data.length > 0)
                        {
                            con1.query(`INSERT INTO ${ty1} SELECT ${ty2}, Fullname, Password, PhoneNumber, Gender, ${ty == "students" ? "Class," : ""} School_id FROM ${ty+id} WHERE ${ty2}='${sid}';`, (err, data) => {
                                if (err) throw err;
                                con1.query(`UPDATE ${ty+id} SET Status = "A" WHERE ${ty2}='${sid}'`, (err, data) => {
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
            if (req.body.url == "/admission")
            {
                ty = "students";
            }
            else
            {
                ty = "teachers";
            }
            email = decrypt(email);
            con.query("SELECT * FROM login WHERE email = ?", email, (err, data) => {
                if (err) throw err;
                if (data.length > 0)
                {
                    id = data[0].Id;
                    con1.query(`UPDATE ${ty+id} SET Status = "D" WHERE ${ty2}='${sid}`, (err, data) => {
                        if (err) throw err;
                        res.send("Denied");
                    })
                }
            })
        })
}