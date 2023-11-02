<script lang="ts">
  import { onMount } from "svelte";

  export let title: string;
  // TODO: figure out the best type to put here
  export let content: any;
  // TODO: figure out what type this is
  export let fileOptions: any;

  let isSupported = true;

  async function getNewFileHandle(): Promise<FileSystemFileHandle> {
    const options = fileOptions;

    // @ts-ignore
    const handle = await window.showSaveFilePicker(options);
    return handle;
  }

  async function writeFile(fileHandle: FileSystemFileHandle, contents: FileSystemWriteChunkType) {
    // Create a FileSystemWritableFileStream to write to.
    const writable: FileSystemWritableFileStream = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
  }

  const save = () => {
    getNewFileHandle().then((handle) => {
      writeFile(handle, content).then(() => {
        console.log(handle.name + " saved!");
      });
    });
  };

  onMount(() => {
    // @ts-ignore
    if (!window.showSaveFilePicker) {
      isSupported = false;
    }
  });
</script>

{#if isSupported === false}
  <a
    href={URL.createObjectURL(new Blob([content], { type: "text/plain" }))}
    download={fileOptions.suggestedName}
    class="btn btn-outline"
    role="button"
  >
    {title}
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg></a
  >
{:else}
  <button on:click={save} class="btn btn-outline">
    {title}
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  </button>
{/if}
