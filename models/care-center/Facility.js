


//thid is the commit

module.exports = (DB) => {
  let bcrypt = require('bcrypt-nodejs');
  let Promise = require('bluebird');
  let jwt = require('jsonwebtoken');
  let genSalt = Promise.promisify(bcrypt.genSalt);
  let hash = Promise.promisify(bcrypt.hash);
  let compare = Promise.promisify(bcrypt.compare);


  return {
    //Add New ----------------------------------------------------------
    addNew: (...params) => {
      DB.then( db  => {
          let exec = db.collection('FacilityOwners');
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
             let exec =  db.collection('FacilityOwners');
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
              let exec = db.collection('FacilityOwners');
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
            let exec = db.collection('FacilityOwners');

            return exec.find({
              email: params[0].body.email
            })
          })
          .then((user) => {
            console.log("user: ", user)

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
              let token = jwt.sign(user[0], process.env.SECRET)
              params[1].status(200).send({success: true, msg: 'success', id: user[0]._id, token: 'JWT ' + token })
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
