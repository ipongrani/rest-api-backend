


//thid is the commit

module.exports = (...params) => {
  let DB = params[0];
  let jwt = params[3];
  let Promise = params[2];
  let genSalt = Promise.promisify(params[1].genSalt);
  let hash = Promise.promisify(params[1].hash);
  let compare = Promise.promisify(params[1].compare);
  let nodemailer = params[4];
  let Mongo = params[5]


  return {
      bcrypt: (...params) => {
        if (params[0].body.raw.split('').length > 0){
          console.log("raw", params[0].body.raw);

          genSalt(10)
          .then((salt) => {
            console.log(salt)
            return hash(params[0].body.raw, salt, null)
          })
          .then(hashed => {
            params[1].status(200).send({hashed: hashed});
          })
          .catch(err => {
            console.log(err);
            params[1].status(400).send({msg: "Something is wrong"});
          })

        } else {
          console.log("nothing to encrypt");
          params[1].status(404).send({hashed: "Nothing to encrypt"});
        }
      }
      ,
      jwt: (...params) => {
        if (params[0].body.username.split('').length > 0 && params[0].body.email.split('').length > 0 ){
          let token = jwt.sign(params[0].body, process.env.SECRET)
          params[1].status(200).send({token: 'JWT ' + token })
        } else {
          console.log("nothing to encrypt");
          params[1].status(404).send({token: "Nothing to encrypt"});
        }
      }
      ,
      addNew: (...params) => {
        if(params[0].body.mlab.split('').length > 0 && params[0].body.collection.split('').length > 0) {
          Mongo.connect(params[0].body.mlab)
          .then( db => {
            let exec = db.collection(params[0].body.collection);

            return  exec.insert({
                email: params[0].body.email,
                password: params[0].body.password
              })
          })
          .then(() => {
            params[1].status(200).send({msg: "Successfully Registered"})
          })
          .catch( err => {
            params[1].status(400).send({msg: "Somethig is wrong, check if DB and Collection is correct."})
          })
        } else {
            params[1].status(404).send({msg: "No DB or Collection Selected"})
        }
      }
      ,
      retrieve: (...params) => {
        if(params[0].body.mlab.split('').length > 0 && params[0].body.collection.split('').length > 0) {
          Mongo.connect(params[0].body.mlab)
          .then( db => {
            let exec = db.collection(params[0].body.collection);

            return  exec.find({
                [params[0].body.key] : params[0].body.val
              })
          })
          .then((data) => {
            params[1].status(200).send({data: data, msg: "Successful"})
          })
          .catch( err => {
            params[1].status(400).send({data: '', msg: "Somethig is wrong, check if DB and Collection is correct."})
          })
        } else {
            params[1].status(404).send({data: '', msg: "No DB or Collection Selected"})
        }
      }
    }
  }
