// デッキ作成
var deckMode = "owned";
// DS ->デッキセット：選択中のデッキの情報
var DS = {
  bladeLine: null, // 'bx','ux','cx'各ラインの種別
  cxPat: 3, // 3 or 4　cxラインの場合3ピース型か4ピース型のどっちか
  blade: null, // BX/UXラインはブレードの名前そのまま
  lock: null,
  main: null,
  assist: null, // CXラインの3ピースの各ピースの名前
  lock4: null,
  metal: null,
  over: null,
  assist4: null, // CXラインの４ピースの各ピースの名前
  ratchet: null, //ラチェット名
  bit: null, //ビット名
  combo: null, //ラチェット+ビット1体型
};
var userEditedName = false;

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
