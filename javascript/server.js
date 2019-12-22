const express = require('express')
const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).json({
      msg : 'Server started!'
    });
});

app.get('/video', function(req, res) {
  const clip = req.query.play;
  const path = 'assets/clips/' + clip + ".mp4";
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  }
  else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});

app.get('/gallery', function(req, res) {
    const path = 'assets/clips/';
    fs.readdir(path, (err, files) => {
        if(err){
            console.log(err);
            res.status(300).json({
                msg : "No clips found!"
            });
        }
        else{
            console.log("Clip list sent");
            res.status(200).json(files);
        }
    });
});

app.listen(3000, () => console.log(`Listening to port 3000!`))
