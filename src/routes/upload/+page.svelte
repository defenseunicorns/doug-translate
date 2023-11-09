<script lang="ts">
  import { enhance } from "$app/forms";
  import DownloadText from "$lib/components/download-text.svelte";
  import { slide, fly } from "svelte/transition";
  export let form;

  let uploading = false;
  let summarizing = false;

  let timerStart: number;

  let formRef: HTMLFormElement;
  let dialogRef: HTMLDialogElement;

  let selectedTab = "transcript";

  let err: Error | null = null;

  const autorizedExtensions = [".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm"];
  let filename = "";
  const upload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;
    const file = target.files[0];
    if (!file) return;
    // this is from BODY_SIZE_LIMIT in the dockerfile
    if (file.size > 65540000) {
      err = new Error("File size must be less than 500MB");
      dialogRef.showModal();
    }
    filename = file.name;
  };

  $: showTranscript = !uploading && form && form.upload && form.upload.success;
  $: showSummary = !summarizing && form && form.summarize && form.summarize.success;

  $: transcript = form?.upload?.transcript;
  $: name = form?.upload?.name;
  $: summary = form?.summarize?.summary;
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
      err = null;
    }
  }}
>
  <form
    method="dialog"
    class="modal-box"
    on:submit={() => {
      formRef.reset();
      err = null;
    }}
  >
    <h3 class="font-bold text-lg">Uh Oh!</h3>
    <p class="py-4">{err?.message}</p>
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
          on:input={upload}
        />
        <button disabled={uploading} on:click={() => (timerStart = Date.now())} type="submit" class="btn btn-primary btn-outline h-auto"
          >Upload <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </button>
      </div>
    </form>
  </section>

  {#if showTranscript}
    <section in:slide class="prose max-w-none py-3">
      <code>Transcription took {(Date.now() - timerStart) / 1000} seconds</code>
      <blockquote>"{filename}"</blockquote>

      {#if showSummary || summarizing}
        <div class="flex w-full m-auto justify-center">
          <div class="tabs tabs-boxed">
            <button on:click={() => (selectedTab = "transcript")} class={`tab text-lg ${selectedTab === "transcript" ? "tab-active" : ""}`}
              >Transcript</button
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
        {#if selectedTab === "transcript"}
          <div class="w-full flex justify-end">
            <DownloadText title="Download Transcript" content={String(transcript)} name={name + "-transcript.txt"} />
          </div>
          {transcript}
        {:else if selectedTab === "summary" && summary}
          <div class="w-full flex justify-end">
            <DownloadText title="Download Summary" content={summary} name={name + "-summary.txt"} />
          </div>
          {summary}
        {:else}
          {""}
        {/if}
      </div>

      {#if showTranscript && !showSummary}
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
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="transcription" value={transcript} />
          <button on:click={() => (selectedTab = "summary")} type="submit" name="submit" class="toast btn-accent btn mr-8 mb-8">Summarize?</button>
        </form>
      {/if}
    </section>
  {/if}
{/if}
