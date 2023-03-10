module.exports =  (app, express, con, con1, crypto, bp, decrypt) => {
   const path = require('path')
   const uuidv4 = require('uuid/v4');
   app.use("/lm/public", express.static(__dirname + "/public"));
   app.use("/uploads", express.static(__dirname + "/uploads"));
   app.route("/learning-materials").get((req, res) => {
    res.sendFile(__dirname + '/public/index.html');
   }).post((req, res) => {
      let sampleFile;
      let uploadPath;    
      let Thumb;
      if (!req.files || Object.keys(req.files).length === 0) {
         return res.status(400).send('No files were uploaded.');
       }
       sampleFile = req.files.sampleFile;
       Thumb= req.files.Thumb;
       let upath = uuidv4() + path.extname(sampleFile.name);
       let tpath = uuidv4() + path.extname(Thumb.name);
       uploadPath =  __dirname + '/uploads/' + upath;
       ThumbPath =  __dirname + '/uploads/thumb/' + tpath;
       sampleFile.mv(uploadPath, function(err) {
         if (err){
           return res.status(500).send(err);
         }
         Thumb.mv(ThumbPath, function(err) {
            if (err){
              return res.status(500).send(err);
            }
            con1.query(`INSERT INTO elearning(Title,Link,Description,School_Id,Type,Thumb) VALUES('${escape(req.body.title)}', '${upath}' ,'${escape(req.body.desc)}', '${decrypt(req.body.id)}', '${path.extname(sampleFile.name)}','${tpath}')`, (err, data) => {
               if (err) throw err;
               res.send('File uploaded!');
               });
         })
       });
   });
   app.route("/learn").get((req, res) => {
    res.sendFile(__dirname + '/public/learn.html');
   }).post((req, res) => {
      if (req.body.t == "video")
      {
         types = "('.mp4', '.mkv', '.mov', '.webm', '.wmv')";
      }
      else if (req.body.t == "pic")
      {
         types = "('.jpg ', '.jpeg' , '.jfif' , '.pjpeg' , '.pjp', '.png', '.webp')";
      }
      else{
         types = `('${req.body.t}')`;
      }
      if (req.body.q == "")
      {
         if (req.body.t == "")
         {
            con1.query(`SELECT * FROM elearning ORDER BY Date DESC`, (err, data) => {
                  if (err) throw err;
                  res.json({data : data});
               });
         }
         else
         {
            con1.query(`SELECT * FROM elearning WHERE Type IN ${types} ORDER BY Date DESC`, (err, data) => {
               if (err) throw err;
               res.json({data : data});
            });
         }
      }
      else{
         if (req.body.t == "")
         {
            con1.query(`SELECT * FROM elearning WHERE Title LIKE '%${req.body.q}%' OR Description LIKE '%${req.body.q}%' ORDER BY Date DESC`, (err, data) => {
               if (err) throw err;
               res.json({data : data});
            });
         } 
         else{
            con1.query(`SELECT * FROM elearning WHERE (Title LIKE '%${req.body.q}%' OR Description LIKE '%${req.body.q}%') AND (Type IN ${types}) ORDER BY Date DESC`, (err, data) => {
               if (err) throw err;
               res.json({data : data});
            });
         }
      }
   })
}