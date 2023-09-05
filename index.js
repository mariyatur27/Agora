const PORT = 3000;
const express = require('express')
const cors = require('cors')
const cohere = require('cohere-ai')
const axios = require('axios')
const app = express()
const fs = require('fs')

app.use(cors())
app.use('/static', express.static('src')); 
app.use(express.json());

require('dotenv').config();
cohere.init(process.env.COHERE_API_KEY);

var data = fs.readFileSync('spotify_data.json');
var synonyms = JSON.parse(data)


app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname})
})

app.get('/result', (req, res) => {
    res.sendFile('result.html', {root: __dirname})
})

app.post('/analyse', async(req, res) => {
    try {

        const text = req.body.text

        const apiKey = process.env.API_LAYER_API_KEY;
        const url = "https://api.apilayer.com/text_to_emotion"

        const response = await axios.post(url, {text: text}, {
            headers: {
                'Content-Type': 'application/json',
                apiKey: apiKey,
            },
        })

        const result = response.data;
        res.json(result)

    }catch(err){
        console.log(err)
    }
})

var suggestion;

app.post('/data', (req, res) => {

    fs.readFile("spotify_data.json", "utf8", (err, jsonString) => {
        if(err){
            console.log(err);
            return;
        }
        try{

            var options = JSON.parse(jsonString)

            var prompt = "Recommend a ".concat(options[req.body.emotion]).concat(" music artist that can be found on spotify. Only type the name of the music artist below and nothing else.");

            (async () => {
                const response = await cohere.generate({
                  model: 'command',
                  prompt: prompt,
                  max_tokens: 300,
                  temperature: 0.9,
                  k: 0,
                  stop_sequences: [],
                  return_likelihoods: 'NONE'
                });
    
                try {
                    suggestion = response.body.generations[0].text
                    res.json(suggestion)
                }catch(err){
                    console.log(err)
                }
              })();    

        }catch(err){
            console.log(err)
        }
    })
})

app.post('/artist', (req, res) => {
    try {
        res.json(suggestion)
    }catch(err){
        console.log(err)
    }
})

app.post('/auth', (req, res) => {
    try {
        var url = process.env.REACT_APP_AUTHORIZE_URL.concat('?client_id=').concat(process.env.REACT_APP_CLIENT_ID).concat('&redirect_uri=').concat(process.env.REACT_APP_REDIRECT_URL).concat('&response_type=token&show_dialog=true');
        res.json(url)
    }catch(err){
        console.log(err)
    }
})

app.post('/find', async(req, res) => {

    var artist = req.body.artist
    var token = req.body.token
    var auth = "Bearer ".concat(token)

    const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
        },
        params: {
            q: artist,
            type: 'artist'
        }
    })

    try {
        var artistID = response.data.artists.items[0].id;
        var url = "https://api.spotify.com/v1/artists/".concat(artistID).concat("/top-tracks");

        var artistTrakcs = await axios.get(url, {
            headers: {
                "Authorization": auth
            },
            params: {
                limit: 3,
                market: 'US'
            }
        })

        try{
            res.json(artistTrakcs.data.tracks)
        }catch(err){
            console.log(err)
        }

    }catch(err){
        console.log(err)
    }

})


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))