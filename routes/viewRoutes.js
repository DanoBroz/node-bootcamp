const express = require('express')
const viewsController = require('../controllers/viewsController')
const authController = require('../controllers/authController')

const router = express.Router()

// use log in middleware
router.use(authController.isLoggedIn)

router.get('/', viewsController.getOverview)

router.get('/tour/:slug', viewsController.getTour)

router.get('/login', viewsController.getLogin)

module.exports = router
