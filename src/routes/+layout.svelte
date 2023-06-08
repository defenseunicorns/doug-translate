<script>
  import "../app.css";
</script>

<div class="navbar bg-base-100">
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl">Doug Translate</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a href="/models">Models</a></li>
      <li><a href="/upload">Upload</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </div>
</div>
<slot />
