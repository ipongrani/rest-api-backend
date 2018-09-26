


//thid is the commit

module.exports = (DB) => {
  return {
        addNew: (...params) => {
          DB.then((db) => {
            let exec = db.collection('Users');
            exec.findOne({
              email: params[0].body.email
            })
            .then((user) => {
              if (user) {
                params[1].status(401).send({msg: "Already Registered"})
              } else {
                exec.insert({
                  name: params[0].body.name,
                  address: params[0].body.address,
                  email: params[0].body.email,
                  password: params[0].body.password,
                  status: "Inactive"
                })
                //.then((res) => console.log(res))
                //.then((res) => setTimeout(() => console.log("delays 3sec"),3000))
                .then(() => params[1].status(200).send({msg: "Successfully Registered"}))
              }
            })
          })
          .catch((err) => {
            console.log(err)
            return params[1].status(403).send({msg: "Something is wrong!"})
          });
        }
        ,
        getInfo: (...params) => {
          DB.then((db) => {
            let exec = db.collection('Users');
            exec.find({
              email: params[0].body.email
            })
            .then((user) => {
              if (user) {
                params[1].status(200).send(user)
              } else {
                params[1].status(404).send({msg: "Nothing found"})
              }
            })
          })
          .catch((err) => {
            console.log(err)
            return params[1].status(403).send({msg: "Something is wrong!"})
          });
        }
      }
  }
