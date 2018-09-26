

let JwtStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;



let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: process.env.SECRET,
};


module.exports = (DB) => {


  let strat =  new JwtStrategy(opts,(jwt_payload, done) => {

    DB.then((db) => {
      let exec = db.collection('Users');
      exec.findOne({
        _id: jwt_payload._id
      })
      .then((res) => {
        done(null,res)
      })
      .catch((err) => {
        done(err,false)
      })
    })

  });

    return strat
}
