# doug-translate

![Screenshot](./.github/screenshot.png)

## Dev

```bash
# set LEAPFROGAI_BASE_URL in .env first
npm ci
npm run dev --open
```

## Bulding the Zarf Packages

```bash
./hack/build.sh
```

## Running the Zarf Packages

```bash
./hack/deploy-amd64.sh <leapfrog ai url> <istio domain>
```
