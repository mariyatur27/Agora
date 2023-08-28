const PORT = 3000;
const express = require('express')
const cors = require('cors')
const cohere = require('cohere-ai')
const axios = require('axios')
const app = express()

app.use(cors())
app.use('/static', express.static('src')); 
app.use(express.json());

require('dotenv').config();
cohere.init(process.env.COHERE_API_KEY);


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



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))