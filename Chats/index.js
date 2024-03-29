module.exports =  (app, express, con, con1, con2, io, bp, crypto, encrypt, decrypt) => 
{
const { v4: uuidV4 } = require('uuid');
const async = require('async');
app.use("/chat/public", express.static(__dirname + "/public"));
app.route('/chat').get(
    (req, res) => {
        res.sendFile(__dirname + '/public/chat.html');
    }
);
app.post("/newchat", (req, res) => {
  con1.query(`SELECT Student_id, Fullname, Class, Gender, School_id FROM astudents WHERE FullName Like '%${req.body.q}%'`, (err, data) => {
    if (err) throw err;
    for (let i = 0; i < data.length; i++)
    {
      data[i].School_id = encrypt(""+data[i].School_id);
      data[i].Student_id = encrypt(""+data[i].Student_id);
    }
    res.json({data: data});
  });
});
app.post("/getchats", (req, res) => {
  let me = req.body.me;
  let hoh = "";
  con2.query("SELECT * FROM chats WHERE client1 = ? OR client2 = ?", [me, me], (err, data) => {
    if (err) throw err;
    if (data.length > 0)
    {
      var pack = [];
      async.eachSeries(data,function(data1,callback){
        if (data1.client1 == me)
        {
          hoh = data1.client2.split(",");
        }
        else
        {
          hoh = data1.client1.split(",");
        }
        con1.query("SELECT * FROM astudents WHERE Student_id=? AND School_id=?", [decrypt(hoh[1]), decrypt(hoh[0])], (err1, data2) => {
          if (err1) throw err1;
          pack.push([data2, data1.chatid]);
          callback();
        })    
          }, function(err, results) {
            res.json({data : pack,stat : 0})
        });   
    }
    else{
      res.json({stat : 1});
    }
  });
});
app.post("/startchat", (req, res) => {
  let client1 = req.body.client1;
  let client2 = req.body.client2;
  let body = req.body.bd;
  console.log("a", body);
  if ((client1!== "" && client2 !== "") && (body!== ""))
  {
    con2.query(`SELECT * FROM chats WHERE (client1='${client1}' AND client2='${client2}') OR (client2='${client1}' AND client1='${client2}') `, (err, data) => {
      if (err) throw err;
      if (data.length == 0)
      {
        con2.query(`INSERT INTO chats (client1, client2, unseen1) VALUES ('${client1}','${client2}','${1}')`, (err, data) => {
          if (err) throw err;
          con2.query(`CREATE TABLE chat${data.insertId} (Msg_Id int(11) NOT NULL AUTO_INCREMENT, Fro varchar(100) NOT NULL, Body varchar(1000) NOT NULL, Date timestamp(6) NOT NULL DEFAULT current_timestamp(6), PRIMARY KEY (Msg_Id))  ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci; `, (err, data1) => {
            if (err) throw err;
            con2.query(`INSERT INTO chat${data.insertId} (Fro, Body) VALUES (?, ?)`, [client1, escape(body)], (err, data2) => {
              if (err) throw err;
              res.json({chatid : data.insertId});
            })
          })
        });
      }
      else{
        res.json({chatid : data[0].chatid});
      }
    });
  }
});
app.use("/chat/public", express.static(__dirname + "/public"));
app.get('/videochat', (req, res) => {
  res.redirect(`/videochat/${uuidV4()}`)
})
app.get('/videochat/:room', (req, res) => {
  res.sendFile(__dirname + '/public/videochat.html');
})
app.post('/send', (req, res) => {
  console.log("b", req.body.bd);
  if ((req.body.fro !== "" && req.body.bd !== "") && (req.body.chatid !== ""))
  {
    con2.query(`INSERT INTO chat${req.body.chatid} (Fro, Body) VALUES (?, ?)`, [req.body.fro, req.body.bd], (err, data2) => {
      if (err) throw err;
      res.json({chatid : req.body.chatid});
    })
  }
})
app.post('/messages', (req, res) => {
  con2.query(`SELECT * FROM chat${req.body.chatid}`, (err, data) => {
    if (err) throw err;
    res.json({data: data});
  })
});
io.on('connection', (socket) => {
    socket.on('join', (roomId) => {
      socket.join(roomId);
    })
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.on('ready',()=>{
        socket.to(roomId).emit('user-connected', userId)
      })
      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId)
      })
    })
    socket.on('message', (message, roomId) => 
    {
        socket.to(roomId).emit('bmessage', message);
    });
  });
}