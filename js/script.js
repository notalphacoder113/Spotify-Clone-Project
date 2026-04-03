let currentSong = new Audio();
let songs;
let currFolder;
let songURLs;
let folder_size = 0;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Add leading zero if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

//retreive songs from folders
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);

    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    // store songs from folder directory
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let songURL = element.getAttribute("href");
            let decodedURL = decodeURIComponent(songURL);
            let songName = element.textContent;
            songs.push(decodedURL);
        }
    }
    folder_size = songs.length;

    // show all the songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""; // for clicking new playlists
    //showing all the songs name in leftside list
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                                <img class="invert" src="img/music.svg" alt="music">
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ").split("\\")[3]}</div> 
                                    <div>Mishary Alafsy</div>
                                </div>
                                <div class="playnow">
                                    <span>Play Now</span> 
                                    <img class="invert" src="img/play.svg" alt="play">
                                </div>
                                </li>`;
    }

    // Attach an event listener to each songs in list
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            let s_name = e.querySelector(".info").firstElementChild.innerHTML;
            for (let i = 0; i < folder_size; i++) {
                const song_to_play = songs[i];
                if (song_to_play.endsWith(s_name)) {
                    playMusic(song_to_play);
                }
            }
        })
    })

    return songs;
}


// play music function
const playMusic = (track, pause = false) => {
    currentSong.src = track; // source of current song to play
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    // showing the information in seekbar
    let s_name = track.trim().split("\\")[3];
    document.querySelector(".songinfo").innerHTML = s_name;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}


// load all folders in card section
async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;

    // anchors = get the folder name  
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        let s_url = decodeURIComponent(e.href).replaceAll("\\", "/");
        
        if (s_url.includes("/songs")) {
            let folder_name = s_url.split("/").at(-2); // get folder name 
            // Get the metadata of the folder 
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder_name}/info.json`);
            let response = await a.json();

            // load all folders 
            cardContainer.innerHTML = cardContainer.innerHTML +
                `<div data-folder="${folder_name}" class="card">
                    <div class="play">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                    stroke-linejoin="round" />
                        </svg>
                    </div>
                    <img src="songs/${folder_name}/cover.jpg" alt="">
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>
            </div>`
        }
    }

    // Load the playlist whenever card is clicked 
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0]); // play first music when playlist clicked 
        })
    });

}


async function main() {
    // get the songs list from directory
    await getSongs("songs/Quran Tilawat"); // by default

    // display all the albums in the page 
    displayAlbums();

    playMusic(songs[0], true); // by default play the first song of the playlist


    // event listener for play/pause button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    })


    // Task 1 : shows currentTime/duration of current playing song.
    // Task 2 : seekbar moves while playing a song.
    // Listener for timeupdate event.
    currentSong.addEventListener("timeupdate", () => {
        // Task 1
        document.querySelector(".songtime").innerHTML = (`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`);
        // Task 2
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })


    // Add event listener to seekbar for going to a specific time
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    // Add event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    // Add event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })


    // Event listener for previous
    previous.addEventListener("click", () => {
        let decoded_src = decodeURIComponent(currentSong.src);
        let find_current_song = decoded_src.split(`${currFolder}/`)[1];

        for (let i = 0; i < songs.length; i++) {
            const e = songs[i];
            if (e.endsWith(find_current_song)) {
                if (i - 1 >= 0) {
                    playMusic(songs[i - 1]); // plays the previous song
                    return;
                }
                else {
                    playMusic(songs[i]);  // play current song again
                }
            }
        }

    })

    // Event listener for next
    next.addEventListener("click", () => {
        let decoded_src = decodeURIComponent(currentSong.src);
        let find_current_song = decoded_src.split(`${currFolder}/`)[1];

        for (let i = 0; i < songs.length; i++) {
            const e = songs[i];
            if (e.endsWith(find_current_song)) {
                if (i + 1 < songs.length) {
                    playMusic(songs[i + 1]); // plays the next song
                    return;
                }
                else {
                    playMusic(songs[i]); // play current song again
                }
            }
        }

    })


    // Add event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if(currentSong.volume>0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    })

    // Add event listener for mute the track 
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg" );
            currentSong.volume = 0.3;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
        }
    })

}

main();