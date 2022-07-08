<script>
    import md from "snarkdown";
    import Loading from "../lib/Loading.svelte";
    import Author from "../lib/Author.svelte";
    import { api } from "../appwrite";

    export let params = {};

    let postFetch = api.fetchPost(params.slug);
</script>

{#await postFetch}
    <Loading />
{:then post}
    <h1>
        {post.title}
    </h1>
    <Author user={post.user_id} />
    {#if post.cover}
        <img class="cover" src={post.cover} alt={post.title} />
    {/if}
    <section class="content">
        {@html md(post.text)}
    </section>
    <h2>Comments</h2>
{/await}

<style>
    img.cover {
        width: 100%;
        border-radius: 0.5rem;
    }
    section.content {
        font-size: 1.1rem;
        line-height: 2rem;
    }
</style>
