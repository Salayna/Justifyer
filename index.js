const express =  require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const justify = require('./justify');

const jwtSecret = process.env.SECRET || 'DoesTheGoldGoblinWorthMoreThanTheCopperDragon';
const app = express();
const PORT =  process.env.PORT || 8080;


app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome Stranger');
})
    .post('/api/token', (req, res) => {
        const mail = req.body.email;
        const token = jwt.sign(mail, jwtSecret, {
          expiresIn: '24h'
        });
        res.send({
          token: token,
        });
})
    .post('/api/justify', (req, res) => {
      res.setHeader('Content-Type', 'text/plain')
      res.send(
        justify.justify(req.body.text, 80));
      console.log(justify.countWords(req.body.text));
})


.listen(PORT, () => {
    console.log(`🚀 App running on ${PORT}`);
});