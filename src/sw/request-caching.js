self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    var url = new URL(event.request.url);

    if(url.hostname == "push.superfeedr.com") {
      return event.respondWith(superfeedrRequest(event.request));
    }
    else if (url.hostname == 'www.google.com') {
      return event.respondWith(faviconRequest(event.request));
    }
  }
});

// For th favicon, let's store and *never* expire.
// This is probably not the right behavior tho!
function faviconRequest(request) {
  return cacheOrFetch(request);
}

// For Superfeedr requests.
// We try both the cache and the network and yield the first result.
function superfeedrRequest(request) {
  return Promise.race([fetchAndCache(request), cacheOrFetch(request)]);
}

function cacheOrFetch(request) {
  return caches.match(request).then(function(response) {
    if (response) {
      return response;
    }
    return fetchAndCache(request);
  });
}

function fetchAndCache(request) {
  return fetch(request).then(function(response) {

    caches.open('superfeedr-api').then(function(cache) {
      cache.put(request, response);
    });

    return response.clone();
  });
}