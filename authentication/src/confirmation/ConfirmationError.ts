export namespace ConfirmationError {
    export const sendConfirmationCode = new Error("Unable to send confirmation code");
    export const verifyConfirmationCode = new Error("Wrong code");
}