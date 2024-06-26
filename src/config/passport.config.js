import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import UsersController from "../controllers/users.controller.js";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import config from "../config/config.js";
import { sendWelcomeEmail } from "../utils/emailTemplates.js";

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies["access_token"];
  }
  return token;
};

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
        const email = await sendWelcomeEmail(newUser);
        done(null, newUser);
      } catch (error) {
        return done(null, false, { message: error.message });
      }
    })
  );

  const jwtOptions = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  };
  passport.use(
    "jwt",
    new JWTStrategy(jwtOptions, (payload, done) => {
      return done(null, payload);
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
          sendWelcomeEmail(newUser);
          done(null, newUser);
        } catch (error) {
          done(error, false, { message: error.message });
        }
      }
    )
  );
};
