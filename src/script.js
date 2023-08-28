document.getElementById('text-extract').addEventListener('keydown', function(e) {
    if(e.keyCode === 13 || e.key === 'Enter'){

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
            console.log(emotion, score)

            identifyGenre(emotion, score)
        }catch(err){
            console.log(err)
        }

    }).catch(error => {
        console.error('Fetch error:', error)
    })
}

const identifyGenre = (emotion) => {
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
}