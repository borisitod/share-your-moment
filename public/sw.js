importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

var CACHE_STATIC_NAME = 'static-v24';
var CACHE_DYNAMIC_NAME = 'dynamic-v8';
var STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
    '/src/js/app.js',
    '/src/js/feed.js',
    '/src/js/idb.js',
    '/src/js/promise.js',
    '/src/js/fetch.js ',
    '/src/js/material.min.js',
    '/src/css/app.css',
    '/src/css/feed.css',
    '/src/images/main-image.jpg',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];

// function trimCache(cacheName, maxItems){
//     caches.open(cacheName)
//         .then(function (cache) {
//            return cache.keys()
//                .then(function (keys) {
//                    if (keys.length > maxItems) {
//                        cache.delete(keys[0])
//                            .then(trimCache(cacheName, maxItems))
//                    }
//                });
//         })
// }


self.addEventListener('install', function (event) {
    console.log('[Service Worker] Innstalling the Service Worker', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function (cache) {
                console.log('[Service Worker] Prechaing App Shell');
                cache.addAll(STATIC_FILES);
            })
    )
});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating the Service Worker', event);
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        console.log('[Service Worker] Removing old cache.', key);
                        return caches.delete(key);
                    }
                }))
            })
    );
    return self.clients.claim();
});

function isInArray(string, array) {
    var cachePath;
    if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
        console.log('matched ', string);
        cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
    } else {
        cachePath = string; // store the full request (for CDNs)
    }
    return array.indexOf(cachePath) > -1;
}

self.addEventListener('fetch', function (event) {
    var url = 'https://pwagram-49076.firebaseio.com/posts';

    if (event.request.url.indexOf(url) > -1) {
        event.respondWith(fetch(event.request)
            .then(function (res) {
                var clonedRes = res.clone();
                clearAllData('posts')
                    .then(function () {
                        return clonedRes.json()
                    })
                    .then(function (data) {
                        for (var key in data) {
                            writeData('posts', data[key])
                        }
                    })
                return res;
            })
        );
    } else if (isInArray(event.request.url, STATIC_FILES)) {
        event.respondWith(
            caches.match(event.request)
        )
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                    if (response) {
                        return response;
                    } else {
                        return fetch(event.request)
                            .then(function (res) {
                                return caches.open(CACHE_DYNAMIC_NAME)
                                    .then(function (cache) {
                                        //trimCache(CACHE_DYNAMIC_NAME, 3)
                                        cache.put(event.request.url, res.clone());
                                        return res;
                                    })
                            })
                            .catch(function (err) {
                                return caches.open(CACHE_STATIC_NAME)
                                    .then(function (cache) {
                                        if (event.request.header.get('accept').includes('text/html')) {
                                            return cache.match('/offline.html');
                                        }
                                    });
                            });
                    }
                })
        );
    }
})

self.addEventListener('sync', function (event) {
    console.log('[ServiceWorker] Background syncing!', event);
    if (event.tag === 'sync-new-posts') {
        console.log('[ServiceWorker] Syncing new Posts');
        event.waitUntil(
            readAllData('sync-posts')
                .then(function (data) {
                    for (var dt of data) {
                        fetch('https://us-central1-pwagram-49076.cloudfunctions.net/storePostData', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: dt.id,
                                title: dt.title,
                                location: dt.location,
                                image: 'https://firebasestorage.googleapis.com/v0/b' +
                                '/pwagram-49076.appspot.com/o/Uptown%20Melbourn%20AU%20from%20ship.jpg?alt=media&token=c10de4f1-fd50-43e4-a762-cf2d44b36d33'
                            })
                        })
                        .then(function (res) {
                            console.log('Send data', res);
                            if (res.ok) {
                                res.json()
                                    .then(function (resData) {
                                        deleteItemFromData('sync-posts', resData.id);
                                    })
                            }
                        })
                        .catch(function (err) {
                            console.log('Error while sending data', err);
                        })
                    }
                })
        )

    }
})