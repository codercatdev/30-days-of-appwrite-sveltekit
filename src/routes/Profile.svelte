<script>
    import Loading from "../lib/Loading.svelte";

    import { api } from "../appwrite";
    import { state } from "../store";
    import Preview from "../lib/Preview.svelte";
    import MyPost from "../lib/MyPost.svelte";

    export let params = {};

    const fetchUser = () => api.fetchUser(params.id);
    const fetchPosts = () =>
        api.fetchUserPosts(params.id).then(r => r.documents);
    const fetchDrafts = () =>
        api.fetchUserPosts(params.id, false).then(r => r.documents);
    let all = Promise.all([fetchUser(), fetchPosts(), fetchDrafts()]);
</script>

<section>
    {#await all}
        <Loading />
    {:then [author, posts, drafts]}
        <section class="author">
            <h3>{author.name}</h3>
        </section>
        {#if $state?.user?.$id == params.id}
            <h1>My Posts</h1>
            <p><a class="button" href="/#/create">Create</a></p>
            <section class="my-post">
                {#each posts as post}
                    <MyPost
                        on:deleted={() => {
                            all = Promise.all([
                                fetchUser(),
                                fetchPosts(),
                                fetchDrafts(),
                            ]);
                            console.log("deleted");
                        }}
                        {post} />
                {/each}
                {#each drafts as draft}
                    <MyPost
                        on:deleted={() => {
                            all = Promise.all([
                                fetchUser(),
                                fetchPosts(),
                                fetchDrafts(),
                            ]);
                            console.log("deleted");
                        }}
                        {draft} />
                {/each}
            </section>
        {:else}
            <h1>Latest Posts</h1>
            <section class="latest">
                {#each posts as post}
                    <Preview {post} />
                {/each}
            </section>
        {/if}
    {:catch error}
        {error}
        <p>
            Public profile not found
            <a href="/profile/create">Create Public Profile</a>
        </p>
    {/await}
</section>

<style>
    section.author {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    section.latest {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: auto;
        align-content: start;
        gap: 1rem;
    }
    section.my-post {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: auto;
        align-content: start;
        gap: 0.5rem;
    }
    a {
        border: none;
        padding: 10px;
        color: white;
        font-weight: bold;
    }
    a:hover {
        text-decoration: underline;
    }
</style>
