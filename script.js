// console.log("Testing in console.");
let currentSong = new Audio();


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
const playMusic = (track)=>{
    currentSong.src = "/songs/"+ track; // find the song source file
    currentSong.play(); // plays the music
    play.src = "pause.svg"; // play.src = "pause.svg" when a new song clicked

    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {

    

    // get the songs list from directory
    let songs = await getSongs();

    

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
            console.clear();
            console.log("changed to PLAY btn.");
        }
        else{
            currentSong.pause();
            play.src = "play.svg";
            console.clear();
            console.log("changed to PAUSE btn.");
        }
    })


    

}

main();