const serverless = require("serverless-http");
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");
const { getSecret } = require("./aws-secrets");

app.use(bodyParser.json());
app.use(cors());

app.use(async (req, res, next) => {
  const apiKey = await getSecret();
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  openai = new OpenAIApi(configuration);
  next();
});
  
app.post('/chat', async(req, res) => {
  const { message } = req.body;
  const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${message}`,
      max_tokens: 100,
      temperature: 0.5,
    });
  res.status(200).json({message:response.data.choices[0].text})
})

app.post('/chat3', async(req, res) => {
  const messages = req.body;
  console.log(messages);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  res.status(200).json({message:completion.data.choices[0].message});
})

module.exports.handler = serverless(app);