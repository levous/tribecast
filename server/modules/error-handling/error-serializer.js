// Naive attempt to adhere to JSON API standard error format
const serializeErrors = (errors) => {
  if(!Array.isArray(errors)){
    return serializeErrors([errors]);
  }
  console.log('*** *** *** *** *** serializeErrors', errors);
  let errorsJson = errors.map(error => {
    let errJson = {
      "status": error.status || 500,
      "source": error.pointer ? { "pointer": error.pointer} : {},
      "title":  error.name,
      "detail": error.message
    };
    if(process.env.NODE_ENV === 'development'){
      errJson.stack = error.stack;
    }
    return errJson;
  });

  const json = {
    errors: errorsJson
  };
  
  return json;
};

module.exports.serializeErrors = serializeErrors;
