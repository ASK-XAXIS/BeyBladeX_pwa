// BEYBLADE X Manager - Service Worker
const CACHE_NAME = 'bx-manager-v4.1.1';
const STATIC_ASSETS = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-180.png',
];

// インストール：アイコン等の静的アセットだけキャッシュ
// index.htmlはキャッシュしない（常に最新を取得するため）
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(STATIC_ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// アクティベート：古いキャッシュを全削除
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// フェッチ：index.htmlは常にネットワークから取得（ネットワークファースト）
// アイコン等の静的ファイルはキャッシュファースト
self.addEventListener('fetch', function(event) {
  if (!event.request.url.startsWith('http')) return;

  var url = new URL(event.request.url);

  // index.html と / はネットワークファースト（常に最新を取得）
  if (url.pathname === '/' || url.pathname === '/index.html') {
    event.respondWith(
      fetch(event.request).then(function(response) {
        return response;
      }).catch(function() {
        // オフライン時のみキャッシュから返す
        return caches.match('/index.html');
      })
    );
    return;
  }

  // アイコン・manifest等はキャッシュファースト
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        if (response && response.status === 200 && response.type === 'basic') {
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(function() {
        return caches.match('/index.html');
      });
    })
  );
});
