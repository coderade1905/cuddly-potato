module.exports =  (app, express, con, con1, crypto, bp, encrypt, decrypt) => {
    app.use(bp.json());
    app.use(bp.urlencoded({ extended: true }));
    app.use("/home/public", express.static(__dirname + "/public"));
    app.route('/home').get((req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    }).post((req, res) => {
        
    });
    app.route('/teacher-home').get((req, res) => {
        res.sendFile(__dirname + '/public/teacher-home.html');
    }).post((req, res) => {
        let id = decrypt(req.body.id);
        let sid = decrypt(req.body.Sid);
        let sum = 0;
        let sum1 = 0;
        con1.query(`SELECT Type, Value FROM results${sid} WHERE Student_id = ?`, [id], (err2, data2) => {
            for ( let i = 0; i < data2.length; i++) {
                    sum += data2[i].Value;
            }
            con1.query(`SELECT DISTINCT Teacher_id FROM results${sid} WHERE Student_id = ?`, [id],(err5, data5) => {
                for ( let i = 0; i < data5.length; i++) {
                    con1.query(`SELECT Value FROM resschema${sid} WHERE Teacher_id = ?`, [data5[0].Teacher_id], (err3, data3) => {
                        for ( let i = 0; i < data3.length; i++) {
                            sum1 += data3[i].Value;
                        }
                        if (i == (data5.length -1))
                        {
                            res.json({sum : sum, sum1 : sum1});
                        }
                    })
                }
            });
        });
    });
    app.post('/total-result', (req, res) => {
        let id = decrypt(req.body.id);
        let sid = decrypt(req.body.Sid);
        let arr = [];
        con1.query(`SELECT Type, Value, Teacher_id FROM results${sid} WHERE Student_id = ?`, [id], (err, data) => {
            if (err) throw err;
            for (let i = 0; i < data.length; i++){
                con1.query(`SELECT Teaching_subject FROM ateachers WHERE Teacher_id = ?`, [data[i].Teacher_id], (err3, data3) => {
                    if (err3) throw err3;
                    arr.push([data3[0].Teaching_subject, data[i].Type, data[i].Value]);
                    if (i == (data.length - 1))
                    {
                        res.json({data : arr});
                    }
                })
            }
        })
    })
    app.post('/ranking', (req, res) => {
        let id = decrypt(req.body.id);
        let sid = decrypt(req.body.Sid);
        let arr1 = [];
        con1.query(`SELECT DISTINCT Teacher_id FROM results${sid} WHERE Student_id = ?`, [id], (err, data) => {
            if (err) throw err;
            for (let i = 0; i < data.length; i++){
                con1.query(`SELECT SUM(Value) AS SU FROM results${sid} WHERE Teacher_id = ? AND Student_id = ?`,[data[i].Teacher_id, id]  ,(err4, data4) => {
                    console.log(data4);
                    if (err4) throw err4;
                    con1.query(`SELECT SUM(Value) AS SUM, COUNT(DISTINCT Student_id) AS Num FROM results${sid} WHERE Teacher_id = ?`, [data[i].Teacher_id] ,(err3, data3) => {
                        console.log(data3);
                        if (err3) throw err3;
                        con1.query(`SELECT *,  ROW_NUMBER() OVER (ORDER BY s1.SU DESC) AS theRank
                        FROM (
                            SELECT SUM(Value) AS SU, Student_id
                            FROM results${sid} WHERE Teacher_id = ?
                            GROUP BY Student_id 
                        ) s1
                        `, [data[i].Teacher_id, id] ,(err7, data7) => {
                            if (err7) throw err7;
                            let rank;
                            for (let i = 0; i < data7.length; i++)
                            {
                                if (data7[i].Student_id == id)
                                {
                                    rank = data7[i].theRank;
                                }
                            } 
                            con1.query(`SELECT Teaching_subject FROM ateachers WHERE Teacher_id = ?`, [data[i].Teacher_id], (err1, data1) => {
                                if (err1) throw err1;
                                arr1.push([rank, data1[0].Teaching_subject, data4[0].SU, data3[0].SUM / data3[0].Num]);
                                if (i == data.length -1)
                                {
                                    res.json({data : arr1});
                                }
                            })
                        })
                    })
                })
            }
        });
    })
}