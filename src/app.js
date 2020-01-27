const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

console.log(__dirname)
console.log(path.join(__dirname,'../public'))

const app = express()

const port = process.env.PORT || 3000

// define express paths
const publicDirectory = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

// setup handlebars config
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

// static directory to serve
app.use(express.static(publicDirectory))


app.get('', (req, res) => {
    res.render('index', {
        title: 'Wheater',
        name: 'My name'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'AboutPage',
        forecast: 'fc',
        location: 'loc',
        name: 'Me'
    })
})

app.get('/help', (req, res) => {
    res.render('help',{
        title: 'help page',
        content: 'help content',
        name: 'Me again'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Please send an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })    
})



app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'send search please'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    });
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help article not found.',
        title: 'Error page',
        name: 'Julian'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'Page not found',
        title: 'Error page 2',
        name: 'Rasmussen'
    })
});

app.listen(port, () => {
    console.log('server up on', port)
})