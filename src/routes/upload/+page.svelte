<script>
  import { enhance } from "$app/forms";
  import { ISO_639_1 } from "$lib/iso";

  const autorizedExtensions = [".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm"];
  let uploading = false;
  export let form;
  let start;
  const startTimer = () => {
    start = Date.now();
  };
  let filename = "";
  let formRef;
  let dialogRef;
  let errmessage = "";
</script>

<svelte:head>
  <title>Upload</title>
</svelte:head>

<dialog
  bind:this={dialogRef}
  class="modal"
  on:keydown={(event) => {
    if (event.key === "Escape") {
      formRef.reset();
      errmessage = "";
    }
  }}
>
  <form
    method="dialog"
    class="modal-box"
    on:submit={() => {
      formRef.reset();
      errmessage = "";
    }}
  >
    <h3 class="font-bold text-lg">Uh Oh!</h3>
    <p class="py-4">{errmessage}</p>
    <div class="modal-action">
      <button class="btn">Close</button>
    </div>
  </form>
</dialog>

{#if uploading}
  <div class="hero min-h-screen">
    <div class="hero-content flex flex-col gap-6 prose">
      <span class="loading loading-spinner w-40" />
      <span class="uppercase text-2xl">processing "{filename.trim()}"</span>
    </div>
  </div>
{:else}
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
      class="flex flex-col gap-4"
      action="?/upload"
      bind:this={formRef}
    >
      <select required name="input-language" class="select select-accent w-full max-w-">
        <option disabled selected value="auto">Select an input language (auto detected by default)</option>
        {#each Object.keys(ISO_639_1) as k}
          <option value={ISO_639_1[k]}>{k}</option>
        {/each}
      </select>
      <div class="flex flex-row gap-2">
        <input
          name="audioUpload"
          accept={autorizedExtensions.join(",")}
          required
          type="file"
          class="file-input file-input-accent file-input-lg w-full"
          on:input={(event) => {
            const file = event.target.files[0];
            filename = file.name;
            // this is from BODY_SIZE_LIMIT in the dockerfile
            if (file.size > 65540000) {
              errmessage = "File size must be less than 500MB";
              dialogRef.showModal();
            }
          }}
        />
        <button disabled={uploading} on:click={startTimer} type="submit" class="btn btn-primary h-auto">Upload</button>
      </div>
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
{/if}
