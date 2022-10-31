/* eslint-disable */

const login = async (email, password) => {
    try {
        const result = await axios.post(
            'http://localhost:3000/api/v1/users/login',
            {
                email,
                password,
            }
        )
        console.log(result)
    } catch (err) {
        console.error(err.response.data)
    }
}

document
    .querySelector('.form')
    .addEventListener('submit', (e) => {
        e.preventDefault()

        const email =
            document.getElementById('email').value

        const password =
            document.getElementById(
                'password'
            ).value

        login(email, password)
    })
