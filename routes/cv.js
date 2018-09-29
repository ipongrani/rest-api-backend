

module.exports = (...params) => {

  // Initializer --------------------------------------------------
  let Router  = params[0].Router();
  let bcrypt = require('bcrypt-nodejs');
  let Promise = require('bluebird');
  let jwt = require('jsonwebtoken');
  let Cast = require('../config/cast');
  let nodemailer = require('nodemailer');
  let Strategy = require('../config/passport');
  let passport = params[2];
  let getToken = require('../config/tokenExtractor')
  let Mongo = params[1];
  let DB =  Mongo.connect(process.env.DB_CON).then((db) => {
    console.log("DB is UP!");
    return db;
  });

  let Utility = require('../models/care-center/Utility')(DB,bcrypt,Promise,jwt,nodemailer,Mongo);

  passport.use(Strategy(DB));
// ----------------------------------------------------------------






// Registration -------------------------------------------------
Router.route('/Registration')

// GET ----------------
 .get((req,res,next) => {
    res.render('index', { title: process.env.TEST });
 })
  //---------------------

// POST ---------------
 .post((req,res,next) => {
    //const DB = req.db

    switch(req.query.action){

      case "xtReg" :
        Utility.addNew(req, res, next);
      break;

      case "xtRet" :
        Utility.retrieve(req, res, next);
      break;


      default :
        res.status(404).send({msg: "Nothing Here!"});
      break;

    }

   })
  //----------------------
//----------------------------------------------------------------




  // Encryption -------------------------------------------------
  Router.route('/Encryption')

  // GET ----------------
   .get((req,res,next) => {
      res.render('index', { title: process.env.TEST });
   })
    //---------------------

  // POST ---------------
   .post((req,res,next) => {
      //const DB = req.db

      switch(req.query.action){

        case "enc" :
          Utility.bcrypt(req, res, next);
        break;

        case "jwt" :
          Utility.jwt(req, res, next);
        break;


        case "test" :
          console.log(req.body);
        break;


        default :
          res.status(404).send({msg: "Nothing Here!"});
        break;

      }

     })
    //----------------------
//----------------------------------------------------------------





  // Login -------------------------------------------------
  Router.route('/Login')

  // POST ---------------
   .post((req,res,next) => {
      //const DB = req.db

      switch(req.query.action){

        case "aM" :
          User.passCompare(req, res, next);
        break;

        case "aF" :
          Facility.passCompare(req, res, next);
        break;


        default :
          res.status(404).send({msg: "Nothing Here!"});
        break;

      }

    })
    //----------------------
//----------------------------------------------------------------





  // authenticated Tasks -------------------------------------------------
  Router.route('/:id')

  // Passport ----------------------------------------------
  .all(passport.authenticate('jwt',{session: false}))

  // CAST --------------------------------------------------
  .all(Cast)

  // POST ---------------
    .post((req,res,next) => {

      if (req.params.id !== null || req.params.id !== 'undefined') {

        DB.then((db) => {

          let exec = db.collection('Users');

          exec.findOne({
            _id: req.params.id
          })
          .then((user) => {

            if (!user) {
              res.status(404).json({success: false, msg: 'Authentication failed. User not found.'});
            } else {

              let token = getToken(req.headers);

              if (token) {
                  switch(req.query.action){

                      case 'getInfo' :
                          user.getInfo(req, res, next)
                      break;


                      case 'getInfoF' :
                          Facility.getInfo(req, res, next)
                      break;


                      default :
                        res.status(404).send({success: false, msg: "Nothing here."});
                      break;
                  }
                } else {
                  res.status(404).send({success: false, msg: "Nothing here."});
                }

            }

          })
          .catch( err => {
            console.log(err)
            res.status(401).send({success: false, msg: "Something is wrong."});
          })

        })

      } else {
        res.status(404).send({success: false, msg: "Nothing here."});
      }

    })
    //----------------------
//----------------------------------------------------------------


  return Router
}
