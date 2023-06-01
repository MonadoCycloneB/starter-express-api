// when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission
    document.getElementById('video-form').addEventListener('submit', async (event) => {
        // Prevent the form from reloading the page
        event.preventDefault();
      
        // Get the uploaded image and YouTube link from the form
        const image = document.getElementById('image-upload').files[0];
        const youtubeLink = document.getElementById('youtube-link').value;
        const startTime = document.getElementById('start-time').value;
      
        // Validate the form input
        if (!image || !youtubeLink || !startTime) {
          alert('Please fill in all fields');
          return;
        }
      
        // Disable the form while the video is being generated
        document.getElementById('video-form').disabled = true;
      
        // Generate the video
        const video = await fetch('/upload', {
          method: 'POST',
          body: new FormData(document.getElementById('video-form')),
        }).then((response) => response.body);
      
        // Enable the form again
        document.getElementById('video-form').disabled = false;
    
        // Go to /download
        window.location.href = "/download";
      });
    });