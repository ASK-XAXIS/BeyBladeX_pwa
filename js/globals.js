/**
 * globals.js
 * グローバル変数・定数・DBデータ・初期化・保存関数・ユーティリティ
 */

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

/**
 * データの初期化(起動時にローカルストレージで保存されているデータを読み込む)
 */
var parts = JSON.parse(localStorage.getItem("bx_parts") || "[]");
var nextId = parseInt(localStorage.getItem("bx_nextId") || "1");
var decks = JSON.parse(localStorage.getItem("bx_decks") || "[]");
var nextDeckId = parseInt(localStorage.getItem("bx_nextDeckId") || "1");
var renameDeckId = null;
// ライバルカード一覧
var rivals = JSON.parse(localStorage.getItem("bx_rivals") || "[]");

//QRコードの読み取り
var qrStream = null; // カメラストリーム
var qrAnimFrame = null; // requestAnimationFrameのID
// 一時保存用変数（初期化部分に追加）
var pendingRivalData = null;

// パーツデータベース
var ALL_DB = [
  { name: "ドランソード", cat: "blade", line: "bx" },
  { name: "ヘルズサイズ", cat: "blade", line: "bx" },
  { name: "ウィザードアロー", cat: "blade", line: "bx" },
  { name: "ナイトシールド", cat: "blade", line: "bx" },
  { name: "コバルトドレイク", cat: "blade", line: "bx" },
  { name: "ナイトランス", cat: "blade", line: "bx" },
  { name: "シャークエッジ", cat: "blade", line: "bx" },
  { name: "レオンクロー", cat: "blade", line: "bx" },
  { name: "ヴァイパーテイル", cat: "blade", line: "bx" },
  { name: "ライノホーン", cat: "blade", line: "bx" },
  { name: "ドランダガー", cat: "blade", line: "bx" },
  { name: "ヘルズチェイン", cat: "blade", line: "bx" },
  { name: "フェニックスフェザー", cat: "blade", line: "bx" },
  { name: "フェニックスウイング", cat: "blade", line: "bx" },
  { name: "ワイバーンゲイル", cat: "blade", line: "bx" },
  { name: "ユニコーンスティング", cat: "blade", line: "bx" },
  { name: "スフィンクスカウル", cat: "blade", line: "bx" },
  { name: "ティラノビート", cat: "blade", line: "bx" },
  { name: "ヴァイスタイガー", cat: "blade", line: "bx" },
  { name: "コバルトドラグーン", cat: "blade", line: "bx" },
  { name: "ブラックシェル", cat: "blade", line: "bx" },
  { name: "ホエールウェーブ", cat: "blade", line: "bx" },
  { name: "ベアスクラッチ", cat: "blade", line: "bx" },
  { name: "クリムゾンガルーダ", cat: "blade", line: "bx" },
  { name: "プテラスウィング", cat: "blade", line: "bx" },
  { name: "シノビナイフ", cat: "blade", line: "bx" },
  { name: "シェルタードレイク", cat: "blade", line: "bx" },
  { name: "トリケラブレス", cat: "blade", line: "bx" },
  { name: "サムライカリバー", cat: "blade", line: "bx" },
  { name: "ティラノロア", cat: "blade", line: "bx" },
  { name: "ゴートタックル", cat: "blade", line: "bx" },
  { name: "シャークギル", cat: "blade", line: "bx" },
  { name: "ドランストライク", cat: "blade", line: "bx" },
  { name: "ヘブンズリング", cat: "blade", line: "bx" },
  { name: "ドランザースパイラル", cat: "blade", line: "bx" },
  { name: "マンモスタスク", cat: "blade", line: "bx" },
  { name: "クロコクランチ", cat: "blade", line: "bx" },
  { name: "サムライスチール", cat: "blade", line: "bx" },
  { name: "ドラグーンストーム", cat: "blade", line: "bx" },
  { name: "ドライガースラッシュ", cat: "blade", line: "bx" },
  { name: "ドラシエルシールド", cat: "blade", line: "bx" },
  { name: "ストームペガシス", cat: "blade", line: "bx" },
  { name: "(連打)ライトニングエルドラゴ", cat: "blade", line: "bx" },
  { name: "(アッパー)ライトニングエルドラゴ", cat: "blade", line: "bx" },
  { name: "ロックレオーネ", cat: "blade", line: "bx" },
  { name: "ビクトリーヴァルキリー", cat: "blade", line: "bx" },
  { name: "ゼノエクスカリバー", cat: "blade", line: "bx" },
  { name: "ストームスプリガン", cat: "blade", line: "bx" },
  { name: "アイアンマン", cat: "blade", line: "bx" },
  { name: "サノス", cat: "blade", line: "bx" },
  { name: "スパイダーマン", cat: "blade", line: "bx" },
  { name: "ヴェノム", cat: "blade", line: "bx" },
  { name: "ルーク・スカイウォーカー", cat: "blade", line: "bx" },
  { name: "ダースベイダー", cat: "blade", line: "bx" },
  { name: "マンダロリアン", cat: "blade", line: "bx" },
  { name: "モフ・ギデオン", cat: "blade", line: "bx" },
  { name: "オプティマスプライム", cat: "blade", line: "bx" },
  { name: "メガトロン", cat: "blade", line: "bx" },
  { name: "T-レックス", cat: "blade", line: "bx" },
  { name: "モササウルス", cat: "blade", line: "bx" },
  { name: "スピノサウルス", cat: "blade", line: "bx" },
  { name: "ケツァルコアトルス", cat: "blade", line: "bx" },
  { name: "トリケラスパイキー", cat: "blade", line: "bx" },
  { name: "ワイバーンホバー", cat: "blade", line: "ux" },
  { name: "ドランバスター", cat: "blade", line: "ux" },
  { name: "ヘルズハンマー", cat: "blade", line: "ux" },
  { name: "ウィザードロッド", cat: "blade", line: "ux" },
  { name: "シノビシャドウ", cat: "blade", line: "ux" },
  { name: "エアロペガサス", cat: "blade", line: "ux" },
  { name: "レオンクレスト", cat: "blade", line: "ux" },
  { name: "フェニックスラダー", cat: "blade", line: "ux" },
  { name: "シルバーウルフ", cat: "blade", line: "ux" },
  { name: "サムライセイバー", cat: "blade", line: "ux" },
  { name: "ナイトメイル", cat: "blade", line: "ux" },
  { name: "インパクトドレイク", cat: "blade", line: "ux" },
  { name: "ゴーストサークル", cat: "blade", line: "ux" },
  { name: "オロチクラスター", cat: "blade", line: "ux" },
  { name: "ゴーレムロック", cat: "blade", line: "ux" },
  { name: "スコーピオスビア", cat: "blade", line: "ux" },
  { name: "シャークスケイル", cat: "blade", line: "ux" },
  { name: "マミーカース", cat: "blade", line: "ux" },
  { name: "クロックミラージュ", cat: "blade", line: "ux", otype: true },
  { name: "メテオドラグーン", cat: "blade", line: "ux" },
  { name: "バレットグリフォン", cat: "blade", line: "ux" },
  { name: "ドラン", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ウィザード", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ペルセウス", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ヘルズ", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ライノ", cat: "blade", line: "cx", cxType: "lock" },
  { name: "フォックス", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ペガサス", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ケルベロス", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ホエール", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ソル", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ウルフ", cat: "blade", line: "cx", cxType: "lock" },
  { name: "フェニックス", cat: "blade", line: "cx", cxType: "lock" },
  { name: "バハムート", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ナイト", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ラグナ", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ユニコーン", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ワルキューレ", cat: "blade", line: "cx", cxType: "lock" },
  { name: "エンペラー", cat: "blade", line: "cx", cxType: "lock" },
  { name: "ブレイブ", cat: "blade", line: "cx", cxType: "main" },
  { name: "アーク", cat: "blade", line: "cx", cxType: "main" },
  { name: "ダーク", cat: "blade", line: "cx", cxType: "main" },
  { name: "リーバー", cat: "blade", line: "cx", cxType: "main" },
  { name: "ブラッシュ", cat: "blade", line: "cx", cxType: "main" },
  { name: "ブラスト", cat: "blade", line: "cx", cxType: "main" },
  { name: "フレイム", cat: "blade", line: "cx", cxType: "main" },
  { name: "ボルト", cat: "blade", line: "cx", cxType: "main" },
  { name: "ハント", cat: "blade", line: "cx", cxType: "main" },
  { name: "マイト", cat: "blade", line: "cx", cxType: "main" },
  { name: "フレア", cat: "blade", line: "cx", cxType: "main" },
  { name: "エクリプス", cat: "blade", line: "cx", cxType: "main" },
  { name: "B（ブレイク）", cat: "blade", line: "cx", cxType: "over" },
  { name: "G（ガード）", cat: "blade", line: "cx", cxType: "over" },
  { name: "F（フロー）", cat: "blade", line: "cx", cxType: "over" },
  { name: "P（ピーク）", cat: "blade", line: "cx", cxType: "over" },
  { name: "ブリッツ", cat: "blade", line: "cx", cxType: "metal" },
  { name: "フォートレス", cat: "blade", line: "cx", cxType: "metal" },
  { name: "レイジ", cat: "blade", line: "cx", cxType: "metal" },
  { name: "デルタ", cat: "blade", line: "cx", cxType: "metal" },
  { name: "S（スラッシュ）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "J（ジャギー）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "H（ヘビー）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "K（ナックル）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "O（オッド）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "R（ラウンド）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "B（バンパー）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "C（チャージ）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "A（アサルト）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "E（イレイズ）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "M（マッシブ）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "F（フリー）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "V（ヴァーチカル）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "T（ターン）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "D（デュアル）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "W（ウィール）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "Z（ジリオン）", cat: "blade", line: "cx", cxType: "assist" },
  { name: "0-60", cat: "ratchet", rtype: "normal" },
  { name: "0-70", cat: "ratchet", rtype: "normal" },
  { name: "0-80", cat: "ratchet", rtype: "normal" },
  { name: "1-50", cat: "ratchet", rtype: "normal" },
  { name: "1-60", cat: "ratchet", rtype: "normal" },
  { name: "1-70", cat: "ratchet", rtype: "normal" },
  { name: "1-80", cat: "ratchet", rtype: "normal" },
  { name: "2-60", cat: "ratchet", rtype: "normal" },
  { name: "2-70", cat: "ratchet", rtype: "normal" },
  { name: "2-80", cat: "ratchet", rtype: "normal" },
  { name: "3-60", cat: "ratchet", rtype: "normal" },
  { name: "3-70", cat: "ratchet", rtype: "normal" },
  { name: "3-80", cat: "ratchet", rtype: "normal" },
  { name: "4-50", cat: "ratchet", rtype: "normal" },
  { name: "4-60", cat: "ratchet", rtype: "normal" },
  { name: "4-70", cat: "ratchet", rtype: "normal" },
  { name: "4-80", cat: "ratchet", rtype: "normal" },
  { name: "5-60", cat: "ratchet", rtype: "normal" },
  { name: "5-70", cat: "ratchet", rtype: "normal" },
  { name: "5-80", cat: "ratchet", rtype: "normal" },
  { name: "6-60", cat: "ratchet", rtype: "normal" },
  { name: "6-70", cat: "ratchet", rtype: "normal" },
  { name: "6-80", cat: "ratchet", rtype: "normal" },
  { name: "7-60", cat: "ratchet", rtype: "normal" },
  { name: "7-70", cat: "ratchet", rtype: "normal" },
  { name: "7-80", cat: "ratchet", rtype: "normal" },
  { name: "8-70", cat: "ratchet", rtype: "normal" },
  { name: "9-60", cat: "ratchet", rtype: "normal" },
  { name: "9-70", cat: "ratchet", rtype: "normal" },
  { name: "9-80", cat: "ratchet", rtype: "normal" },
  { name: "4-55", cat: "ratchet", rtype: "otype" },
  { name: "7-55", cat: "ratchet", rtype: "otype" },
  { name: "9-65", cat: "ratchet", rtype: "otype" },
  { name: "3-85", cat: "ratchet", rtype: "otype" },
  { name: "M-85", cat: "ratchet", rtype: "otype" },
  { name: "F（フラット）", cat: "bit" },
  { name: "LF（ロウフラット）", cat: "bit" },
  { name: "R（ラッシュ）", cat: "bit" },
  { name: "GF（ギヤフラット）", cat: "bit" },
  { name: "A（アクセル）", cat: "bit" },
  { name: "Q（クエイク）", cat: "bit" },
  { name: "C（サイクロン）", cat: "bit" },
  { name: "L（レベル）", cat: "bit" },
  { name: "RA（ラバーアクセル）", cat: "bit" },
  { name: "LR（ロウラッシュ）", cat: "bit" },
  { name: "V（ボルテックス）", cat: "bit" },
  { name: "GR（ギアラッシュ）", cat: "bit" },
  { name: "UF（アンダーフラッ）", cat: "bit" },
  { name: "J（ジョルト）", cat: "bit" },
  { name: "I（イグニッション）", cat: "bit" },
  { name: "T（テーパー）", cat: "bit" },
  { name: "P（ポイント）", cat: "bit" },
  { name: "HT（ハイテーパー）", cat: "bit" },
  { name: "GP（ギヤポイント）", cat: "bit" },
  { name: "H（ヘキサ）", cat: "bit" },
  { name: "U（ユナイト）", cat: "bit" },
  { name: "E（エレベート）", cat: "bit" },
  { name: "TP（トランスポイント）", cat: "bit" },
  { name: "K（キック）", cat: "bit" },
  { name: "Z（ザップ）", cat: "bit" },
  { name: "M（マージ）", cat: "bit" },
  { name: "TK（トランスキック）", cat: "bit" },
  { name: "GU（ギヤユナイト）", cat: "bit" },
  { name: "B（ボール）", cat: "bit" },
  { name: "O（オーブ）", cat: "bit" },
  { name: "GB（ギヤボール）", cat: "bit" },
  { name: "DB（ディスクボール）", cat: "bit" },
  { name: "G（グライド）", cat: "bit" },
  { name: "FB（フリーボール）", cat: "bit" },
  { name: "LO（ローオーブ）", cat: "bit" },
  { name: "WB（ウォールボール）", cat: "bit" },
  { name: "Y（イールディング）", cat: "bit" },
  { name: "N（ニードル）", cat: "bit" },
  { name: "HN（ハイニードル）", cat: "bit" },
  { name: "S（スパイク）", cat: "bit" },
  { name: "GN（ギヤニードル）", cat: "bit" },
  { name: "MN（メタルニードル）", cat: "bit" },
  { name: "D（ドット）", cat: "bit" },
  { name: "BS（バウンドスパイク）", cat: "bit" },
  { name: "UN（アンダーニードル）", cat: "bit" },
  { name: "W（ウェッジ）", cat: "bit" },
  { name: "WW（ウォールウェッジ）", cat: "bit" },
  { name: "Tr（ターボ）", cat: "combo", combotype: "Tr" },
  { name: "Op（オペレート）", cat: "combo", combotype: "Op" },
];

/*各種定数*/
/*定数名={key:値}*/
var LINE = { bx: "BX", ux: "UX", cx: "CX" };
var CXLBL = {
  lock: "ロックチップ",
  main: "メインブレード",
  assist: "アシストブレード",
  metal: "メタルブレード",
  over: "オーバーブレード",
};
var CATLBL = {
  blade: "ブレード",
  ratchet: "ラチェット",
  bit: "ビット",
  combo: "一体型ビット",
};
var EMOJI = { blade: "⚔️", ratchet: "🔩", bit: "🔵", combo: "💠" };
var RTLBL = { normal: "通常", otype: "O型" };

// ============================================================
// グローバル変数
// ============================================================
var mainTab = "all",
  bladeSubTab = "all",
  cxSubTab = "lock";
var thumbTarget = null,
  thumbMap = {},
  cxAddPat = 3;
var rowCount = { bxux: 1, ratchet: 1, bit: 1, combo: 1 };
var deckMode = "owned",
  deckBladeLine = "bx",
  deckCxPat = 3;
var DS = {
  bladeLine: null,
  blade: null,
  lock: null,
  main: null,
  assist: null,
  metal: null,
  over: null,
  lock4: null,
  assist4: null,
  ratchet: null,
  bit: null,
  combo: null,
};
var userEditedName = false;
//画面切り替え時の一時保留用変数
var pendingNavTarget = null;

// テーマ・対戦・計測関連のグローバル変数
var themeMode = localStorage.getItem("bx_theme") || "system"; // 'system','dark','light'
var battleRecords = JSON.parse(
  localStorage.getItem("bx_battleRecords") || "[]"
);
var measureRecords = JSON.parse(
  localStorage.getItem("bx_measureRecords") || "{}"
);
var myRuleSetting = JSON.parse(
  localStorage.getItem("bx_myRule") ||
    JSON.stringify({ winPt: 4, deckCount: 1, noDupe: true })
);
var winCountMode = localStorage.getItem("bx_winCountMode") || "match"; // 'match' or 'battle'
var myPlayerName = localStorage.getItem("bx_playerName") || "自分";

// ============================================================
// 保存関数
// ============================================================
//ローカルストレージにライバルカード情報を保存
function saveRivals() {
  localStorage.setItem("bx_rivals", JSON.stringify(rivals));
}
//ローカルストレージにパーツ情報を保存
function saveParts() {
  localStorage.setItem("bx_parts", JSON.stringify(parts));
  localStorage.setItem("bx_nextId", nextId);
}
//ローカルストレージにデッキ情報を保存
function saveDecks() {
  localStorage.setItem("bx_decks", JSON.stringify(decks));
  localStorage.setItem("bx_nextDeckId", nextDeckId);
}
//ローカルストレージにバトル情報を保存
function saveBattleRecords() {
  localStorage.setItem("bx_battleRecords", JSON.stringify(battleRecords));
}
//ローカルストレージに計測した情報を保存
function saveMeasureRecords() {
  localStorage.setItem("bx_measureRecords", JSON.stringify(measureRecords));
}
//ローカルストレージにマイルールの情報を保存
function saveMyRule() {
  localStorage.setItem("bx_myRule", JSON.stringify(myRuleSetting));
}
//ローカルストレージにユーザーネーム情報を保存
function savePlayerName(v) {
  myPlayerName = v.trim() || "自分";
  localStorage.setItem("bx_playerName", myPlayerName);
}

// ============================================================
// ユーティリティ関数
// ============================================================
/**
 *dsInit()
 デッキセット初期化関数
 デッキセットにフィールドが増えた場合はココにも追加
 */
function dsInit() {
  DS = {
    bladeLine: null,
    cxPat: 3,
    blade: null,
    lock: null,
    main: null,
    assist: null,
    lock4: null,
    metal: null,
    over: null,
    assist4: null,
    ratchet: null,
    bit: null,
    combo: null,
  };
}
/**
 * showToast(msg, type)
 * 画面下部にトースト表示をする関数
 * @param {*} msg 表示するメッセージ文字列
 * @param {*} type 表示スタイル（省略可）
 * typeの種類：

type	見た目	使用場面
'ok'	緑系	成功時（「登録しました」など）
'warn'	黄色系	警告時
省略	デフォルト色	エラーや通常メッセージ
 */
function showToast(msg, type) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast " + (type || "");
  t.classList.add("show");
  setTimeout(function () {
    t.classList.remove("show");
  }, 2800);
}
/**
 * closeModal(id)
 * モーダルの非表示化（閉じるボタンや、戻るを押すときに必ず呼ぶ）
 * @param {*} id 閉じたいモーダルのID
 */
function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

function normalizeStr(s) {
  // ひらがな→カタカナ変換して比較
  return s
    .replace(/[ぁ-ゖ]/g, function (c) {
      return String.fromCharCode(c.charCodeAt(0) + 0x60);
    })
    .toLowerCase();
}

function fmtTime(ms) {
  var m = Math.floor(ms / 60000);
  var s = Math.floor((ms % 60000) / 1000);
  var cs = Math.floor((ms % 1000) / 10);
  return (
    (m > 0 ? m + ":" : "") +
    (m > 0 ? String(s).padStart(2, "0") : s) +
    "." +
    String(cs).padStart(2, "0")
  );
}
function fmtTimeSec(ms) {
  // 持久力表示用：秒単位（小数点以下2桁）
  return (ms / 1000).toFixed(2);
}
function fmtTimeDuration(ms) {
  // 持久力 XX.XX 秒 の形式で返す
  return "持久力 " + fmtTimeSec(ms) + " 秒";
}

function fmtTimeMinAndSec(sec) {
  var minute = (sec / 60).toFixed(0);
  if (minute < 1) {
    minute = 0;
    return "1分未満";
  }
  var second = (sec % 60).toFixed(0);
  return minute + " 分" + second + " 秒";
}

function getAllNames(d) {
  return [
    d.blade,
    d.lock,
    d.main,
    d.assist,
    d.lock4,
    d.metal,
    d.over,
    d.assist4,
    d.ratchet,
    d.bit,
    d.combo,
  ].filter(Boolean);
}
function getAllDSNames() {
  return [
    DS.blade,
    DS.lock,
    DS.main,
    DS.assist,
    DS.lock4,
    DS.metal,
    DS.over,
    DS.assist4,
    DS.ratchet,
    DS.bit,
    DS.combo,
  ].filter(Boolean);
}

// ページ離脱時の保険として保存
window.addEventListener("beforeunload", function () {
  saveParts();
  saveDecks();
});
