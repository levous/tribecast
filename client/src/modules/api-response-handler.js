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

      fetchResponse.json()
        .then(responseJson => {
          apiResponse.json = responseJson;
          // if error response, parse error
          if(fetchResponse.status >= 400) {
            try{
              const errorsJson = responseJson.errors;
              // first error is intended reported error
              const errorJson = errorsJson[0];
              //TODO: loop all errors and create inner errors
              // create an error from the provided response code
              apiResponse.error = errors.makeErrFromCode(fetchResponse.status, errorJson.detail);;
            }
            catch(err){
              console.log('errorReportedByResponse', 'could not parse the response json');
              console.log('errorReportedByResponse', err);
              apiResponse.error = errors.makeErrFromCode(fetchResponse.status);
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
