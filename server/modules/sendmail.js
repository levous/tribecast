const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
const config = require('config');

function sendMail(fromAddress, toAddress, subject, bodyHtml){
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: toAddress,
            },
          ],
          subject: subject,
        },
      ],
      from: {
        email: fromAddress,
      },
      content: [
        {
          type: 'text/html',
          value: bodyHtml,
        },
      ],
    },
  });

  
  if(config.get('suppressEmail')) return Promise.resolve(request);
  if(!process.env.SENDGRID_API_KEY) throw new Error('process.env.SENDGRID_API_KEY not set');

  //With promise
  return sg.API(request)
    .then(response => {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
    })
    .catch(error => {
      //error is an instance of SendGridError
      //The full response is attached to error.response
      console.log(error.response.statusCode);
    });

}


module.exports = sendMail;
