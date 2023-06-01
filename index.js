const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ytdl = require('ytdl-core');

const generateVideo = require('./generateVideo');
const { Console } = require('console');

const app = express();

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve the index page
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '', 'index.html')); });

// Handle file uploads
app.post('/upload', upload.single('image'), async (req, res) => {
  // Get the uploaded image and YouTube link from the request
  const image = req.file;
  const youtubeLink = req.body.youtubeLink;
  const startTime = req.body.startTime;

  
  if (fs.existsSync('video_edited.mp4')) { fs.unlinkSync('video_edited.mp4'); }

  // Validate the form input
  if (!image || !youtubeLink || !startTime) {
    res.status(400).send('Please fill in all fields');
    return;
  }

  // Generate the video
  const video = await generateVideo(image, youtubeLink, startTime);

  // Set the response headers
  res.setHeader('Content-disposition', `attachment; filename=${image.originalname}`);
  res.setHeader('Content-type', 'video/mp4');

  res.download("video_edited.mp4")
});

app.get('/download',(req,res)=>{
    // A string that encodes date and time with just numbers
    var name = new Date().toISOString().replace(/:/g, '-');
    res.setHeader('Content-disposition', `attachment; filename=${name}.mp4`);
    res.setHeader('Content-type', 'video/mp4'); 

    res.download("video_edited.mp4")
});

// Q: what does res.send() do?
// A: https://expressjs.com/en/api.html#res.send

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
