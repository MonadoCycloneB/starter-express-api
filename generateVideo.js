const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

function log(text) {  fs.appendFileSync('log.txt', `${text} ${new Date()}\n`); }


async function generateVideo(inputFile, youtubeLink, startTime) {
  if (fs.existsSync('video_edited.mp4')) { fs.unlinkSync('video_edited.mp4'); }
    try{
        log(youtubeLink);

        log(`Link Valid: ${ytdl.validateURL(youtubeLink)}`);

        // determine if inputFile is image or video
        const isImage = inputFile.mimetype.includes('image');
        const isVideo = inputFile.mimetype.includes('video');

        if (!isImage && !isVideo) {
          throw new Error('Invalid file type');
        }

        // If the files: video.mp4, audio.mp3 or video_edited.mp4 already exist, delete them
        if (fs.existsSync('video.mp4')) { fs.unlinkSync('video.mp4'); }
        if (fs.existsSync('audio.mp3')) { fs.unlinkSync('audio.mp3'); }
        if(fs.existsSync('image_video.mp4')){fs.unlinkSync('image_video.mp4');}
        if (fs.existsSync('video_edited.mp4')) { fs.unlinkSync('video_edited.mp4'); }
        console.log("U");
        
        
    await new Promise((resolve)=>{ytdl(youtubeLink, 
        {filter: 'audioonly', quality: 'highestaudio'}
        ).pipe(fs.createWriteStream('video.mp4')).on('finish', resolve);});
    
        // Save the image to file
      fs.writeFileSync(inputFile.originalname, inputFile.buffer);
      console.log("V");
      const audioFileName = "audio.mp3";
      await new Promise ((resolve)=>ffmpeg().input('video.mp4').inputOption('-ss', startTime) // Start at the specified time
      .inputOption('-t', '15').inputOption('-vn').output(audioFileName).on('end', () => {
        // Clean up the audio file
        fs.unlinkSync('video.mp4');
        resolve();

      }).run());
      console.log("W");

      let inputOptions = ['-t 15'];
      if(isImage){
        inputOptions.push('-loop 1');
      }

    // Combine the image and audio to create the video file
    const videoFilename = `video_edited.mp4`;
    await new Promise ((resolve)=>ffmpeg()
      .input(inputFile.originalname)
      .inputOptions(inputOptions)
      .output('image_video.mp4')
      .on('end', () => {
        // Clean up the image file
        fs.unlinkSync(inputFile.originalname);
        resolve();
      })
      .run());
      
      console.log("X");

      if (!fs.existsSync(videoFilename)) { 
        //Create the file
        fs.writeFileSync(videoFilename , '');
    }

      await new Promise ((resolve)=>ffmpeg()
      .input('image_video.mp4')
      .input(audioFileName)
      .videoCodec('copy')
    .outputOptions(['-map 0:v:0', '-map 1:a:0'])
      .outputOption('-shortest')
      .output(videoFilename)
      .on('end', () => { 
        // Clean up the audio file
        fs.unlinkSync(audioFileName);

        resolve(); })
      .run());
      
      console.log("Y");
  
    // Serve the video file to the user, create the file if doesn't exist

        // const videoStream = fs.createReadStream(videoFilename);
        // videoStream.on('close', () => {
        //   // Clean up the video file
        //   fs.unlinkSync(videoFilename);
        // });

    return videoStream;
  }catch(err){
    // Log the error to log.txt
    fs.appendFileSync('log.txt', `${err} ${new Date()}`);
  }}
  
  module.exports = generateVideo;
