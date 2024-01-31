<script>
  import { loadGoWasm } from "$lib/goWasmLoader";
  import init, { run_collatz } from "rust-wasm";

  const runJSCollatz = () => {
    const collatzSequence = (n) => {
      const sequence = [n];
      while (n !== 1) {
        if (n % 2 === 0) {
          n /= 2;
        } else {
          n = 3 * n + 1;
        }
        sequence.push(n);
      }
      return sequence;
    };

    console.time("JS Collatz");
    for (let i = 1; i <= 1000000; i++) {
      collatzSequence(i);
    }
    console.timeEnd("JS Collatz");
  };

  const runRustCollatz = async () => {
    console.time("Rust Collatz");
    await init();
    run_collatz();
    console.timeEnd("Rust Collatz");
  };

  const runGoWasmCollatz = async () => {
    console.time("Wasm Collatz");
    const go = new Go();
    const wasmInstance = await loadGoWasm("collatz.wasm", go);
    if (!wasmInstance) throw new Error("WASM not loaded");
    go.run(wasmInstance);
    console.timeEnd("Wasm Collatz");
  };
</script>

<svelte:head>
  <title>Help</title>
</svelte:head>

<section class="prose mx-auto">
  <h2>Help & Contact</h2>
  <blockquote>ai@defenseunicorns.com</blockquote>
  <p>Defense Unicorns is committed to building products that truly benefit our mission heroes.</p>
  <p>
    If you have any suggestions or recommendations for improving your experience with our products,
    or if you encounter any issues, roadblocks, or concerns, please do not hesitate to reach out to
    the email above.
  </p>

  <button on:click={runGoWasmCollatz} class="btn btn-primary">Run Go Wasm Collatz</button>
  <button on:click={runRustCollatz} class="btn btn-primary ml-6">Run Rust Wasm Collatz</button>
  <button on:click={runJSCollatz} class="btn btn-primary ml-6">Run JS Collatz</button>
</section>
