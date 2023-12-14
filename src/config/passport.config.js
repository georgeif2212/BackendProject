import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import UserModel from "../dao/models/user.model.js";
import UserManager from "../dao/User.manager.js";

export const init = () => {
  const registerOpts = {
    usernameField: "email",
    passReqToCallback: true,
  };
  passport.use(
    "register",
    new LocalStrategy(registerOpts, async (req, email, password, done) => {
      try {
        const { body } = req;
        const newUser = await UserManager.register(body);
        done(null, newUser);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await UserManager.login({ email, password });
          done(null, user);
        } catch (error) {
          done(null, false, { message: error.message }); 
        }
      }
    )
  );

  const githubOpts = {
    clientID: "Iv1.cca07a159c1a5826",
    clientSecret: "29794bb0b5be13d20daf91d2a29454c98e4df9ac",
    callbackURL: "http://localhost:8080/api/sessions/github/callback",
  };
  passport.use(
    "github",
    new GithubStrategy(
      githubOpts,
      async (accesstoken, refreshToken, profile, done) => {
        const email = profile._json.email;
        let user = await UserModel.findOne({ email });
        if (user) {
          return done(null, user);
        }
        user = {
          first_name: profile._json.name,
          last_name: "",
          email,
          password: "",
          provider: "github",
          providerId: profile.id,
          age: 18,
        };
        const newUser = await UserModel.create(user);
        done(null, newUser);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (uid, done) => {
    // inflar la session
    try {
      const user = await UserManager.getById(uid);
      done(null, user);
    } catch (error) {
      done(error.message);
    }
  });
};
