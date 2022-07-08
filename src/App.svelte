<script>
    import Router from "svelte-spa-router";
    import Navigation from "./lib/Navigation.svelte";
    import Index from "./routes/Index.svelte";
    import Login from "./routes/Login.svelte";
    import NotFound from "./routes/NotFound.svelte";
    import Register from "./routes/Register.svelte";
    import VerifyEmail from "./routes/VerifyEmail.svelte";
    import ResetPassword from "./routes/ResetPassword.svelte";
    import Team from "./routes/Team.svelte";
    import Teams from "./routes/Teams.svelte";
    import AcceptMembership from "./routes/AcceptMembership.svelte";
    import CreateProfile from "./routes/CreateProfile.svelte";
    import Profile from "./routes/Profile.svelte";
    import Post from "./routes/Post.svelte";
    import Create from "./routes/Create.svelte";

    const routes = {
        "/": Index,
        "/login": Login,
        "/register": Register,
        "/resetPassword": ResetPassword,
        "/verifyEmail": VerifyEmail,
        "/profile/create": CreateProfile, // Add this component
        "/profile/:id/teams": Teams,
        "/profile/:id": Profile,
        "/team/:id": Team,
        "/acceptMembership": AcceptMembership,
        "/create": Create,
        "/post/:slug": Post,
        "/post/:slug/edit": Create,
        "*": NotFound,
    };
</script>

<main>
    <Navigation />
    <div class="content">
        <Router {routes} />
    </div>
</main>

<style>
    :root {
        font-family: "Poppins", sans-serif;
        background-color: rgb(228, 228, 228);
    }

    :global(a) {
        color: inherit;
        text-decoration: none;
    }
    :global(a):visited {
        color: inherit;
        text-decoration: none;
    }

    main {
        display: grid;
        max-width: 960px;
        margin: auto;
        grid-template-columns: 1fr;
        grid-template-rows: 4em 1fr;
        grid-template-areas:
            "navigation"
            "content";
    }

    .content {
        grid-area: content;
        display: flex;
        flex-direction: column;
    }
</style>
