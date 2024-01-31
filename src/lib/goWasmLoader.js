export const loadGoWasm = async (path, go) => {
    const wasm = await WebAssembly.instantiateStreaming(fetch(path), go.importObject)
    return wasm.instance
}
