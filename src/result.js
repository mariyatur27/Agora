// getting the artist
window.onload = () => {
    fetch('/artist', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: ''
    }).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    }).then(artist => {
        
        document.getElementById('output-artist').innerHTML = artist;
        loadSpotify(artist);

    }).catch(error => {
        console.error(error)
    })  
}


const hash = window.location.hash
let token = window.localStorage.getItem("token")

// getting Spotify token
if (hash && hash) {
    token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
    window.location.hush = "";
    window.localStorage.setItem("token", token)
}

const loadSpotify = (artist) => {
    data = {
        artist: artist,
        token: token
    }
    fetch('/find', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    }).then(tracks => {
        try {
            formatOutput(tracks)
        }catch(err){
            console.log(err)
        }
    }).catch(error => {
        console.error(error)
    })   
}

var audioUrls = [];

// Formatting the recommended tracks in HTML
const formatOutput = (tracks) => {
    let container = document.getElementById('output');

    for(track of tracks){
        audioUrls.push(track.preview_url)

        let track_box = document.createElement('div'); track_box.id = track.id; track_box.classList.add('track-box');
        track_box.setAttribute('mp3', track.preview_url)

            let img_cont = document.createElement('div'); img_cont.classList.add('img-cont');
                let img = document.createElement('img'); img.src = track.album.images[0].url;
                img_cont.appendChild(img)
            track_box.appendChild(img_cont);

            let text_cont = document.createElement('div'); text_cont.classList.add('text-cont');
                let song = document.createElement('h2'); song.innerHTML = track.name;
                text_cont.appendChild(song);

                let album = document.createElement('h4'); album.innerHTML = "Album - " + track.album.name;
                text_cont.appendChild(album);

                let play = document.createElement('a'); play.innerHTML = 'Play Now'; play.href = track.external_urls.spotify;
                play.setAttribute('target', '_blank');
                text_cont.appendChild(play);
            track_box.appendChild(text_cont);

        container.appendChild(track_box);

        setUpTracks(track.preview_url, track.id);
    }
}

// clicking on the boxes to play audio tracks
// const setUpTracks = (track, id) => {
//     document.getElementById(id).addEventListener('click', () => {
//         playSnippet(track)
//     })
// }

// const playSnippet = async(url) => {

//     const audio_array = audioUrls.map(n => new Audio(n));
//     console.log(audio_array)

//     try{

//         for(const audio of audio_array){
//             await audio.pause();
//             activateSnippet(url);
//             // audio.currentTime = 0;
//         }

//         // let active_audio = new Audio(url);
//         // await active_audio.play();

//     }catch(err){
//         console.log(err)
//     }
// }

// const activateSnippet = async(url) => {

//     let active_audio = new Audio(url);
//     await active_audio.play();

// }