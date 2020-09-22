const jwt = require('jsonwebtoken');
const storage = require('node-persist');
const justify = require('./justify');

const jwtSecret = process.env.SECRET || 'DoesTheGoldGoblinWorthMoreThanTheCopperDragon';

class UsageManagement {
  constructor() {
    try {
      storage.init({
        dir: `${__dirname}/data`,
        stringify: JSON.stringify,
        parse: JSON.parse,
        encoding: 'utf8',
        ttl: false,
        expiredInterval: 2 * 60 * 1000,
        forgiveParseErrors: false,
      });
    } catch (e) {
      console.error(e);
    }
    this.createToken = this.createToken.bind(this);
    this.justifyText = this.justifyText.bind(this);
  }

  async createToken(data) {
    const token = jwt.sign(data, jwtSecret);
    await storage.setItem(data, 0)
      .then((datas) => {
        console.log(datas);
      })
      .catch((err) => {
        console.error(err);
      });
    return token;
  }

  async justifyText(token, text) {
    let newValue = 0;
    const mail = jwt.verify(token, jwtSecret);
    await storage.get(mail)
      .then((data) => {
        newValue = data + justify.countWords(text);
      })
      .catch((error) => {
        console.log(error);
      });
    if (newValue <= 80000) {
      return {
        statusCode: 200,
        text: justify.justify(text, 80),
      };
    } if (newValue >= 80000) {
      return {
        statusCode: 403,
        message: 'Payment Required',
      };
    }
  }
}

exports.usageManagement = new UsageManagement();
