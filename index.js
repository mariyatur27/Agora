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
        console.log(result)

        res.json(result)

    }catch(err){
        console.log(err)
    }
})


app.post('/data', (req, res) => {

    fs.readFile("spotify_data.json", "utf8", (err, jsonString) => {
        if(err){
            console.log(err);
            return;
        }
        try{

            var options = JSON.parse(jsonString)
            console.log(options[req.body.emotion])

            var prompt = "Recommend a ".concat(options[req.body.emotion]).concat(" song that can be found on Spotify. Only output the song name.");

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
                    const suggestion = response.body.generations[0].text
                    console.log(suggestion)
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



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))