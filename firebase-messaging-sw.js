/* Notifications push du Planning Ostéo (Firebase Cloud Messaging) */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: 'AIzaSyCczcHZ8EFsnVpxrq9iUpXacZP9HaP6Ffc',
  authDomain: 'osteo-159a0.firebaseapp.com',
  projectId: 'osteo-159a0',
  storageBucket: 'osteo-159a0.firebasestorage.app',
  messagingSenderId: '1078783269394',
  appId: '1:1078783269394:web:b41b4c9acccaa7a03096cb'
});
/* les messages « notification » sont affichés par le navigateur ; on ouvre l'appli au toucher */
firebase.messaging();
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type: 'window', includeUncontrolled: true}).then(l => {
    for (const c of l) if ('focus' in c) return c.focus();
    return clients.openWindow('./');
  }));
});

/* ---- mode hors ligne : la page et les bibliothèques sont gardées en mémoire ---- */
const CACHE = 'planning-v1';
const HOSTS = ['www.gstatic.com', 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const u = new URL(req.url);
  const same = u.origin === self.location.origin;
  if (!same && !HOSTS.includes(u.hostname)) return;   /* base de données, Google Sheets… : jamais touchés */
  if (same && /firebase-messaging-sw\.js$/.test(u.pathname)) return;
  const key = same ? u.origin + u.pathname : req.url;  /* la page est gardée sous une seule clé, quel que soit ?v= ou ?_= */
  if (same) {
    /* page de l'appli : le réseau d'abord (version à jour), la mémoire si pas de réseau */
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      try {
        const r = await Promise.race([fetch(new Request(req, {cache: 'no-cache'})), new Promise((_, rej) => setTimeout(() => rej(new Error('lent')), 6000))]);
        if (r && r.ok) c.put(key, r.clone());
        return r;
      } catch (err) {
        const hit = await c.match(key) || (req.mode === 'navigate' ? await c.match(u.origin + u.pathname.replace(/[^/]*$/, '')) || await c.match(u.origin + u.pathname.replace(/[^/]*$/, '') + 'index.html') : null);
        if (hit) return hit;
        throw err;
      }
    })());
    return;
  }
  /* bibliothèques (versions figées) : la mémoire d'abord, mise à jour en arrière-plan */
  e.respondWith((async () => {
    const c = await caches.open(CACHE), hit = await c.match(key);
    const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(key, r.clone()); return r; }).catch(() => null);
    return hit || (await net) || Response.error();
  })());
});
