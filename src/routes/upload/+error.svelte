<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="hero min-h-screen -mt-20">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">{":|"}</h1>
      <p class="py-6">Error: {$page.error?.message ?? "Unknown"}</p>
      <a href="/upload"><button class="btn btn-info">Try Again</button></a>
    </div>
  </div>
</div>
