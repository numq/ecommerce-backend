export const createApplication = (initialize: () => Promise<void>, execute: () => Promise<void>) => {
    initialize().then(() => {
        execute().then(() => {
            console.log("Successfully launched application.");
        }).catch(console.error);
    }).catch(console.error);
};