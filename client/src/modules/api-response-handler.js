import errors from 'restify-errors';
import fetch from 'isomorphic-fetch';


class ApiResponseHandler {

  /**
   * Inspect the response sent back from the api using isomorphic-fetch
   *
   * @param {isomorphic-fetch.response} fetchResponse - the fetch response object returned from isomorphic-fetch
   * @param boolean rejectOnError - default is false, when true, an error status will invoke
   *    reject(error) on the promise.  When false, the error will be returned as apiResponse.error,
   *    allowing the method consumer to determine what to do.
   * @returns {object} - data package prepared for inspection/use.
                         {
                           status: fetchResponse.status || 500,
                           statusText: fetchResponse.statusText || 'Unknown Response',
                           json: response.body parsed into json,
                           error: an error generated using the non-success http status code and error response json, if present
                         }
   */
  static handleFetchResponse(fetchResponse, rejectOnError=false) {

    return new Promise((resolve, reject) => {

      let apiResponse = {
        status: fetchResponse.status || 500,
        statusText: fetchResponse.statusText || 'Unknown Response',
        json: null,
        error: null
      }

      if(!fetchResponse.status) {
        apiResponse.error = new Error('Invalid fetch response.  fetchResponse.status not defined');
        return reject(new Error('Invalid fetch response'));
      }

      // default error
      if(fetchResponse.status >= 400) {
        apiResponse.error = errors.makeErrFromCode(fetchResponse.status, fetchResponse.statusText);
      }

      // read response body as text
      fetchResponse.text()
        .then(responseText => {
          // if no body sent
          if(!responseText) {
            // reject if error present and requested to do so
            if (rejectOnError && apiResponse.error) return reject(apiResponse.error);
            // resole with api response package
            return resolve(apiResponse);
          }

          // parse body text into JSON
          try{
            apiResponse.json = JSON.parse(responseText);
          }
          catch(err){
            console.log('fetchResponse sent body text that was not JSON.  Ignoring...');
          }

          // if error response, parse error from JSON
          if(fetchResponse.status >= 400)
            if(apiResponse.json) {
            try{
              const errorsJson = apiResponse.json.errors;
              // first error is intended reported error
              const errorJson = errorsJson[0];
              //TODO: loop all errors and create inner errors
              // create an error from the provided response code
              apiResponse.error = errors.makeErrFromCode(fetchResponse.status, errorJson.detail);
            }
            catch(err){
              console.log('errorReportedByResponse', 'could not parse the response json');
              console.log('errorReportedByResponse', err);
              // use default error
            }
            if (rejectOnError) return reject(apiResponse.error);
          }
          return resolve(apiResponse);
        });
    });

    // returns the promise
  }

}

export default ApiResponseHandler;
