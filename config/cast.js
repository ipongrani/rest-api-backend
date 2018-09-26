


module.exports = (req, res, next) => {

  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    console.log("casted");
    next();
  } else {
    console.log("not casted");
      res.status(401).send({success: false, msg: 'Nothing Here'});
  }

}
