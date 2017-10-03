importScripts('workbox-sw.prod.v2.0.3.js');

const workboxSW = new self.WorkboxSW();

workboxSW.router.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts'
}))

workboxSW.precache([
  {
    "url": "404.html",
    "revision": "0a27a4163254fc8fce870c8cc3a3f94f"
  },
  {
    "url": "favicon.ico",
    "revision": "2cab47d9e04d664d93c8d91aec59e812"
  },
  {
    "url": "index.html",
    "revision": "3ecd13951f774cd635ae049f51ae493b"
  },
  {
    "url": "manifest.json",
    "revision": "fd79ff6d7bb5110f7d9d8fda66b27e44"
  },
  {
    "url": "offline.html",
    "revision": "061ae2266c5c8b8a4c5e28a45efd8235"
  },
  {
    "url": "service-worker.js",
    "revision": "720b022dc43385ee376ffa0009ee20e1"
  },
  {
    "url": "src/css/app.css",
    "revision": "b664fe359aa85a4d346f51b0724475bd"
  },
  {
    "url": "src/css/feed.css",
    "revision": "5a4eb8f7ecd60c3b21c0922129f0cb24"
  },
  {
    "url": "src/css/help.css",
    "revision": "1c6d81b27c9d423bece9869b07a7bd73"
  },
  {
    "url": "src/js/app.js",
    "revision": "6ff90fdfd827366ff79fa4e9085b0098"
  },
  {
    "url": "src/js/feed.js",
    "revision": "8227f1d7a6c619c5e3c28ac243b06624"
  },
  {
    "url": "src/js/fetch.js",
    "revision": "6b82fbb55ae19be4935964ae8c338e92"
  },
  {
    "url": "src/js/idb.js",
    "revision": "017ced36d82bea1e08b08393361e354d"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  },
  {
    "url": "src/js/promise.js",
    "revision": "10c2238dcd105eb23f703ee53067417f"
  },
  {
    "url": "src/js/utility.js",
    "revision": "98fe20411a0b47e83606a033052eecb3"
  },
  {
    "url": "sw-base.js",
    "revision": "30968e8d029ae214cb0cf6f4da8d9b80"
  },
  {
    "url": "sw.js",
    "revision": "eec8885480b3bf680defcf8a5b52eac7"
  },
  {
    "url": "workbox-sw.prod.v2.0.3.js",
    "revision": "60b4da760c6a02cbbf5efc80c4da7090"
  },
  {
    "url": "src/images/main-image-lg.jpg",
    "revision": "31b19bffae4ea13ca0f2178ddb639403"
  },
  {
    "url": "src/images/main-image-sm.jpg",
    "revision": "c6bb733c2f39c60e3c139f814d2d14bb"
  },
  {
    "url": "src/images/main-image.jpg",
    "revision": "5c66d091b0dc200e8e89e56c589821fb"
  },
  {
    "url": "src/images/sf-boat.jpg",
    "revision": "0f282d64b0fb306daf12050e812d6a19"
  }
]);