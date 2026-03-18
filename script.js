console.log("Testing in console.");

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = []; // store songs from folder directory
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // console.log(index + " " + element);
            songs.push(element.href.split("%20-%20")[1]); // %20-% // songs%5C103% // take the second part of split
            // songs.push(element.outerText); // take only the filename as text
        }
    }
    // console.log(songs);
    return songs;
}

async function main() {
    // get the songs list from directory
    let songs = await getSongs();
    console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        console.log(song)
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


    // play the song
    var audio = new Audio(songs[0]);
    // audio.play();

    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
        // The duration variable now holds the duration (in seconds) if the audio clip
    });

}

main();