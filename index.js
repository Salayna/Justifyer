const express = require('express');
const bodyParser = require('body-parser');
const application = require('./src/utils').usageManagement;
const schedule = require('node-schedule');
const fsExtra = require('fs-extra');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome Stranger');
})
  .post('/api/token', async (req, res) => {
    const mail = req.body.email;
    await application.createToken(mail)
      .then((data) => {
        res.send({
          token: data,
        });
      })
      .catch((e) => {
        console.error(e);
      });
  })
  .post('/api/justify', async (req, res) => {
    await application.justifyText(req.headers.authorization, req.body.text)
      .then((response) => {
        if (response.statusCode === 200) {
          res.status(200);
          res.setHeader('Content-Type', 'text/plain');
          res.send(response.text);
        } else {
          res.status(response.statusCode);
          res.setHeader('Content-Type', 'application/json');
          res.send({
            message: response.message,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
app.listen(PORT, () => {
  const s = schedule.scheduleJob('0 0 * * *', () => {
    fsExtra.emptyDirSync(`${__dirname}/data`);
  });
  console.log(`🚀 App running on ${PORT}`);
});
