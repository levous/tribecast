# TribeCast

An application to manage membership(cast) in a community (tribe)

## Configuration

Uses: [lorenwest/node-config](https://github.com/lorenwest/node-config/wiki/Configuration-Files)

Node-config reads configuration files in the ./config directory for the running process, typically the application root.  This happens to be outside of the *server* directory.  **TODO: review whether these config files will be exposed to the React client app and fix the config strategy to correct this.**

### Email (SendMail) config
* Suppress Email Sends
To suppress attempt to send emails from the service, add or amend the file `config/local.json` to include the JSON key/value `"suppressEmail": true`

* API Key
SendGrid expecting `process.env.SENDGRID_API_KEY` to contain the SendGrid API key

## API

Efforts made to RESTful but also keeping the interface and responses consistent and convenient.  

### Verbs:
 * create => POST
   returns
   ```
   {
     message: String,
     member: Object{}
   }
   ```
 * update => PUT
 * retrieve => GET
 * delete => DELETE

### User notifications
User messages are sent using [react-notifications](https://www.npmjs.com/package/react-notifications)

#### NotificationManager API
```
NotificationManager.info(message, title, timeOut, callback, priority);
NotificationManager.success(message, title, timeOut, callback, priority);
NotificationManager.warning(message, title, timeOut, callback, priority);
NotificationManager.error(message, title, timeOut, callback, priority);
```

| name          | type          |    description                                |
| ------------- |:--------------|:----------------------------------------------|
| message       | string        |    The message string                         |
| title         | string        |    The title string                           |
| callback      | function      | The popup timeout in milliseconds             |
| priority      | boolean       | If true, the message gets inserted at the top |



### Errors:
  Uses [restify-errors](https://github.com/restify/errors)

  When errors are thrown, they will be returned in the following structure (modeled after [JsonAPI](http://jsonapi.org/examples/), see [note on serialization](.#restify-serialization))):

  ```
  {
    errors: [
      {
        status: Integer, // HTTP or REST response code
        source: { pointer: String }, // used to indicate which part of the request document caused the error
        title:  String, // generic error title
        detail: String, // specific error message
        stack: String // excluded in production, includes the error stack trace
      },
      ...
    ]
  }
  ```
  a single error will still be returned as an array of one error

  The module ships with the following HttpErrors:

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

  <a name="restify-serialization">* note: restify-errors</a> has a [serialization strategy](https://github.com/restify/errors#rendering-errors) that might be superior.  As long as clients are not already consuming the JsonAPI error structure, feel free to migrate to this.
