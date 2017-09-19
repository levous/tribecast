class ClientError extends Error {

  constructor(message) {
    super(message)
    this.name = 'ClientError';
  }

  //TODO: switch on httpStatus to provide an appropriate custom error
  //TODO: WRITE TESTS FOR THIS!!!!!
  static makeErrFromCode(httpStatus, errorDetail){
    let error = new ClientError(errorDetail);
    error.status = httpStatus;
    return error;
  }
}

export default ClientError;
