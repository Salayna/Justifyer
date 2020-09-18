const express =  require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT =  process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Welcome Stranger');
})
app.post('/api/justify', (req, res) => {

})
.listen(PORT, () => {
    console.log(`🚀 App running on ${PORT}`);
});