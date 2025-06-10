export default {
  "build": {
    "outDir": "dist-optimized/static",
    "rollupOptions": {
      "external": [
        "@solana/web3.js"
      ],
      "output": {
        "manualChunks": {
          "vendor": [
            "react",
            "react-dom"
          ],
          "ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu"
          ],
          "blockchain": [
            "@solana/web3.js",
            "@solana/spl-token"
          ]
        }
      }
    },
    "target": "es2020",
    "minify": "terser",
    "cssMinify": true,
    "reportCompressedSize": false
  }
}