// Birria Express · Recibe las notificaciones aunque la app esté cerrada
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { mensaje: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.titulo || "Birria Express", {
    body: d.mensaje || "",
    icon: "icon-192.png",
    badge: "icon-192.png",
    data: { url: d.url || "./" },
  }));
});

// Al tocar la notificación se abre la app (o se trae al frente si ya estaba abierta)
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ventanas) => {
    for (const v of ventanas) if (v.url.startsWith(self.registration.scope) && "focus" in v) return v.focus();
    return self.clients.openWindow(url);
  }));
});
