export namespace Types {
    export const app = {
        config: Symbol.for("appConfig"),
        database: Symbol.for("appDatabase"),
        server: Symbol.for("appServer")
    };
    export const profile = {
        collection: Symbol.for("profileCollection"),
        repository: Symbol.for("profileRepository"),
        service: Symbol.for("profileService"),
        createProfile: Symbol.for("createProfile"),
        getProfileById: Symbol.for("getProfileById"),
        updateProfile: Symbol.for("updateProfile"),
        removeProfile: Symbol.for("removeProfile")
    };
}