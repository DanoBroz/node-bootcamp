/* eslint-disable */
import { displayMap } from './mapbox'
import { login, logout } from './login'
import { updateData } from './updateSettings'

// DOM ELEMENTS
const mapBox = document.getElementById('map')
const loginForm = document.querySelector(
    '.form--login'
)
const userDataForm = document.querySelector(
    '.form-user-data'
)
const logOutBtn = document.querySelector(
    '.nav__el--logout'
)

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(
        document.getElementById('map').dataset
            .locations
    )
    displayMap(locations)
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const email =
            document.getElementById('email').value

        const password =
            document.getElementById(
                'password'
            ).value

        login(email, password)
    })
}

if (userDataForm) {
    const userName =
        document.querySelector('#name')
    const userEmail =
        document.querySelector('#email')

    userDataForm.addEventListener(
        'submit',
        (e) => {
            e.preventDefault()
            updateData(
                userName.value,
                userEmail.value
            )
        }
    )
}

if (logOutBtn)
    logOutBtn.addEventListener('click', logout)
