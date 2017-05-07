const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
const log = require('./log')(module);
const config = require('config');

function sendMail(fromAddress, toAddress, subject, bodyHtml){
  const requestPayload = {
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
  };

  const request = sg.emptyRequest(requestPayload);

  log.info('sendMail sending request:', requestPayload);

  if(config.has('suppressEmail')){
    log.warn('sendMail delivery suppressed because suppressEmail config key is set');
    return Promise.resolve({statusCode: 204, request});

  } 

  if(!process.env.SENDGRID_API_KEY) throw new Error('process.env.SENDGRID_API_KEY not set');

  //With promise
  return sg.API(request)
    .then(response => {
      const sendMailResponse = {
        request: requestPayload,
        statusCode: response.statusCode,
        body: response.body,
        headers: response.headers
      }
      log.info('sendMail response:', sendMailResponse);

      if(response.statusCode >= 400) {
        throw new Error(`Send mail failed with status code: ${response.statusCode}`)
      }
      return {status:response.statusCode};
    })
    /*.catch(error => {
      //error is an instance of SendGridError
      //The full response is attached to error.response
      console.log(error.response.statusCode);
    });*/

}


module.exports = sendMail;
