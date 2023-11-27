<script lang="ts">
  import "../app.css";
  import "@fontsource/pt-sans";
  import "@fontsource/pt-mono";
  import ThemeSwitcher from "$lib/components/theme-switcher.svelte";
</script>

<nav class="navbar bg-base-100 fixed backdrop-blur-md bg-transparent">
  <div class="flex-1">
    <a href="/" class="btn btn-ghost normal-case text-xl">LF Transcribe</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a href="/upload">Upload</a></li>
      <li><a href="/help">Help</a></li>
      <li><ThemeSwitcher /></li>
    </ul>
  </div>
</nav>
<main class="flex justify-center pt-20">
  <div class="md:w-8/12 sm:w-full lg:w-8/12 m-auto">
    <slot />
  </div>
</main>
<footer class="fixed bottom-0 footer footer-center p-4 bg-base-300 text-base-content">
  <aside>
    <p>Powered by Defense Unicorns</p>
  </aside>
</footer>
