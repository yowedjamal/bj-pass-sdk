
# bj-pass-auth-widget (TypeScript)

Widget d’authentification OAuth2/OpenID Connect pour BjPass, converti en TypeScript avec sortie ESM + CJS + IIFE.

## Installation
```bash
npm i bj-pass-auth-widget
```

## Build local
```bash
npm install
npm run build
```

## Usage (bundlers)
```ts
import BjPassAuthWidget from "bj-pass-auth-widget";

const widget = new BjPassAuthWidget({
  environment: "test",
  clientId: "YOUR_CLIENT_ID",
  backendUrl: "https://your-backend.com",
});
```

## Usage (script tag)
```html
<script src="https://cdn.jsdelivr.net/npm/bj-pass-auth-widget/dist/index.global.js"></script>
<div id="w1" data-bjpass-widget='{"environment":"test","clientId":"YOUR_CLIENT_ID"}'></div>
<script>
  const w = new window.BjPassAuthWidget({
    ui: { container: "#w1" }
  });
</script>
```
