


//thid is the commit

module.exports = (DB) => {
  let bcrypt = require('bcrypt-nodejs');
  let Promise = require('bluebird');
  let jwt = require('jsonwebtoken');
  let genSalt = Promise.promisify(bcrypt.genSalt);
  let hash = Promise.promisify(bcrypt.hash);
  let compare = Promise.promisify(bcrypt.compare);
  let nodemailer = require('nodemailer');


  return {
    //Add New ----------------------------------------------------------
        testMail: () => {
          let rand = Math.random().toString(36).slice(2)
          let smtp = require("../../config/smtpConfig")(rand,nodemailer);
          smtp.transporter().sendMail(smtp[`mailOptions`], function(error, response) {

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
          DB.then((db) => {
            let exec = db.collection('Users');
            exec.find({
              email: params[0].body.email
            })
            .then((user) => {
              if (user.length > 0) {
                params[1].status(401).send({msg: "Already Registered"})
              } else {

                genSalt(10)
                 .then((salt) => {


                  hash(params[0].body.password, salt, null)
                  .then((hashed) => {
                    //console.log(hashed);
                    exec.insert({
                      name: params[0].body.name,
                      address: params[0].body.address,
                      email: params[0].body.email,
                      password: hashed,
                      status: "Inactive"
                    })
                    .then(() => {

                      params[1].status(200).send({success: true, msg: "Successfully Registered"})
                    })
                    .catch(err => {
                      console.log(err);
                      return params[1].status(400).send({msg: "Something is wrong!"})
                    });
                  })
                  .catch(err => {
                    console.log(err);
                    return params[1].status(400).send({msg: "Something is wrong!"})
                  });

                })
                .catch(err => {
                  console.log(err);
                  return params[1].status(400).send({msg: "Something is wrong!"})
                });

              }
            })
            .catch( err => {
              console.log(err)
              return params[1].status(400).send({msg: "Something is wrong!"})
            });
          })
          .catch(err => {
            console.log(err)
            return params[1].status(400).send({msg: "Something is wrong!"})
          });
        }
        // --------------------------------------------------------------------------------------
        ,
        // Get Info -----------------------------------------------------------------------------
        getInfo: (...params) => {
          DB.then((db) => {
            let exec = db.collection('Users');
            exec.find({
              email: params[0].body.email
            })
            .then((user) => {
              if (user.length > 0) {

                params[1].status(200).send({success: true, data: user})
              } else {
                console.log(user);
                params[1].status(404).send({msg: "Nothing found"})
              }
            })
            .catch( err => {
              console.log(err)
              return params[1].status(400).send({msg: "Something is wrong!"})
            });
          })
          .catch( err => {
            console.log(err)
            return params[1].status(400).send({msg: "Something is wrong!"})
          });
        }
        // ---------------------------------------------------------------------------------------
        ,
        // Pass Compare --------------------------------------------------------------------------
        passCompare: (...params) => {
          DB.then((db) => {
            let exec = db.collection('Users');

            exec.find({
              email: params[0].body.email
            })
            .then((user) => {

              if (user.length > 0) {
              compare(params[0].body.password,user[0].password)
                .then((res) => {
                  if (res === true) {

                    let token = jwt.sign(user[0], process.env.SECRET)
                    params[1].status(200).send({success: true, msg: 'success', id: user[0]._id, token: 'JWT ' + token })

                  } else {

                    params[1].status(404).send({msg: 'Nothing Found'});

                  }
                })
                .catch( err => {
                  console.log(err)
                  return params[1].status(400).send({msg: "Something is wrong!"})
                });

              } else {
                params[1].status(404).send({msg: 'Nothing Found.'});
              }

            })
            .catch( err => {
              console.log(err)
              return params[1].status(400).send({msg: "Something is wrong!"})
            });

          });
        }
        // ---------------------------------------------------------------------------------------
      }
  }
