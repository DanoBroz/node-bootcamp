/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'

// type is either 'password' or 'data'
export const updateSettings = async (
    data,
    type
) => {
    try {
        const url =
            type === 'password'
                ? 'updateMyPassword'
                : 'updateMe'

        const res = await axios.patch(
            `/api/v1/users/${url}`,
            data
        )
        if (res.data.status === 'success') {
            showAlert(
                'success',
                `${type.toUpperCase()} updated successfully!`
            )
        }
    } catch (err) {
        console.log(data)
        showAlert(
            'error',
            err.response.data.message
        )
    }
}
