<script lang="ts">
  import { slide } from "svelte/transition";
  export let data;
  let selectedModel;
  let models;
  const changeSelection = (event) => {
    selectedModel = models.find((model) => model.id === event.target.value);
  };
  $: models = data.models;
</script>

<svelte:head>
  <title>Models</title>
</svelte:head>

<section class="prose">
  <h1>Models</h1>
  <div class="flex flex-col gap-4">
    <select on:change={changeSelection} class="select select-accent w-full max-w-xs">
      <option disabled selected>Select a model to learn more</option>
      {#each models as model}
        <option value={model.id}>{model.id}</option>
      {/each}
    </select>
    {#if selectedModel}
      <pre in:slide>{JSON.stringify(selectedModel, null, 2)}</pre>
    {/if}
  </div>
</section>
