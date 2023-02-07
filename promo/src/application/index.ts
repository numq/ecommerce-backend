export const createApplication = (initialize: () => Promise<void>, execute: () => Promise<void>) => {
    Promise.all([initialize(), execute()])
        .then(() => console.log("Successfully launched application."))
        .catch(console.error);
};