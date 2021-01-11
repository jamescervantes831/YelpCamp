const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express()
const path = require('path')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) =>{
    res.render('mock')
})

app.listen(3000, () => {
    console.log('serving on port 3000')
})