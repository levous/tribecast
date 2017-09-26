

const errors = {
  makeErrFromCode: (errorCode, errorDescription) => {
    const error = new Error(`${errorDescription} code:${errorCode}`);
    error.statusCode = errorCode;
    return error;
  }
}

errors.NotAuthorizedError = class NotAuthorizedError extends Error {};
errors.PreconditionFailedError = class PreconditionFailedError extends Error {};
errors.ResourceNotFoundError = class ResourceNotFoundError extends Error {};

module.exports = errors;

/*
TODO: implement the following HttpErrors:

400 BadRequestError
401 UnauthorizedError
402 PaymentRequiredError
403 ForbiddenError
404 NotFoundError
405 MethodNotAllowedError
406 NotAcceptableError
407 ProxyAuthenticationRequiredError
408 RequestTimeoutError
409 ConflictError
410 GoneError
411 LengthRequiredError
412 PreconditionFailedError
413 RequestEntityTooLargeError
414 RequesturiTooLargeError
415 UnsupportedMediaTypeError
416 RangeNotSatisfiableError (For Node >= 4 & iojs >= 3)
416 RequestedRangeNotSatisfiableError (For Node 0.x & iojs < 3)
417 ExpectationFailedError
418 ImATeapotError
422 UnprocessableEntityError
423 LockedError
424 FailedDependencyError
425 UnorderedCollectionError
426 UpgradeRequiredError
428 PreconditionRequiredError
429 TooManyRequestsError
431 RequestHeaderFieldsTooLargeError
500 InternalServerError
501 NotImplementedError
502 BadGatewayError
503 ServiceUnavailableError
504 GatewayTimeoutError
505 HttpVersionNotSupportedError
506 VariantAlsoNegotiatesError
507 InsufficientStorageError
509 BandwidthLimitExceededError
510 NotExtendedError
511 NetworkAuthenticationRequiredError
and the following RestErrors:

400 BadDigestError
405 BadMethodError
500 InternalError
409 InvalidArgumentError
400 InvalidContentError
401 InvalidCredentialsError
400 InvalidHeaderError
400 InvalidVersionError
409 MissingParameterError
403 NotAuthorizedError
412 PreconditionFailedError
400 RequestExpiredError
429 RequestThrottledError
404 ResourceNotFoundError
406 WrongAcceptError
*/
