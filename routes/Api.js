

module.exports = (...params) => {
  let Router  = params[0].Router();
  let DB =  params[1].connect(process.env.DB_CON).then((db) => {
    console.log("DB is UP!");
    return db;
  });
  let User = require('../models/User')(DB);

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

        case "new" :
          //console.log(DB);
          User.addNew(req, res, next);

        break;


        case "getInfo" :

          User.getInfo(req, res, next)

        break;


        default :
          res.render('index', { title: "Nothing is in here" });
        break;

      }

    })
    //----------------------
//----------------------------------------------------------------

  return Router
}
