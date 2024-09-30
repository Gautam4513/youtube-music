
import Rythm from 'rythm.js'
const rythm = new Rythm();
let songArray=[];
const currentSong = new Audio;
rythm.connectExternalAudioElement(currentSong);
const seekBar = document.querySelector('.seek-bar');
let value = 0;
const volumeBtn = document.querySelector(".volume-img");
const volumeControl=document.querySelector("#volume-control");
let volumeLevel=volumeControl.value/100;
let currentSongIndex=0;
let songList=[];
rythm.addRythm('color2', 'color', 0, 10, {
    from: [0,0,255],
    to:[255,0,255]
})
rythm.addRythm('neon3', 'neon', 0, 10, {
    from: [255,255,0],
    to:[255,0,0]
});
rythm.addRythm('pulse3', 'pulse', 0, 10, {
    min: 1,
    max: 1.75
});
function removeActiveClassFromFoder(arr){
    arr.forEach(item=>{
        item.classList.remove('active');
    })
}
function removeActiveClass(){
    rythm.stop();
    songList.forEach(item=>{
        item.classList.remove("active");
        item.classList.remove('neon3');
    })
}
function playNext(){
    
    currentSong.pause();
    rythm.stop();
    removeActiveClass();
    currentSongIndex=(currentSongIndex+1)%songArray.length;
    let nextSong=(document.querySelector(`[data-key="${currentSongIndex}"]`));
    addSongTitle(nextSong.querySelector(".name").innerText);
    playSong(nextSong.getAttribute("href"));
    nextSong.classList.add("active");
    nextSong.classList.add("neon3");
    

}
function playPrev(){
    currentSong.pause();
    rythm.stop();
    removeActiveClass();
    if(currentSongIndex<=0){
        currentSongIndex = songArray.length-1;
    }else{
        currentSongIndex=(currentSongIndex-1)%songArray.length;
    } 
    let nextSong=(document.querySelector(`[data-key="${currentSongIndex}"]`));
    addSongTitle(nextSong.querySelector(".name").innerText);
    playSong(nextSong.getAttribute("href"));
    removeActiveClass();
    nextSong.classList.add("active");
    nextSong.classList.add("neon3");

}
function setVolumeControl(value){
    volumeControl.style.background = `linear-gradient(90deg, #ff0000 ${value}%, rgb(221, 221, 221) ${value}%)`;
}
function playSong(music) {
    currentSong.src = music;
    currentSong.play();
    rythm.start();
    document.querySelector(".play-song").classList.add("hidden");
    document.querySelector(".pause-song").classList.remove("hidden");
}
function setVolume(volumeValue){
    currentSong.volume=volumeValue;
}
function convertToMMSS(seconds) {
    if (isNaN(seconds)) {
        return "00:00";
    }
    seconds = Math.floor(seconds);
    // Calculate minutes
    let minutes = Math.floor(seconds / 60);

    // Calculate remaining seconds
    let remainingSeconds = seconds % 60;

    // Pad the minutes and seconds with leading zero if less than 10
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    remainingSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    // Return in MM:SS format
    return `${minutes}:${remainingSeconds}`;
}
function setSongTimer(current,total){
    document.querySelector(".time").innerText=`${convertToMMSS(current)}/${convertToMMSS(total)}`;
}
function runSeekBar() {
    currentSong.addEventListener("timeupdate", () => {
        if (!(isNaN(currentSong.duration))) {
            value = (currentSong.currentTime * 100) / currentSong.duration;
            seekBar.value = value*10;
            updateSeekBar();         
        }
        setSongTimer(currentSong.currentTime,currentSong.duration);
        if(currentSong.currentTime==currentSong.duration){
            playNext();
        }
    }
    )
}
function addSongTitle(title){
    document.querySelector(".sond-title").innerText=title;
}
function playAnimation() {
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("mouseover", () => {
            card.querySelector(".play-icon").style.transform = "translateY(0)";
            card.querySelector(".play-icon").style.opacity = "1";
        })
        card.addEventListener("mouseout", () => {
            card.querySelector(".play-icon").style.transform = "translateY(3.5rem)";
            card.querySelector(".play-icon").style.opacity = "0";
        })
    })
}
function manuToggle() {
    document.querySelector(".menu").classList.toggle("hidden");
    document.querySelector(".close").classList.toggle("hidden");
}
function sidebarToggle() {
    document.querySelector(".side-bar").classList.toggle("-translate-x-full");
}
function setFolder(data, img) {
    let sondCard = `
    <div data-card-name=${data.title} class="card bg-[#3e4d586b] w-56  mx-auto py-5 px-5 rounded-xl">
    <div class="img relative w-full h-44 mx-auto bg-green-700 rounded-xl ">
        <img class="rounded-xl w-full h-full object-cove " src=${img} alt="cover img">
        <div class="play-icon transition-all ease-in-out duration-500 absolute bottom-0 right-0  translate-y-14 opacity-0">
            <img class="w-10 h-10" src="./assets/play.svg" alt="play">
        </div>
    </div>
    <div class="discription mx-auto w-44 mt-2">
        <h1 class='name text-2xl font-bold'>${data.title}</h1>
        <p class='dic '>${data.discription}</p>
    </div>

</div>
`;
    document.querySelector(".cards-container").innerHTML += sondCard;
}
async function getFolderInfo(folder) {
    let title = folder.children[0].title;

    let details = await fetch(`http://127.0.0.1:5500/songs/${title}/info.json`);
    let data = await details.json();
    let img = `http://127.0.0.1:5500/songs/${title}/cover.jpg`;
    setFolder(data, img);
}
async function getFolder() {
    let res = await fetch("http://127.0.0.1:5500/songs/");
    let data = await res.text();
    const div = document.createElement("div");
    div.innerHTML = data;
    return (div.querySelectorAll("li"));
}
function setSongs(song, href,key) {
    let songCard = `<li data-key=${key} class="flex justify-between items-center p-3 text-white cursor-pointer bg-[#161414]  rounded-xl  border-white hover:shadow-[1px_1px_5px_#fff] m-3" href="${href}">
    <div class="music-img ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="35" height="35" color="#fff" fill="none">
            <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M10 15.5C10 16.3284 9.32843 17 8.5 17C7.67157 17 7 16.3284 7 15.5C7 14.6716 7.67157 14 8.5 14C9.32843 14 10 14.6716 10 15.5ZM10 15.5V11C10 10.1062 10 9.65932 10.2262 9.38299C10.4524 9.10667 10.9638 9.00361 11.9865 8.7975C13.8531 8.42135 15.3586 7.59867 16 7V13.5M16 13.75C16 14.4404 15.4404 15 14.75 15C14.0596 15 13.5 14.4404 13.5 13.75C13.5 13.0596 14.0596 12.5 14.75 12.5C15.4404 12.5 16 13.0596 16 13.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    </div>
    <div class="name  w-[60%] leading-6 whitespace-nowrap overflow-hidden">${song}</div>
    <div class="play-icon cursor-pointer ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="35" height="35" color="#fff" fill="none">
            <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
        </svg>
    </div>
</li>`;
    document.querySelector("ul").innerHTML += songCard;

}
function updateSeekBar() {
    seekBar.style.background = `linear-gradient(90deg, #ff0000 ${value-30}%, #ff00ea ${value}%, rgb(221, 221, 221) ${value}%)`;
}
function playPauseToggle() {
    if (currentSong.src === "") {
        toast("pleas select song");
    } else {
        try {
            if (currentSong.paused) {
                document.querySelector(".pause-song").classList.remove("hidden");
                document.querySelector(".play-song").classList.add("hidden");
                currentSong.play();
                rythm.start()
            }
            else {
                document.querySelector(".play-song").classList.remove("hidden");
                document.querySelector(".pause-song").classList.add("hidden");
                currentSong.pause();
                rythm.stop();
            }
        } catch (e) {
        }
    }


}
async function getSongs(folder) {
    let res = await fetch(`http://127.0.0.1:5500/songs/${folder}/`);
    let data = await res.text();
    const songDiv = document.createElement("div");
    songDiv.innerHTML = data;
    songArray = Array.from((songDiv.querySelectorAll(".icon-mp3")));
    document.querySelector("ul").innerHTML = "";
    
    for (let i = 0; i < songArray.length; i++) {
        setSongs(songArray[i].children[0].innerText, songArray[i].href ,i);
    }
    if (currentSong.src == "" || currentSong.paused) {
        currentSong.src = songArray[0].href;
        currentSongIndex=0;
        addSongTitle(songArray[0].children[0].innerText);
        setSongTimer(currentSong.currentTime,currentSong.duration);
        removeActiveClass();
        document.querySelector(`[data-key="0"]`).classList.add("active"); 
        document.querySelector(`[data-key="0"]`).classList.add("neon3");  
        runSeekBar();
    }
    setTitle(folder);
}
function setTitle(title) {
    document.querySelector(".folder-name").innerText = title;
}
function volumeBtnToggle(){
    if(currentSong.muted){
        currentSong.muted = false;
        setVolume(volumeLevel);
        volumeControl.value=volumeLevel*100;
        setVolumeControl(volumeControl.value);
        volumeBtn.querySelector(".volume-on").classList.remove("hidden");
        volumeBtn.querySelector(".volume-off").classList.add("hidden");
    }else{
        currentSong.muted = true;
        // setVolume(0);
        volumeControl.value=0;
        setVolumeControl(volumeControl.value);
        volumeBtn.querySelector(".volume-on").classList.add("hidden");
        volumeBtn.querySelector(".volume-off").classList.remove("hidden");
    }
}
async function main() {
    //logic for side-bar apearance and hambugur change
    document.querySelector(".menu-box").addEventListener("click", () => {
        manuToggle();
        sidebarToggle();

    });
    let folders = Array.from(await (getFolder())); //convar node list into array
    //get title of all songs
    document.querySelector(".cards-container").innerHTML = ""; //remove all folder
    for (let i = 1; i < folders.length; i++) {
        await getFolderInfo(folders[i]);
    }
    //logic for get song for particular folder;
    document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", async () => {
            await getSongs(card.getAttribute("data-card-name"));
            removeActiveClassFromFoder(document.querySelectorAll(".card"));
            card.classList.add("active");
            manuToggle();
            sidebarToggle();
            songList = document.querySelectorAll("li");
            
            songList.forEach(item => {
                item.addEventListener("click", () => {
                    removeActiveClass();
                    let link = item.getAttribute("href");
                    currentSongIndex=Number(item.getAttribute("data-key"));
                    currentSong.pause();
                    rythm.stop();
                    removeActiveClass();
                    playSong(link);
                    item.classList.add("active");
                    item.classList.add("neon3");
                    addSongTitle(item.querySelector(".name").innerText);
                })
            })
        })
    })


    document.querySelector(".play").addEventListener("click", () => {
        playPauseToggle();
    })

    seekBar.addEventListener("input", () => {
        if (currentSong.src == "") {
        }
        else {
            value = (seekBar.value - seekBar.min) / (seekBar.max - seekBar.min) * 100;
            currentSong.currentTime = (value * currentSong.duration) / 100;
            updateSeekBar();
        }

    });
    volumeBtn.addEventListener("click",()=>{
        volumeBtnToggle();
    });
    volumeControl.addEventListener("input",()=>{
        if(volumeControl.value==0){
            volumeBtn.querySelector(".volume-on").classList.add("hidden");
            volumeBtn.querySelector(".volume-off").classList.remove("hidden");
            currentSong.muted = true;
        }else{
            volumeBtn.querySelector(".volume-on").classList.remove("hidden");
            volumeBtn.querySelector(".volume-off").classList.add("hidden");
            currentSong.muted = false;
        }
        setVolumeControl(volumeControl.value);
        volumeLevel=volumeControl.value/100
        setVolume(volumeLevel);
    });
    document.querySelector(".next").addEventListener("click",()=>{
        playNext();
    });
    document.querySelector(".prev").addEventListener("click",()=>{
        playPrev();
    });
    updateSeekBar();
    playAnimation();
}
main();
