<script>
  const autorizedExtensions = [".mp3", ".m4a", ".wav", ".ogg"];
  let uploading = false;
</script>

<svelte:head>
  <title>Upload</title>
</svelte:head>

<form
  method="post"
  use:enhance={() => {
    uploading = true;
    return async ({ update }) => {
      await update();
      uploading = false;
    };
  }}
  enctype="multipart/form-data"
  class="flex flex-col"
>
  <input
    name="audioUpload"
    accept={autorizedExtensions.join(",")}
    required
    type="file"
    class="file-input file-input-bordered file-input-lg w-full max-w-xs"
  />

  <button disabled={uploading} type="submit" class="btn btn-primary mt-4">Upload</button>
</form>
