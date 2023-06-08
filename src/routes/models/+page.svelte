<script>
  export let data;
</script>

<svelte:head>
  <title>Models</title>
</svelte:head>

<h1>Models</h1>

<pre>{JSON.stringify(data.models, null, 2)}</pre>
