


// single route
module.exports = (params) => {

  // Initializer --------------------------------------------------
  let Router  = params['express'].Router();
  let Cast = require('../config/cast');
  let Strategy = require('../config/passport');
  let passport = params['Passport'];
  let getToken = require('../config/tokenExtractor')

  let Config={};
  Config['bcrypt'] = require('bcrypt-nodejs');
  Config['Promise'] = require('bluebird');
  Config['jwt'] = require('jsonwebtoken');
  Config['nodemailer'] = require('nodemailer');
  Config['Mongo'] = params['MongoDB'];
  Config['DB'] = Config['Mongo'].connect(process.env.DB_CON).then((db) => {
    console.log("DB is UP!");
    return db;
  });




  let Utility = require('../models/Utility')(Config);

  passport.use(Strategy(Config['DB']));
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

    let data = {};
    data['req'] = req;
    data['res'] = res;
    data['next'] = next;

    switch(req.query.action){

      case "xtReg" :
        Utility.addNew(data);
      break;

      case "xtRet" :
        Utility.retrieve(data);
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

        let data = {};
        data['req'] = req;
        data['res'] = res;
        data['next'] = next;


        switch(req.query.action){

          case "bcrypt" :
            Utility.bcrypt(data);
          break;

          case "jwt" :
            Utility.jwt(data);
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




  return Router
}
