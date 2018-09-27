




module.exports = (params,rand,nodemailer) => {

  let link = "http://nucleus-0.herokuapp.com/Registration?action=verify="+rand;

  let messageBox = "<div style='background-color: #F8F8F8; width: 300px; border: 25px solid #E05206; padding: 25px; margin: 25px;'>"+
                       "<h1>Hello,</h1><h2>Please click on the link below to verify your email and continue login to e-lection.</h2><br>"+
                        "<a href="+link+">https://blue-care-services.herokuapp.com</a>"+
                    "</div>";


  return {
    transporter: () => nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAILUNAME,
            pass: process.env.EMAILPSSWD
          }
     }),
    mailOptions: {
      to : params[0].body.email,
      subject : "Please confirm your Email account",
      html : messageBox
    }
  }
}
