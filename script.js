console.log("lets write javascript");
let currentSong=new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder){
    console.log("getsongs")
    currFolder=folder;
    let a= await fetch(`/spotify_clone/songs/${folder}`)
    let response=await a.text();
    console.log(response);
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
    
    songs=[]
    for(let index=0;index<as.length;index++){
        const element=as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/spotify_clone/songs/${folder}`)[1])
            
        }
    }
    console.log(songs)
    
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML="";
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML +`<li><img class="invert" width="34" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song}</div>
                                <div>Harry</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;
        
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    
    });
   
    console.log(songs)
    return songs;

}
// const playMusic = (track, pause = false) => {
//     currentSong.src = `/${currFolder}/` + track
//     if (!pause) {
//         currentSong.play()
//         play.src = "img/pause.svg"
//     }
//     document.querySelector(".songinfo").innerHTML = decodeURI(track)
//     document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


// }
const playMusic = (track,pause=false) => {
    
    
    
    currentSong.src = `/spotify_clone/songs/${currFolder}`+ track
    
    if(!pause){
        currentSong.play();
        play.src="img/pause.svg";
    }
    
    
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"
}

async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/spotify_clone/songs/`)
   
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("spotify_clone/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            
            
            // Get the metadata of the folder
            let a = await fetch(`songs/${folder}/info.json/`)
            console.log(folder);
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/spotify_clone/songs/${folder}/cover.jpeg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }


    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset.folder)
            songs = await getSongs(`${item.currentTarget.dataset.folder}`) 
          
            playMusic(songs[0])

        })
    })
    



    play.addEventListener("click", () => {
        console.log(currentSong.paused)
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
        console.log(currentSong.paused)
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
    
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(index)
        if(index==-1){
            index = songs.indexOf(`/${currentSong.src.split("/").slice(-1)[0]}`)
            console.log(index)
        }
        
        
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }else{
            playMusic(songs[0])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")
        let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        console.log(index)
        if(index==-1){
            index = songs.indexOf(`/${currentSong.src.split("/").slice(-1)[0]}`)
            console.log(index)
        }
        
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
        else{
            playMusic(songs[0])
        }
    })

    
  
    console.log(document.querySelector(".range").getElementsByTagName("input")[0])
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })


}

async function main(){
        
    await getSongs("rockstar/")
    console.log(songs[0])
    playMusic(songs[0],true)

    displayAlbums()

  

}

main();


