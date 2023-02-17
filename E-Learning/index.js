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
      if (!req.files || Object.keys(req.files).length === 0) {
         return res.status(400).send('No files were uploaded.');
       }
       sampleFile = req.files.sampleFile;
       let upath = uuidv4() + path.extname(sampleFile.name);
       uploadPath =  __dirname + '/uploads/' + upath;
       sampleFile.mv(uploadPath, function(err) {
         if (err){
           return res.status(500).send(err);
         }
         con1.query(`INSERT INTO elearning(Title,Link,Description,School_Id,Type) VALUES('${escape(req.body.title)}', '${upath}' ,'${escape(req.body.desc)}', '${decrypt(req.body.id)}', '${path.extname(sampleFile.name)}')`, (err, data) => {
          if (err) throw err;
          res.send('File uploaded!');
          });
       });
   });
   app.route("/learn").get((req, res) => {
    res.sendFile(__dirname + '/public/learn.html');
   }).post((req, res) => {
      if (req.body.q == "")
      {
         con1.query(`SELECT * FROM elearning`, (err, data) => {
               if (err) throw err;
               res.json({data : data});
            });
      }
   })
}