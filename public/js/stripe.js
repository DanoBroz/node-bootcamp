/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alerts'
const stripe = Stripe(
    'pk_test_51LzjveLmrNIQQm7GqAlKxTvbqgba0yuZtMc3DZTjwI6ISB8gsWOtmxpzD6xS3zQQueaHEy7ybjZEsSY0YqAbnvto0006urO93h'
)

export const bookTour = async (tourId) => {
    try {
        // 1) get session from the server
        const session = await axios.get(
            `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
        )
        // console.log(session)
        // 2) create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        })
    } catch (err) {
        console.log(err)
        showAlert('error', err)
    }
}
