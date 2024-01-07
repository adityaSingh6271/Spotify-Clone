console.log("Let's Write some Javascript");

let songs = []; // Array to hold song URLs
let currentSongIndex = 0; // Index of the currently playing song

async function getSongs() {
  try {
    let response = await fetch("http://127.0.0.1:5500/songs/");
    let text = await response.text();

    let div = document.createElement("div");
    div.innerHTML = text;
    let as = div.getElementsByTagName("a");

    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
        songs.push(element.href);
      }
    }
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}

// Get card elements
let cardPlayButtons = document.querySelectorAll('.card .play img');

// Add event listeners to card play buttons
cardPlayButtons.forEach((playButton, index) => {
    playButton.addEventListener('click', () => {
        // Play the song associated with this card
        playSongAtIndex(index); // Call your playSongAtIndex function passing the index of this card
    });
});





// Helper functions
function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);
  if (remainingSeconds < 10) {
    remainingSeconds = `0${remainingSeconds}`;
  }
  return `${minutes}:${remainingSeconds}`;
}



// updateTime function
function updateTime() {
  let audio = document.getElementById("audioPlayer");
  let currentTime = formatTime(audio.currentTime);
  let duration = formatTime(audio.duration);

  let songTime = document.querySelector(".songtime");
  if (songTime) {
    if (!isNaN(audio.duration)) {
      songTime.textContent = `${currentTime} / ${duration}`;
    } else {
      songTime.textContent = `0:00 / 0:00`;
    }
  }
}



function playSongAtIndex(index) {
  let audio = document.getElementById("audioPlayer");
  audio.src = songs[index];
  audio.load();
  audio.play();

  // Get the songinfo and songtime divs
  let songInfo = document.querySelector(".songinfo");
  let songTime = document.querySelector(".songtime");

  // Update the songinfo div with the current song and the songtime div with its duration
  audio.addEventListener("loadeddata", () => {
    let decodedSong = decodeURIComponent(songs[index]).split("/songs/").pop();
    songInfo.textContent = ` ${decodedSong}`;
    if (!isNaN(audio.duration)) {
      let duration = formatTime(audio.duration);
      songTime.textContent = `0:00 / ${duration}`; // Initialize the time
    } else {
      songTime.textContent = 'Duration: Loading...';
    }

    // Update time during playback
    audio.addEventListener("timeupdate", updateTime);

    currentSongIndex = index;
  });
}




// Your existing JavaScript code...

let audioPlayer = document.getElementById("audioPlayer");

// Get the play, pause, and skip buttons
let playButton = document.querySelector(".songbuttons box-icon[name='play-circle']");
let pauseButton = document.querySelector(".songbuttons box-icon[name='pause']");
let prevButton = document.querySelector(".songbuttons box-icon[name='skip-previous']");
let nextButton = document.querySelector(".songbuttons box-icon[name='skip-next']");



pauseButton.style.display = 'none';

// Get the seek bar and circle
let seekBar = document.querySelector(".seekBar");
let circle = document.querySelector(".circle");

// Play or pause the song when the play button is clicked
playButton.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playButton.style.display = 'none'; // Hide the play button
    pauseButton.style.display = 'inline-block'; // Show the pause button
  }
});

// Pause the song and switch to the play button when the pause button is clicked
pauseButton.addEventListener("click", () => {
  if (!audioPlayer.paused) {
    audioPlayer.pause();
    pauseButton.style.display = 'none'; // Hide the pause button
    playButton.style.display = 'inline-block'; // Show the play button
  }
});

// Play the previous song when the prev button is clicked
function updatePlayPauseButtons() {
  if (audioPlayer.paused) {
    playButton.style.display = 'inline-block'; // Show the play button
    pauseButton.style.display = 'none'; // Hide the pause button
  } else {
    playButton.style.display = 'none'; // Hide the play button
    pauseButton.style.display = 'inline-block'; // Show the pause button
  }
}

// Play the previous song when the prev button is clicked
prevButton.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playSongAtIndex(currentSongIndex);
  updatePlayPauseButtons();
});

// Play the next song when the next button is clicked
nextButton.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSongAtIndex(currentSongIndex);
  updatePlayPauseButtons();
});


const volumeIcon = document.getElementById('volumeIcon');
const volumeSeekContainer = document.querySelector('.volumeSeekContainer');
const volumeSeek = document.getElementById('volumeSeek');
let hideVolumeTimeout; // Variable to store the timeout ID

// Function to show the volume seek bar
function showVolumeSeek() {
    volumeSeekContainer.style.display = 'block';
}

// Function to hide the volume seek bar after a delay
function hideVolumeSeek() {
    hideVolumeTimeout = setTimeout(() => {
        volumeSeekContainer.style.display = 'none';
    }, 3000); // Adjust the delay time (in milliseconds) as needed
}

// Event listener for when the cursor enters the volume icon
volumeIcon.addEventListener('mouseenter', () => {
    showVolumeSeek();
    clearTimeout(hideVolumeTimeout); // Clear any previous hideVolumeSeek timeout
});

// Event listener for when the cursor leaves the volume icon
volumeIcon.addEventListener('mouseleave', () => {
    hideVolumeSeek();
});

// Event listener for when the cursor enters the volume seek bar container
volumeSeekContainer.addEventListener('mouseenter', () => {
    clearTimeout(hideVolumeTimeout); // Clear the hideVolumeSeek timeout when seeking
});

// Event listener for when the cursor leaves the volume seek bar container
volumeSeekContainer.addEventListener('mouseleave', () => {
    hideVolumeSeek();
});

// Event listener for volume change (input) on the seek bar
volumeSeek.addEventListener('input', (e) => {
    const volumeValue = e.target.value / 100; // Normalize value between 0 and 1
    audioPlayer.volume = volumeValue; // Update the volume of your audio player
});

// Initially hide the volume seek bar
volumeSeekContainer.style.display = 'none';






// Update the position of the circle on the seek bar as the song plays
audioPlayer.addEventListener("timeupdate", () => {
  let fraction = audioPlayer.currentTime / audioPlayer.duration;
  circle.style.left = `${fraction * seekBar.offsetWidth}px`;
});

// Seek to a different part of the song when the seek bar is clicked
seekBar.addEventListener("click", (event) => {
  let fraction = event.offsetX / seekBar.offsetWidth;
  audioPlayer.currentTime = fraction * audioPlayer.duration;
});


//Add an eventListner for hamburger
document.getElementById("hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0"
});

//Add an eventListner for close/cross
document.getElementById("cross").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%";
 
});







// Your existing JavaScript code...


async function main() {
  try {
    await getSongs();

    let songUL = document.querySelector(".songList ul");
    songs.forEach((song, index) => {
      let decodedSong = decodeURIComponent(song).split("/songs/").pop();
      let li = document.createElement("li");
      li.innerHTML = `
        <img class="invert" src="music.svg" alt="music">
        <div class="info">${decodedSong}</div>
        <div class="playnow">
          <img class="invert playButton" src="circleplay.svg" alt="play">
          <span>Play Now</span>
        </div>`;
      songUL.appendChild(li);
    
      li.addEventListener("click", () => {
        playSongAtIndex(index);
        if (audioPlayer.paused) {
          playButton.style.display = 'inline-block'; // Show the play button
          pauseButton.style.display = 'none'; // Hide the pause button
        } else {
          playButton.style.display = 'none'; // Hide the play button
          pauseButton.style.display = 'inline-block'; // Show the pause button
        }
      });
    });
    

    // Play the first song if there's at least one song available
    if (songs.length > 0) {
      playSongAtIndex(0);
    }
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();
