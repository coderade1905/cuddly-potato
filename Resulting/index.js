module.exports =  (app, express, con, con1, crypto, bp, encrypt, decrypt) => {
    app.use(bp.json());
    app.use(bp.urlencoded({ extended: true }));
    app.use("/resulting/public", express.static(__dirname + "/public"));
    app.route('/resulting').get((req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    }).post((req, res) => {

    });
    app.post('/struct', (req, res) => {
        let da = req.body.da;
        let tid = decrypt(req.body.tid);
        let Sid = decrypt(req.body.Sid);
        con1.query(`SELECT * FROM resschema${Sid} WHERE Teacher_id = ?;`, [tid], (err, data) => {
            if (err) throw err;
            con1.query(`DELETE FROM resschema${Sid} WHERE Teacher_id = ?;`, [tid], (err2, data2) => {
                if (err2) throw err2;
                let f = 0;
                da[0].forEach(element => {
                    con1.query(`INSERT INTO resschema${Sid} (Teacher_id, Type, Value) VALUES(?,?, ?)`,[tid, element, da[1][f]], (err, data) => {
                        if (err) throw err;
                    });
                    f += 1;
                });
                res.json({mes : "done"});
            });
        });
    });
    app.post('/resstruct', (req, res) => {
        let tid = decrypt(req.body.tid);
        let Sid = decrypt(req.body.Sid);
        con1.query(`SELECT * FROM resschema${Sid} WHERE Teacher_id = ?;`, [tid], (err, data) => {
            if (err) throw err;
            if (data.length > 0)
            {
                res.json({data : data});
            }
        });
    });
    app.post('/resstu', (req, res) => {
        let tid = decrypt(req.body.tid);
        let Sid = decrypt(req.body.Sid);
        con1.query(`SELECT * FROM ateachers WHERE Teacher_id = ? AND School_id = ?;`, [tid, Sid], (err, data) => {
            if (err) throw err;
            if (data.length > 0)
            {
               con1.query(`SELECT * FROM astudents WHERE Class = ? AND School_id = ?;`, [data[0].Teaching_class, Sid], (err1, data1) => {
                if (err1) throw err1;
                if (data1.length > 0)
                {
                    res.json({data : data1});                
                }
               });
            }
        });
    });
    app.route('/resultstudent').get((req, res) => {
        res.sendFile(__dirname + '/public/resultstudent.html');
    }).post((req, res) => {
        let tid = decrypt(req.body.tid);
        let sid = decrypt(req.body.Sid);
        let id = req.body.id;
        con1.query(`SELECT * FROM resschema${sid} WHERE Teacher_id = ?;`, [tid], (err1, data1) => {
            if (err1) throw err1;
            con1.query(`SELECT * FROM results${sid} WHERE Student_id = ? AND Teacher_id = ?`, [id, tid] , (err2, data2) => {
                if (err2) throw err2;
                res.json({data : data1, data1 : data2}); 
               });               
           });
    }
    )
    app.post('/studentinfo', (req, res) => {
        con1.query(`SELECT * FROM astudents WHERE Student_id = ? AND School_id = ?`, [req.body.id2, req.body.id1], (err1, data1) => {
            if (err1) throw err1;
            if (data1.length > 0)
            {
                con1.query(`SELECT * FROM ateachers WHERE Teacher_id = ? AND School_id = ?`, [decrypt(req.body.Sid), decrypt(req.body.id)], (err2, data2) => {
                    if (err2) throw err2;
                    if (data2.length > 0)
                    {
                        if ((parseInt(data1[0].Class) == parseInt(data2[0].Teaching_class)) && (parseInt(req.body.id1) == parseInt(decrypt(req.body.id)))) {
                                res.json({status : 200, FN : data1[0].Fullname, TS : data2[0].Teaching_subject})
                        }
                        else{
                                res.json({status : 400, red : "/dafaq"});
                        }
                    }
                    else{
                                res.json({status : 400, red : "/dafaq"});
                    }
                });
            }
            else{
                res.json({status : 400, red : "/dafaq"});
            }
           });
    });
    app.post('/fillresult', (req, res) => {
        let arr = req.body.arr;
        let arr1 = req.body.arr1;
        con1.query(`SELECT * FROM astudents WHERE Student_id = ? AND School_id = ?`, [req.body.id2, req.body.id1], (err1, data1) => {
            if (err1) throw err1;
            if (data1.length > 0)
            {
                con1.query(`SELECT * FROM ateachers WHERE Teacher_id = ? AND School_id = ?`, [decrypt(req.body.Sid), decrypt(req.body.id)], (err2, data2) => {
                    if (err2) throw err2;
                    if (data2.length > 0)
                    {
                        if ((parseInt(data1[0].Class) == parseInt(data2[0].Teaching_class)) && (parseInt(req.body.id1) == parseInt(decrypt(req.body.id)))) {
                            con1.query(`SELECT * FROM results${decrypt(req.body.id)} WHERE Student_id = ? AND Teacher_id = ?`, [req.body.id2, decrypt(req.body.Sid)], (err3, data3) => {
                                if (err3) throw err3;
                                if (data3.length > 0)
                                {
                                    con1.query(`DELETE FROM results${decrypt(req.body.id)} WHERE Student_id = ? AND Teacher_id = ?`, [req.body.id2, decrypt(req.body.Sid)], (err4, data4) => {
                                        if (err4) throw err4;
                                    });
                                    for (let i = 0; i < arr.length; i++)
                                    {
                                        if (arr1[i] != "")
                                        {
                                            con1.query(`INSERT INTO results${decrypt(req.body.id)} (Teacher_id, Type, Value, Student_id) VALUES (?, ?, ?, ?)`, [decrypt(req.body.Sid), arr[i], arr1[i], req.body.id2], (err5, data5) => {
                                                if (err5) throw err5;
                                            });
                                        }
                                    }
                                }
                                else{
                                    for (let i = 0; i < arr.length; i++)
                                    {
                                        if (arr1[i] != "")
                                        {
                                            console.log(decrypt(req.body.Sid), arr[i], arr1[i], req.body.id2);
                                            con1.query(`INSERT INTO results${decrypt(req.body.id)} (Teacher_id, Type, Value, Student_id) VALUES (?, ?, ?, ?)`, [decrypt(req.body.Sid), arr[i], arr1[i], req.body.id2], (err5, data5) => {
                                                if (err5) throw err5;
                                            });
                                        }
                                    };
                                }
                            });
                        }
                        else{
                                res.json({status : 400, red : "/dafaq"});
                        }
                    }
                    else{
                                res.json({status : 400, red : "/dafaq"});
                    }
                });
            }
            else{
                res.json({status : 400, red : "/dafaq"});
            }
           });
    })
}