const express = require('express')
const User = require('../model/schema')
const { OAuth2Client } = require('google-auth-library')

const router = express.Router()

const clientId = "858782126681-rucftb7v6is7s2rt3h7bmsdac25gm0jp.apps.googleusercontent.com";

const authClient = new OAuth2Client(clientId)

router.post('/', (req, res) => {
    const { idToken } = req.body;
    if (idToken) {
        authClient.verifyIdToken({ idToken, audience: clientId })
            .then(response => {
                // console.log(response)
                const { email_verified, email, name, picture } = response.payload
                if (email_verified) {
                    User.findOne({ email }).exec((err, user) => {
                        if(user){
                            return res.json(user)
                        }
                        else{
                            let password = email + clientId
                            let newUser = new User({email,name,picture,password});
                            newUser.save((err,data)=>{
                                if(err){
                                    return res.status.json({error:"mongodb error"})
                                }
                                res.json(data)
                            })
                        }
                    })
                }
            })
            .catch(err => { console.log(err) })
    }
})

module.exports = router