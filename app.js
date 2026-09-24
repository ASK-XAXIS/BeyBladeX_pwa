/**
 * app.js
 * アプリの起動処理のみ
 */

renderHome();
showScreen("home");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("sw.js")
      .then(function (reg) {
        console.log("SW registered:", reg.scope);
      })
      .catch(function (err) {
        console.log("SW registration failed:", err);
      });
  });
}
if (window.navigator.standalone) {
  document.body.style.paddingTop = "env(safe-area-inset-top)";
}
