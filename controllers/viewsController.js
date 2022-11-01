const Tour = require('../models/tourModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

exports.getOverview = catchAsync(
    async (req, res, next) => {
        // 1) get tour data from collection
        const tours = await Tour.find()

        // 2) build template
        // 3) render that template using tour data from 1)

        res.status(200).render('overview', {
            title: 'All tours',
            tours,
        })
    }
)

exports.getTour = catchAsync(
    async (req, res, next) => {
        const tour = await Tour.findOne({
            slug: req.params.slug,
        }).populate({
            path: 'reviews',
            fields: 'review rating user',
        })

        if (!tour) {
            return next(
                new AppError(
                    'There is no tour with that name.',
                    404
                )
            )
        }

        res.status(200).render('tour', {
            title: `${tour.name} Tour`,
            tour,
        })
    }
)

exports.getLogin = catchAsync(
    async (req, res) => {
        res.status(200)
            .set(
                'Content-Security-Policy',
                "connect-src 'self' https://cdnjs.cloudflare.com"
            )
            .render('login', {
                title: 'Log into your account',
            })
    }
)
