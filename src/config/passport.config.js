import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import UsersController from "../controllers/users.controller.js";

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
        const newUser = await UsersController.register(body);
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
          const user = await UsersController.login({ email, password });
          done(null, user);
        } catch (error) {
          done(error, false, { message: error.message });
        }
      }
    )
  );

  const githubOpts = {
    clientID: "Iv1.5d100ad00e860302",
    clientSecret: "83c5d167b8ac1e61e576fab03fee33d9e3fd55c9",
    callbackURL: "http://localhost:8080/api/sessions/github/callback",
  };
  passport.use(
    "github",
    new GithubStrategy(
      githubOpts,
      async (accesstoken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email;
          let user = await UsersController.alreadyExists(email);
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
          };
          const newUser = await UsersController.register(user);
          done(null, newUser);
        } catch (error) {
          done(error, false, { message: error.message });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (uid, done) => {
    // inflar la session
    try {
      const user = await UsersController.getById(uid);
      done(null, user);
    } catch (error) {
      done(error.message);
    }
  });
};
