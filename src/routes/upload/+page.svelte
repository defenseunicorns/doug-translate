<script>
  import { enhance } from "$app/forms";
  const autorizedExtensions = [".mp3", ".m4a", ".wav", ".ogg"];
  let uploading = false;
  export let form;
  let start;
  const startTimer = () => {
    start = Date.now();
  };
</script>

<svelte:head>
  <title>Upload</title>
</svelte:head>

<div>
  <section class="py-3">
    <form
      method="POST"
      use:enhance={() => {
        uploading = true;
        return async ({ update }) => {
          await update();
          uploading = false;
        };
      }}
      enctype="multipart/form-data"
      class="flex flex-col"
      action="?/upload"
    >
      <input
        name="audioUpload"
        accept={autorizedExtensions.join(",")}
        required
        type="file"
        class="file-input file-input-bordered file-input-lg w-full"
      />

      {#if uploading}
        <button disabled class="btn btn-primary mt-4">
          <span class="loading loading-spinner" />
          processing
        </button>
      {:else}
        <button on:click={startTimer} type="submit" class="btn btn-primary mt-4">Upload</button>
      {/if}
    </form>
  </section>

  {#if form && !uploading}
    <section class="prose py-3">
      <code>Translation took {(Date.now() - start) / 1000} seconds</code>
      <blockquote>"{form.fileName}"</blockquote>
      <div class="p-3 bg-stone-900 rounded-lg">
        {form.text}
      </div>
    </section>
  {/if}
</div>
