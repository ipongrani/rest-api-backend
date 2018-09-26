

module.exports = (...params) => {

  // Initializer --------------------------------------------------
  let Router  = params[0].Router();
  let Cast = require('../config/cast');
  let Strategy = require('../config/passport');
  let passport = params[2];
  let getToken = require('../config/tokenExtractor')
  let DB =  params[1].connect(process.env.DB_CON).then((db) => {
    console.log("DB is UP!");
    return db;
  });
  let User = require('../models/care-center/User')(DB);
  let Facility = require('../models/care-center/Facility')(DB);

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

        case "nM" :
          User.addNew(req, res, next);
        break;


        case "nF" :
          Facility.addNew(req, res, next);
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

        case "auth" :
          User.passCompare(req, res, next);
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
                          User.getInfo(req, res, next)
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

        })

      } else {
        res.status(404).send({success: false, msg: "Nothing here."});
      }

    })
    //----------------------
//----------------------------------------------------------------


  return Router
}
