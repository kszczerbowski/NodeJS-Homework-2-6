import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import { User } from "../service/schemas/user.js";
import dotenv from "dotenv";

dotenv.config();

const strategyOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(strategyOptions, (payload, done) => {
    User.findOne({ _id: payload.id })
      .then((user) =>
        !user ? done(new Error("No such user!")) : done(null, user)
      )
      .catch(done);
  })
);

export const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (!user || error)
      return res.status(401).json({ message: "Not authorized!" });
    req.user = user;
    next();
  })(req, res, next);
};
