const wrapper = document.querySelector(".wrapper"),
body = document.body,
img = wrapper.querySelector(".image img"),
mName = wrapper.querySelector(".detail .info .name"),
mArtist = wrapper.querySelector(".detail .info .artist"),
currentAudio = wrapper.querySelector("#current-audio"),
songsList = wrapper.querySelector(".songs-list"),
listBtn = wrapper.querySelector("#list"),
closeBtn = wrapper.querySelector("#close"),
volumeBtn = wrapper.querySelector("#volume"),
pauseBtn = wrapper.querySelector("#pause"),
previousBtn = wrapper.querySelector("#previous"),
nextBtn = wrapper.querySelector("#next"),
progress = wrapper.querySelector(".progress"),
progressBar = wrapper.querySelector(".progress .bar");

// list of songs and img saved at local
let songs = [
    {
        name: "Moonlight",
        artisit: "XXXTENTACION",
        img: "image_1",
        src: "music_1",
    },
    {
        name: "Take My Breath",
        artisit: "The Weekend",
        img: "image_2",
        src: "music_2",
    },
    {
        name: "Stay",
        artisit: "The Kid Laroi ft. Justin Bieber",
        img: "image_3",
        src: "music_3",
    },
    {
        name: "Lucid Dreams",
        artisit: "Juice WRLD",
        img: "image_4",
        src: "music_4",
    },
    {
        name: "Rockstar",
        artisit: "Post Malone ft. 21 Savage",
        img: "image_5",
        src: "music_5",
    },
    {
        name: "i n t e r l u de",
        artisit: "J. Cole",
        img: "image_6",
        src: "music_6",
    },


]

let bg = ["#ff74a4", "#ff4545", "#f8ded3", "#ffc382", "#f5eda6", "#ffcbdc", "#dcf3f3", "#b4ded5", "#cbf0af", "#9f6ea3"];

// index indicator for current song in the songs list
let idx = 0;

// player initialization, load the first song
window.addEventListener("load", ()=>{
    load(idx);
    playingNow();
});

// load the song details
function load(idx){
    mName.innerText = songs[idx].name;
    mArtist.innerText = songs[idx].artisit;
    img.src = `images/${songs[idx].img}.jpg`;
    currentAudio.src = `songs/${songs[idx].src}.mp3`;
    changeBg();
};

// play music function
function play() {
    wrapper.classList.add("paused")
    pauseBtn.innerText = "pause"
    currentAudio.play()
    playingNow();
};

// pause music function
function pause() {
    wrapper.classList.remove("paused")
    pauseBtn.innerText = "play_arrow"
    currentAudio.pause()
};


// listener on the pause button
// if is playing, then pause
// else play/continue
pauseBtn.addEventListener("click", ()=>{
    const isPaused = wrapper.classList.contains("paused");
    isPaused ? pause() : play();
});

// switch to previous music function
function previous() {
    idx == 0 ? idx = songs.length-1 : idx = --idx;
    load(idx);
    play();
};

// listener on the previous button
previousBtn.addEventListener("click", ()=>{
    previous()
    changeBg();
});


// switch to next music function
function next() {
    idx == songs.length-1 ? idx = 0 : idx = ++idx;
    load(idx);
    play();
};

// listener on the next button
nextBtn.addEventListener("click", ()=>{
    next();
    changeBg();
});

// update the progress bar according to the song duration
currentAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let barWidth = (currentTime/duration) *100;
    progressBar.style.width = `${barWidth}%`

    let _currentTime = wrapper.querySelector(".timer .current")
    let _duration = wrapper.querySelector(".timer .duration")

    // update the timer according to the song duration
    currentAudio.addEventListener("loadeddata", ()=>{
        
        let songDuration = currentAudio.duration;
        let minutes = Math.floor(songDuration/60);
        let seconds = Math.floor(songDuration%60);
        seconds = seconds < 10 ? `0${seconds}` : seconds
        _duration.innerText = `${minutes}:${seconds}`;

    })

    let currentMinutes = Math.floor(currentTime/60);
    let currentSeconds = Math.floor(currentTime%60);
    currentSeconds = currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds
    _currentTime.innerText = `${currentMinutes}:${currentSeconds}`;
});

// switch to next if current song is end
currentAudio.addEventListener("ended", ()=>{
    next()
})


// click the bar to change the time of the song
progress.addEventListener("click", (e)=>{
    let width = progress.clientWidth;
    let offset = e.offsetX
    let duration = currentAudio.duration;

    currentAudio.currentTime = (offset/width)*duration
    play()
})

// click to show the songs list
listBtn.addEventListener("click", ()=>{
    songsList.classList.toggle("show");
})

// click to hide the songs list
closeBtn.addEventListener("click", ()=>{
    listBtn.click();
})

// mute function
function mute(){
    wrapper.classList.add("muted")
    volumeBtn.innerText = "volume_off"
    currentAudio.volume = 0
}

// unmute function
function unmute(){
    wrapper.classList.remove("muted")
    volumeBtn.innerText = "volume_up"
    currentAudio.volume = 0.7
}

// listener on the mute button, change the volume of audio to mute or unmute
volumeBtn.addEventListener("click", ()=>{
    const isMuted = wrapper.classList.contains("muted");
    isMuted ? unmute() : mute();
})

const ulTag = wrapper.querySelector("ul");

// add the songs as li tag into the ul
for (let i=0; i<songs.length; i++){
    let liTag = 
    `<li li-index="${i}">
        <div class="item">
            <span>${songs[i].name}</span>
            <p>${songs[i].artisit}</p>
        </div>
        <audio class="${songs[i].src}" src="/songs/${songs[i].src}.mp3"></audio>
        <span id="${songs[i].src}" class="duration"></span>
    </li>`
    ulTag.insertAdjacentHTML("beforeend", liTag)

    let audioTag = ulTag.querySelector(`.${songs[i].src}`);
    let duration = ulTag.querySelector(`#${songs[i].src}`)

    audioTag.addEventListener("loadeddata", ()=>{
        let songDuration = audioTag.duration;
        let minutes = Math.floor(songDuration/60);
        let seconds = Math.floor(songDuration%60);
        seconds = seconds < 10 ? `0${seconds}` : seconds
        duration.innerText = `${minutes}:${seconds}`;
        duration.setAttribute("duration_", `${minutes}:${seconds}`)
    })
}

const songsTags = ulTag.querySelectorAll("li");

// identifying the currently playing song, and change relative attributes
function playingNow(){
    for(let j=0; j<songsTags.length; j++) {
        let audioTag = songsTags[j].querySelector(".duration");

        if(songsTags[j].classList.contains("playing")){
            songsTags[j].classList.remove("playing")
            audioTag.innerText = audioTag.getAttribute("duration_")
        }

        if (songsTags[j].getAttribute("li-index") == idx) {
            songsTags[j].classList.add("playing");
            audioTag.innerText = "Playing"
        }
        songsTags[j].setAttribute("onclick", "clicked(this)");
    }
}

// li tag (song item in the ul list) click function
function clicked(element) {
    let clickedIdx = element.getAttribute("li-index");
    idx = clickedIdx;
    load(idx);
    play();
    playingNow();
}

// randomly change the background color and prime/base color when switch songs
function changeBg(){
    randprime= bg[Math.floor((Math.random() * bg.length))]
    randbase = bg[Math.floor((Math.random() * bg.length))]
    body.style.backgroundColor = randprime;
    document.documentElement.style.setProperty('--prime', randprime);
    document.documentElement.style.setProperty('--base', randbase);
}
