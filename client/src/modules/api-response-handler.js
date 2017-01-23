import errors from 'restify-errors';
import fetch from 'isomorphic-fetch';


class ApiResponseHandler {


  static errorReportedByResponse(fetchResponse, errReceiver) {
    //TODO: should this call the errReceiver with null?
    if (response.status < 400) return;

    const errorsJson = response.json();
    // first error is intended reported error
    const errorJson = errorsJson[0];
    //TODO: loop all errors and create inner errors
    // create an error from the provided response code
    const error = errors.makeErrFromCode(response.status, errorJson.detail);
    // pass to the receiver
    return errReceiver(error);
  }
}

export default ApiResponseHandler;
