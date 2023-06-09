<script>
  import "../app.css";
  import "@fontsource-variable/recursive/mono.css";
  import "@fontsource/pt-mono";
</script>

<nav class="navbar bg-base-100 fixed backdrop-blur-md bg-transparent">
  <div class="flex-1">
    <a href="/" class="btn btn-ghost normal-case text-xl">Doug Translate</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a href="/models">Models</a></li>
      <li><a href="/upload">Upload</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </div>
</nav>
<main class="flex justify-center pt-20">
  <div class="md:w-8/12 sm:w-full lg:w-8/12 m-auto">
    <slot />
  </div>
</main>
