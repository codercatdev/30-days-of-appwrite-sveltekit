import { Client, Account, Teams, Databases, Avatars } from "appwrite";
import { Query } from "appwrite";

import { state } from "./store"; // saving user data to svelte store

const client = new Client();
const account = new Account(client);
const teams = new Teams(client);
const database = new Databases(client, "62c5cd18343e3442f407");
const avatars = new Avatars(client);

client
    .setEndpoint("http://localhost/v1") //set your own endpoint
    .setProject("62c58c59e397e73a3b19"); //set your own project id

const profilesCollection = "62c5cf2fd6ba8c99db13";
const postsCollection = "62c5cd262ef3f70037e6";
const bucketId = "[INSERT YOUR ID HERE]";
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
    logout: async () => {
        try {
            const user = await account.deleteSessions();
            state.update(n => {
                n.user = null;
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
    //Team stuff
    fetchUserTeams: () => teams.list(),
    createTeam: name => teams.create("unique()", name),
    deleteTeam: id => teams.delete(id),
    getTeam: id => teams.get(id),
    getMemberships: teamId => teams.getMemberships(teamId),
    createMembership: (teamId, email, roles, url, name) =>
        teams.createMembership(teamId, email, roles, url, name),
    updateMembership: (teamId, inviteId, userId, secret) =>
        teams.updateMembershipStatus(teamId, inviteId, userId, secret),
    deleteMembership: (teamId, inviteId) =>
        teams.deleteMembership(teamId, inviteId),

    //Database stuff
    fetchUser: async id => {
        let res = await database.listDocuments(
            profilesCollection,
            [Query.equal("user", id)],
            1
        );
        if (res.total > 0 && res.documents.length > 0) return res.documents[0];
        else throw Error("Not found");
    },
    createUser: async (id, name) => {
        return database.createDocument(
            profilesCollection,
            "unique()",
            {
                user: id,
                name: name,
            },
            ["role:all"],
            [`user:${id}`]
        );
    },
    fetchPosts: (limit, offset) => {
        return database.listDocuments(
            postsCollection,
            [Query.equal("published", true)],
            limit,
            offset,
            "",
            "after",
            ["published"],
            ["DESC"]
        );
    },
    fetchUserPosts: (userId, published = true) => {
        return database.listDocuments(
            postsCollection,
            [
                Query.equal("published", published),
                Query.equal("user_id", userId),
            ],
            100,
            0,
            "",
            "after",
            ["published"],
            ["DESC"]
        );
    },
    fetchPost: id => database.getDocument(postsCollection, id),
    deletePost: id => database.deleteDocument(postsCollection, id),
    createPost: async (data, userId, profileId) => {
        return database.createDocument(
            postsCollection,
            "unique()",
            data,
            ["role:all"],
            [`user:${userId}`]
        );
    },
    updatePost: async (id, data, userId) => {
        return database.updateDocument(
            postsCollection,
            id,
            data,
            ["role:all"],
            [`user:${userId}`]
        );
    },
    getAvatar: name => {
        return avatars.getInitials(name);
    },
};
