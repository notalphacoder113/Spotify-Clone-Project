// console.log("Testing in console.");
let currentSong = new Audio();


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
async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    // store songs from folder directory
    let songs = []; 
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // console.log(index + " r->" + element);
            // %20-% // %20-%20 // %5Csongs%5C // songs%5C103% // take the second part of split
            songs.push(element.href.split("%5Csongs%5C")[1]); 
            // songs.push(element.outerText); // take only the filename as text - tried by zulkar-jahin
        }
    }
    // console.log(songs);
    return songs;
}


// play one music track at a time when clicked. 
const playMusic = (track, pause=false )=>{
    currentSong.src = "/songs/"+ track; // find the song source file
    if(!pause){
        currentSong.play();
        play.src = "pause.svg"; // play.src = "pause.svg" when a new song clicked
    }
    // currentSong.play(); // plays the music

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {
    // get the songs list from directory
    let songs = await getSongs();

    playMusic(songs[0], true); // by default get ready to playy the first song of the playlist

    

    // show all the songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Mishary alafsy</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="play">
                            </div>
                            </li>`;
    }


    // Attach an event listener to each song 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim()); // trimed the whitespace from beginning
        })
    })

    // Attach event listener for play, previous and next buttons
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg";
        }
        else{
            currentSong.pause();
            play.src = "play.svg";
        }
    })


    // Task 1 : shows currentTime/duration of current playing song.
    // Task 2 : seekbar moves while playing a song.
    // Listen for timeupdate event.
    currentSong.addEventListener("timeupdate", ()=>{
        console.log(currentSong.currentTime, currentSong.duration);
        
        // Task 1
        document.querySelector(".songtime").innerHTML = (`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`); 

        // Task 2
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration) * 100 + "%";
    })


    // Add event listener to seekbar for going to a specific time
    document.querySelector(".seekbar").addEventListener("click", e=> {
        let percent = ( e.offsetX / e.target.getBoundingClientRect().width ) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ( currentSong.duration * percent ) / 100 ;
    })

    // Add event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    })
    // Add event listener for close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%";
    })


    

}

main();