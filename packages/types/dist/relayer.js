export var RelayerEvent;
(function (RelayerEvent) {
    RelayerEvent["SESSION_CREATE"] = "session.create";
    RelayerEvent["SESSION_JOIN"] = "session.join";
    RelayerEvent["SESSION_MESSAGE"] = "session.message";
    RelayerEvent["SESSION_FINISH"] = "session.finish";
    RelayerEvent["SESSION_SYNC"] = "session.sync";
    RelayerEvent["SESSION_START"] = "session.start";
})(RelayerEvent || (RelayerEvent = {}));
export var RelayerNotification;
(function (RelayerNotification) {
    RelayerNotification["SESSION_CREATE_EVENT"] = "session.create.event";
    RelayerNotification["SESSION_SIGNUP_EVENT"] = "session.signup.event";
    RelayerNotification["SESSION_MESSAGE_EVENT"] = "session.message.event";
    RelayerNotification["SESSION_CLOSED_EVENT"] = "session.closed.event";
    RelayerNotification["SESSION_START_EVENT"] = "session.start.event";
})(RelayerNotification || (RelayerNotification = {}));
export var RelayerError;
(function (RelayerError) {
    RelayerError["ERROR_CLIENT_DEVICE_NOT_JOINED"] = "client for the specified device is not inside the session";
    RelayerError["ERROR_CLIENT_NOT_FOUND"] = "client data is not found";
    RelayerError["ERROR_CLIENT_NOT_JOINED"] = "client is not inside the session";
    RelayerError["ERROR_INVALID_PARAMS"] = "invalid params";
    RelayerError["ERROR_PARTIES_TOO_SMALL"] = "parties must be greater than one";
    RelayerError["ERROR_SESSION_DOES_NOT_EXIST"] = "session does not exist";
    RelayerError["ERROR_SESSION_STARTED"] = "unable to start a new session when a session is already started";
    RelayerError["ERROR_THRESHOLD_RANGE"] = "threshold must be less than parties";
    RelayerError["ERROR_THRESHOLD_TOO_SMALL"] = "threshold must be greater than zero";
    RelayerError["ERROR_UNKNOWN_METHOD"] = "unknown method";
    RelayerError["ERROR_INTERNAL"] = "internal server error";
    RelayerError["ERROR_SESSION_FULL"] = "the session is full";
})(RelayerError || (RelayerError = {}));
//# sourceMappingURL=relayer.js.map