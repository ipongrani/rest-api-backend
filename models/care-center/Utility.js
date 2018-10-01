


//thid is the commit

module.exports = (Config) => {

  let Promise = Config['Promise'];
  let genSalt = Promise.promisify(Config['bcrypt'].genSalt);
  let hash = Promise.promisify(Config['bcrypt'].hash);



  return {
      bcrypt: async (data) => {
        if (data['req'].body.raw.split('').length > 0){

          try {

            let salt = await genSalt(10);
            let hashed = await hash(data['req'].body.raw, salt, null);

            return data['res'].status(200).send({hashed: hashed});

          } catch (err) {
            data['res'].status(400).send({msg: "Something is wrong"})
          }

        } else {

          console.log("nothing to encrypt");
          data['res'].status(404).send({hashed: "Nothing to encrypt"});

        }
      }
      ,
      jwt: async (data) => {
        if (data['req'].body.username.split('').length > 0 && data['req'].body.email.split('').length > 0 ){

          let token = Config['jwt'].sign(data['req'].body, process.env.SECRET)
          data['res'].status(200).send({token: 'JWT ' + token })

        } else {

          console.log("nothing to encrypt");
          data['res'].status(404).send({token: "Nothing to encrypt"});

        }
      }
      ,
      addNew: async (data) => {
        if(data['req'].body.mlab.split('').length > 0 && data['req'].body.collection.split('').length > 0) {

          try {

            let db = await Config['Mongo'].connect(data['req'].body.mlab);
            let exec = db.collection(data['req'].body.collection);

            exec.insert({
                email: data['req'].body.email,
                password: data['req'].body.password
              })
            .then(() => {
              data['res'].status(200).send({msg: "Successfully Registered"})
            })

          } catch (err) {
            data['res'].status(404).send({msg: "Something went wrong."})
          }

        } else {
            data['res'].status(404).send({msg: "No DB or Collection Selected"})
        }
      }
      ,
      retrieve: async (data) => {
        if(data['req'].body.mlab.split('').length > 0 && data['req'].body.collection.split('').length > 0) {

          try {

            let db = await Config['Mongo'].connect(data['req'].body.mlab);
            let exec = db.collection(data['req'].body.collection);
            let d = await exec.find({
                [data['req'].body.key] : data['req'].body.val
              })

            data['res'].status(200).send({data: d, msg: "Successful"})

          } catch(err) {
            data['res'].status(400).send({data: '', msg: "Somethig is wrong, check if DB and Collection is correct."});
          }

        } else {

            data['res'].status(404).send({data: '', msg: "No DB or Collection Selected"})

        }
      }

    }
  }
