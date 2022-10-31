/* eslint-disable */
import '@babel/polyfill'
import axios from 'axios'
import { showAlert } from './alerts'

export const login = async (email, password) => {
    try {
        const result = await axios.post(
            'http://localhost:3000/api/v1/users/login',
            {
                email,
                password,
            }
        )

        if (result.data.status === 'success') {
            showAlert(
                'success',
                'Logged in successfully!'
            )
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
    } catch (err) {
        showAlert(
            'error',
            err.response.data.message
        )
    }
}
