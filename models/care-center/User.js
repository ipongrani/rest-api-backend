


//thid is the commit

module.exports = (...params) => {
  let DB = params[0];
  let jwt = params[3];
  let Promise = params[2];
  let genSalt = Promise.promisify(params[1].genSalt);
  let hash = Promise.promisify(params[1].hash);
  let compare = Promise.promisify(params[1].compare);
  let nodemailer = params[4];


  return {
    //Add New -------(TESTING, DO NOT TOUCH)---------------------------------------------------
        testMail: (...params) => {
          let rand = Math.random().toString(36).slice(2)
          let smtp = require("../../config/smtpConfig")(params,rand,nodemailer);

/*
          let exec = Promise.promisify(smtp.transporter().sendMail);

          exec(smtp[`mailOptions`]).then(() => {
            console.log("Message sent: ");
            params[1].status(200).send({success: true, msg: 'Successful created new user for verification.'});
          })
          .catch((error) => {
            console.log(error);
            params[1].status(401).send({success: false, msg: 'Something is wrong.'});
          })
*/

          smtp.transporter().sendMail(smtp[`mailOptions`], function(error, response){

           if (error) {

                console.log(error);
                params[1].status(401).send({success: false, msg: 'Something is wrong.'});
           } else {

                console.log("Message sent: ");
                params[1].status(200).send({success: true, msg: 'Successful created new user for verification.'});
           }
         });


        },
        addNew: (...params) => {
          DB.then( db  => {
              let exec = db.collection('Users');
              return exec.find({
                email: params[0].body.email
              })
            })
            .then((user) => {
              if (user.length > 0) {
                return Promise.reject({msg: "User Exist"})
              } else {
                return genSalt(10)
              }
            })
            .then((salt) => {
              console.log(salt)
              return hash(params[0].body.password, salt, null)
            })
            .then((hashed) => {

              DB.then( db => {
                 let exec =  db.collection('Users');
                 return exec.insert({
                   name: params[0].body.name,
                   address: params[0].body.address,
                   email: params[0].body.email,
                   password: hashed,
                   status: "Inactive"
                 })
              })
              .then(() => params[1].status(200).send({success: true, msg: "Successfully Registered"}))
              .catch((err) => {
                console.log(err);
                params[1].status(400).send("Something is wrong")
              })

            })
            .catch((err) => {
              console.log(err);
              params[1].status(400).send(err)
            })
          }
          // --------------------------------------------------------------------------------------
          ,
          // Get Info -----------------------------------------------------------------------------
            getInfo: (...params) => {
              DB.then((db) => {
                  let exec = db.collection('Users');
                  return exec.find({
                    email: params[0].body.email
                  })
                })
                .then((user) => {
                  if (user.length <= 0) {
                      return Promise.reject({msg: "Nothing Found"})
                  } else {
                    //console.log(user);
                    params[1].status(200).send({success: true, data: user})
                  }
                })
                .catch( err => {
                  console.log(err)
                  return params[1].status(400).send(err)
                });
            }
            // ---------------------------------------------------------------------------------------
            ,
            // Pass Compare --------------------------------------------------------------------------
            passCompare: (...params) => {
              DB.then((db) => {
                let exec = db.collection('Users');

                return exec.find({
                  email: params[0].body.email
                })
              })
              .then((user) => {
                if (user.length <= 0) {
                  return Promise.reject({msg: "Nothing Found"})
                } else {
                  return compare(params[0].body.password,user[0].password)
                }
              })
              .then( res => {

                if (res === false) {
                  return Promise.reject({msg: "Wrong Password"})
                } else {
                  DB.then( db => {
                    let exec = db.collection("Users");
                    return exec.find({
                      email: params[0].body.email
                    })
                  })
                  .then( user => {
                    let token = jwt.sign(user[0], process.env.SECRET)
                    params[1].status(200).send({success: true, msg: 'success', id: user[0]._id, token: 'JWT ' + token })
                  })
                  .catch( err => {
                    return params[1].status(400).send(err)
                  });
                }

              })
              .catch( err => {
                console.log(err)
                return params[1].status(400).send(err)
              });
            }
            // ---------------------------------------------------------------------------------------
          }
  }
