module.exports = (app, express, con3, con, decrypt) => {
    app.use("/test-exam/public", express.static(__dirname + "/public"));
    app.route('/test-exam').get((req, res) => {
        res.sendFile(__dirname + '/public/index.html');
    });
    app.route('/starttest').get((req, res) => {
        res.sendFile(__dirname + '/public/starttest.html');
    }).post((req, res) => {

    });
    app.post('/fetch-test-exam', (req, res) => {
        console.log(req.body.id);
        con3.query(`SELECT  Question, Type, Options, Id FROM Questions WHERE Id = ?`,[req.body.id], (err, data) => {
            if (err) throw err;
            res.json({data : data});
        })
    });
    app.post('/evaluate', (req, res) => {
        con3.query(`SELECT  Answer, Question, Type FROM Questions WHERE Id = ?`,[req.body.id], async (err, data) => {
            let ans = req.body.answers;
            let count = 0;
            let que = [];
            let isr = [];
            let dict = {ch : "Question Type : Choice Question, : " , tf : "Question Type : True or False, Question : " , sha : "Question Type : Short answer, Question : "}
            let answers = [];
            for (let i = 0; i < data.length; i++)
            {
                if (data[i].Answer == ans[i])
                {
                    count += 1;
                    isr.push(0);
                    answers.push(data[i].Answer);
                }
                else{
                    isr.push(1);
                    que.push(dict[data[i].Type] + data[i].Question);
                }
            }
                let exp = que.join("\n");
                import('../bingchat.mjs').then(({ example }) => {
                    example(exp, res, count, data.length, isr, answers);
                  });
        })
    })
    app.post('/search-test-exam', (req, res) => {
        let arr = [];
        con3.query(`SELECT * FROM Testexams WHERE Name LIKE '%${req.body.query}%'`, (err, data) => {
            if (err) throw err;
            for (let i = 0; i < data.length; i++)
            {
                con.query(`SELECT * FROM login WHERE Id = ?`,[data[i].School_id], (err1, data1) => {
                    if (err1) throw err1;
                    for (let j = 0; j < data1.length; j++)
                    {
                        arr.push(data1[j].school_name);
                    }
                    if (i == (data.length - 1))
                    {
                        res.json({data : data, arr : arr});
                    }
                });
            }
        })
    });
    app.route('/make-test-exam').get((req, res) => {
        res.sendFile(__dirname + '/public/makeone.html');
    }).post((req, res) => {
        console.log(req.body);
        con3.query(`DELETE FROM Testexams WHERE Id = ?`, [req.body.id], (err9, data9) => {
            if (err9) throw err9;
            con3.query(`DELETE FROM Questions WHERE Id = ?`, [req.body.id], (err8, data8) => {
                if (err8) throw err8;
                con3.query(`INSERT INTO Testexams (School_id, Name) VALUES (?, ?)`, [decrypt(req.body.Sid), req.body.title], (err, data) => {
                    if (err) throw err;
                    for (let i = 0; i < req.body.ar.length; i++)
                    {
                        let options = "NOTCHOOSE";
                        if (req.body.options)
                        {
                            if (req.body.options[i])
                            {
                                options = req.body.options[i].join(",");
                            }
                        }
                        con3.query(`INSERT INTO Questions (Question, Type, Answer, Options, Id) VALUES (?, ?, ?, ?, ?)`, [req.body.ar[i], req.body.arr[i], req.body.arrr[i], options, data.insertId], (err1, data1) => {
                            if (err1) throw err1;
                        })
                    }
                })
            })
        })
    });
}