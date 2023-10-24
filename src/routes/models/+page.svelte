<script lang="ts">
  import { slide } from "svelte/transition";
  import type { Model } from "openai/resources";
  export let data;
  let selectedModel: Model | undefined;
  let models: Model[] = [];
  const changeSelection = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.value) return;
    selectedModel = models.find((model) => model.id === target.value);
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
