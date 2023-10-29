const passport = require('passport');
const UserModel = require('./UserModel')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
            const { sub, name, email, picture } = profile._json
            let user = await UserModel.findOne({ googleId: sub })
            if (!user) {
                user = await UserModel.create({
                    googleId: sub,
                    username: name,
                    email,
                    picture
                })
            }
            done(null, user)
        }
    )
)
passport.serializeUser((user, done) => {
    // console.log('inside serialize user: ', user)
    done(null, user._id)
})
passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id)
    done(null, user)
})