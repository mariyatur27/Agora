document.getElementById('text-extract').addEventListener('keydown', function(e) {
    if(e.keyCode === 13 || e.key === 'Enter'){

        document.getElementById('text-extract').disabled = true;

        var text = document.getElementById('text-extract').value;
        if (text != ''){
            processTextMood(text);
        }else{
            alert("Please type something before clicking 'Enter' !")
        }
    }
})

const processTextMood = (text) => {
    var data = {
        text: text
    }

    fetch('/analyse', {
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
    }).then(result => {

        try {
            var values = Object.values(result);
            let score = values[0];
            let greatest_ind = 0;

            for(var i = 1; i < values.length; i++){
                if (values[i] > score){
                    score = values[i]
                    greatest_ind = i;
                }
            }

            var emotion = Object.keys(result)[greatest_ind];
            console.log(emotion)

            suggestSong(emotion)
        }catch(err){
            console.log(err)
        }

    }).catch(error => {
        console.error('Fetch error:', error)
    })
}

const suggestSong = (emotion) => {
    var data = {
        emotion: emotion
    }

    fetch('/data', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(result => {
        try {
            
            if (document.getElementById('results').classList.contains('hide')){
                document.getElementById('results').classList.remove('hide');
            }
            document.getElementById('song-output').innerHTML = result;

            if (document.getElementById('regenerate-btn').classList.contains('hide')) {
                document.getElementById('regenerate-btn').classList.remove('hide');
            }

        }catch(err){
            console.log(err)
        }
    }).catch(error => {
        console.error(error)
    })       
}


// Spotify functionality

// Getting env data from backend and receiving a URL in return
document.getElementById('spotify-auth-btn').addEventListener('click', function() {
    fetch('/auth', {
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
    }).then(url => {
        try {
            window.location = url;
        }catch(err){
            console.log(err)
        }
    }).catch(error => {
        console.error(error)
    })   
})


// regenerate button

document.getElementById('regenerate-btn').addEventListener('click', function() {
    var text = document.getElementById('text-extract').value;
    if (text != ''){
        processTextMood(text);
    }else{
        alert("Please type something before clicking 'Enter' !")
    }
})