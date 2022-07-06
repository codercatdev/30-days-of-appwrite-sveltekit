import { Client, Account } from "appwrite";

import { state } from "./store"; // saving user data to svelte store

const sdk = new Client();
const account = new Account(sdk);

sdk.setEndpoint("http://localhost/v1") //set your own endpoint
    .setProject("62c58c59e397e73a3b19"); //set your own project id

export const api = {
    register: async (mail, pass, name) => {
        try {
            await account.create("unique()", mail, pass, name);
            await api.login(mail, pass);
        } catch (error) {
            throw error;
        }
    },
    login: async (mail, pass) => {
        try {
            await account.createEmailSession(mail, pass);
            const user = await api.getAccount();
            state.update(n => {
                n.user = user;
                return n;
            });
        } catch (error) {
            state.update(n => {
                n.user = null;
                return n;
            });
            throw error;
        }
    },
    loginWithGoogle: async () => {
        try {
            await account.createOAuth2Session(
                "google",
                "http://localhost:3000",
                "http://localhost:3000/#/login"
            );
        } catch (error) {
            throw error;
        }
    },
    getAccount: async () => {
        try {
            return await account.get();
        } catch (error) {
            throw error;
        }
    },
    createVerification: async url => {
        await account.createVerification(url);
    },
    completeEmailVerification: async (userId, secret) => {
        await account.updateVerification(userId, secret);
    },
    forgotPassword: async (email, url) => {
        await account.createRecovery(email, url);
    },
    completePasswordRecovery: async (userId, secret, pass, confirmPass) => {
        await account.updateRecovery(userId, secret, pass, confirmPass);
    },
};
