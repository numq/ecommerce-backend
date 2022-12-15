export namespace TokenError {
    export const generateAccessToken = new Error("Unable to generate access token");
    export const generateRefreshToken = new Error("Unable to generate refresh token");
    export const verify = new Error("Unable to verify token");
}