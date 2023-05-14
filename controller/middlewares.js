import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import { User } from "../service/schemas/user.js";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const strategyOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new Strategy(strategyOptions, (payload, done) => {
    const { jwtFromRequest } = strategyOptions;
    User.findOne({ _id: payload.id })
      .then((user) => {
        if (!user) {
          return done(new Error("No such user!"));
        } else {
          if (user.token !== jwtFromRequest)
            return res.status(401).json({ message: "Not authorized!" });
          return done(null, user);
        }
      })
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

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "../tmp");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
  limits: {
    fileSize: 1048576,
  },
});

export const upload = multer({
  storage: storage,
});
