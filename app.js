const path = require('path')
const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const cors = require('cors')

const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const bookingRouter = require('./routes/bookingRoutes')
const bookingController = require('./controllers/bookingController')
const viewRouter = require('./routes/viewRoutes')

const app = express()

app.enable('trust proxy')

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// global Middlewares
// security http headers

// implement cors
app.use(cors())

app.options('*', cors())

// serving static files
app.use(
    express.static(path.join(__dirname, 'public'))
)
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [
                    "'self'",
                    'data:',
                    'blob:',
                    'https:',
                    'ws:',
                ],
                baseUri: ["'self'"],
                fontSrc: [
                    "'self'",
                    'https:',
                    'data:',
                ],
                scriptSrc: [
                    "'self'",
                    'https:',
                    'http:',
                    'blob:',
                    'https://*.mapbox.com',
                    'https://js.stripe.com',
                    'https://m.stripe.network',
                    'https://*.cloudflare.com',
                ],
                frameSrc: [
                    "'self'",
                    'https://js.stripe.com',
                ],
                objectSrc: ["'none'"],
                styleSrc: [
                    "'self'",
                    'https:',
                    "'unsafe-inline'",
                ],
                workerSrc: [
                    "'self'",
                    'data:',
                    'blob:',
                    'https://*.tiles.mapbox.com',
                    'https://api.mapbox.com',
                    'https://events.mapbox.com',
                    'https://m.stripe.network',
                ],
                childSrc: ["'self'", 'blob:'],
                imgSrc: [
                    "'self'",
                    'data:',
                    'blob:',
                ],
                formAction: ["'self'"],
                connectSrc: [
                    "'self'",
                    'data:',
                    'blob:',
                    'https://*.stripe.com',
                    'https://*.mapbox.com',
                    'https://*.cloudflare.com/',
                    'https://bundle.js:*',
                    'ws://127.0.0.1:*/',
                ],
            },
        },
    })
)

// development loggin
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// limit request from same api
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message:
        'Too many requests from this IP, please try again in an hour!',
})

app.use('/api', limiter)

app.post(
    '/webhook-checkout',
    express.raw({ type: 'application/json' }),
    bookingController.webhookCheckout
)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))
app.use(
    express.urlencoded({
        extended: true,
        limit: '10kb',
    })
)
app.use(cookieParser())

// data sanitization against NoSQL query injection
app.use(mongoSanitize())

// data sanitization against XSS
app.use(xss())

// prevent parametr polution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
)

app.use(compression())

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    // console.log(req.cookies)
    // console.log(req.headers)
    next()
})

// Routes
app.use('/', viewRouter)
app.use('/api/v1/tours/', tourRouter)
app.use('/api/v1/users/', userRouter)
app.use('/api/v1/reviews/', reviewRouter)
app.use('/api/v1/bookings/', bookingRouter)

app.all('*', (req, res, next) => {
    next(
        new AppError(
            `Can't find ${req.originalUrl} on this server!`,
            404
        )
    )
})

app.use(globalErrorHandler)

module.exports = app
