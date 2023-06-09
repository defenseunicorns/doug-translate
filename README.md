# doug-translate

Our innovative project combines SvelteKit, Tailwind CSS
with Daisy UI, the OpenAI JavaScript SDK, and Whisper
to create a web frontend that allows users to upload
audio files for accurate transcription and translation
into their preferred language.

With a seamless user experience and industry-leading
accuracy, we simplify communication and overcome language barriers with ease.

## Dev

```bash
# set LEAPFROGAI_BASE_URL in .env first
npm ci
npm run dev --open
```

## Bulding the Zarf Package

```bash
./hack/build.sh <leapfrog ai url>
```

## Running the Zarf Package

```bash
./hack/deploy.sh <leapfrog ai url>
```
