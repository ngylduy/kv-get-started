# README

This is the template for [KV Get Started](https://developers.cloudflare.com/kv/get-started/).

[![Deploy to Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/docs-examples/tree/main/kv/kv-get-started)

<!-- $ns = "d9e47617a5a540cdb907014940e609e0"
Get-ChildItem -Path "./public" -File | ForEach-Object {
  $key = $_.Name
  $path = $_.FullName
  Write-Host "Uploading $key from $path"
  npx wrangler kv key put "$key" --namespace-id="$ns" --path="$path" --remote
} -->