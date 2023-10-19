<script>
  import { enhance } from "$app/forms";
  import { slide, fly } from "svelte/transition";
  export let form;
  const autorizedExtensions = [".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm"];

  let uploading = false;
  let summarizing = false;

  let timerStart;

  let filename = "";

  let formRef;
  let dialogRef;

  let selectedTab = "transcription";

  let errmessage = "";

  $: console.log(form);

  $: showTranscription = !uploading && form && form.upload && form.upload.success;
  $: showSummary = !summarizing && form && form.summarize && form.summarize.success;
</script>

<svelte:head>
  <title>Upload</title>
</svelte:head>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
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
      <span class="loading loading-infinity w-40" />
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
        <button disabled={uploading} on:click={() => (timerStart = Date.now())} type="submit" class="btn btn-primary h-auto">Upload</button>
      </div>
    </form>
  </section>

  {#if showTranscription}
    <section in:slide class="prose max-w-none py-3">
      <code>Transcription took {(Date.now() - timerStart) / 1000} seconds</code>
      <blockquote>"{filename}"</blockquote>

      {#if showSummary || summarizing}
        <div class="flex w-full m-auto justify-center">
          <div class="tabs tabs-boxed">
            <button on:click={() => (selectedTab = "transcription")} class={`tab text-lg ${selectedTab === "transcription" ? "tab-active" : ""}`}
              >Transcription</button
            >
            <button on:click={() => (selectedTab = "summary")} class={`tab text-lg ${selectedTab === "summary" ? "tab-active" : ""}`}>Summary</button>
          </div>
        </div>
      {/if}

      <div class="p-3 bg-stone-900 rounded-lg my-4">
        {#if summarizing}
          <progress class="progress w-56" />
          <progress class="progress w-56" />
          <progress class="progress w-56" />
        {/if}
        {selectedTab === "transcription" ? form.upload.transcription : form?.summarize?.summary ? form.summarize.summary : ""}
      </div>

      {#if showTranscription && !showSummary}
        <form
          in:fly
          method="POST"
          action="?/summarize"
          use:enhance={() => {
            summarizing = true;
            return async ({ update }) => {
              await update();
              summarizing = false;
            };
          }}
        >
          <input type="hidden" name="transcription" value={form.upload.transcription} />
          <button on:click={() => selectedTab = "summary"} type="submit" name="submit" class="toast btn-accent btn mr-8 mb-8">Summarize?</button>
        </form>
      {/if}
    </section>
  {/if}
{/if}
