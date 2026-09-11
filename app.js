/**
    * データの初期化
    */
var parts = JSON.parse(localStorage.getItem('bx_parts') || '[]');
var nextId = parseInt(localStorage.getItem('bx_nextId') || '1');
var decks = JSON.parse(localStorage.getItem('bx_decks') || '[]');
var nextDeckId = parseInt(localStorage.getItem('bx_nextDeckId') || '1');
var renameDeckId = null;
// ライバルカード一覧
var rivals = JSON.parse(localStorage.getItem('bx_rivals') || '[]');
function saveRivals() {
    localStorage.setItem('bx_rivals', JSON.stringify(rivals));
}

// パーツデータベース
var ALL_DB = [
    { name: 'ドランソード', cat: 'blade', line: 'bx' },
    { name: 'ヘルズサイズ', cat: 'blade', line: 'bx' },
    { name: 'ウィザードアロー', cat: 'blade', line: 'bx' },
    { name: 'ナイトシールド', cat: 'blade', line: 'bx' },
    { name: 'コバルトドレイク', cat: 'blade', line: 'bx' },
    { name: 'ナイトランス', cat: 'blade', line: 'bx' },
    { name: 'シャークエッジ', cat: 'blade', line: 'bx' },
    { name: 'レオンクロー', cat: 'blade', line: 'bx' },
    { name: 'ヴァイパーテイル', cat: 'blade', line: 'bx' },
    { name: 'ライノホーン', cat: 'blade', line: 'bx' },
    { name: 'ドランダガー', cat: 'blade', line: 'bx' },
    { name: 'ヘルズチェイン', cat: 'blade', line: 'bx' },
    { name: 'フェニックスフェザー', cat: 'blade', line: 'bx' },
    { name: 'フェニックスウイング', cat: 'blade', line: 'bx' },
    { name: 'ワイバーンゲイル', cat: 'blade', line: 'bx' },
    { name: 'ユニコーンスティング', cat: 'blade', line: 'bx' },
    { name: 'スフィンクスカウル', cat: 'blade', line: 'bx' },
    { name: 'ティラノビート', cat: 'blade', line: 'bx' },
    { name: 'ヴァイスタイガー', cat: 'blade', line: 'bx' },
    { name: 'コバルトドラグーン', cat: 'blade', line: 'bx' },
    { name: 'ブラックシェル', cat: 'blade', line: 'bx' },
    { name: 'ホエールウェーブ', cat: 'blade', line: 'bx' },
    { name: 'ベアスクラッチ', cat: 'blade', line: 'bx' },
    { name: 'クリムゾンガルーダ', cat: 'blade', line: 'bx' },
    { name: 'プテラスウィング', cat: 'blade', line: 'bx' },
    { name: 'シノビナイフ', cat: 'blade', line: 'bx' },
    { name: 'シェルタードレイク', cat: 'blade', line: 'bx' },
    { name: 'トリケラブレス', cat: 'blade', line: 'bx' },
    { name: 'サムライカリバー', cat: 'blade', line: 'bx' },
    { name: 'ティラノロア', cat: 'blade', line: 'bx' },
    { name: 'ゴートタックル', cat: 'blade', line: 'bx' },
    { name: 'シャークギル', cat: 'blade', line: 'bx' },
    { name: 'ドランストライク', cat: 'blade', line: 'bx' },
    { name: 'ヘブンズリング', cat: 'blade', line: 'bx' },
    { name: 'ドランザースパイラル', cat: 'blade', line: 'bx' },
    { name: 'マンモスタスク', cat: 'blade', line: 'bx' },
    { name: 'クロコクランチ', cat: 'blade', line: 'bx' },
    { name: 'サムライスチール', cat: 'blade', line: 'bx' },
    { name: 'ドラグーンストーム', cat: 'blade', line: 'bx' },
    { name: 'ドライガースラッシュ', cat: 'blade', line: 'bx' },
    { name: 'ドラシエルシールド', cat: 'blade', line: 'bx' },
    { name: 'ストームペガシス', cat: 'blade', line: 'bx' },
    { name: '(連打)ライトニングエルドラゴ', cat: 'blade', line: 'bx' },
    { name: '(アッパー)ライトニングエルドラゴ', cat: 'blade', line: 'bx' },
    { name: 'ロックレオーネ', cat: 'blade', line: 'bx' },
    { name: 'ビクトリーヴァルキリー', cat: 'blade', line: 'bx' },
    { name: 'ゼノエクスカリバー', cat: 'blade', line: 'bx' },
    { name: 'ストームスプリガン', cat: 'blade', line: 'bx' },
    { name: 'アイアンマン', cat: 'blade', line: 'bx' },
    { name: 'サノス', cat: 'blade', line: 'bx' },
    { name: 'スパイダーマン', cat: 'blade', line: 'bx' },
    { name: 'ヴェノム', cat: 'blade', line: 'bx' },
    { name: 'ルーク・スカイウォーカー', cat: 'blade', line: 'bx' },
    { name: 'ダースベイダー', cat: 'blade', line: 'bx' },
    { name: 'マンダロリアン', cat: 'blade', line: 'bx' },
    { name: 'モフ・ギデオン', cat: 'blade', line: 'bx' },
    { name: 'オプティマスプライム', cat: 'blade', line: 'bx' },
    { name: 'メガトロン', cat: 'blade', line: 'bx' },
    { name: 'T-レックス', cat: 'blade', line: 'bx' },
    { name: 'モササウルス', cat: 'blade', line: 'bx' },
    { name: 'スピノサウルス', cat: 'blade', line: 'bx' },
    { name: 'ケツァルコアトルス', cat: 'blade', line: 'bx' },
    { name: 'トリケラスパイキー', cat: 'blade', line: 'bx' },
    { name: 'ワイバーンホバー', cat: 'blade', line: 'ux' },
    { name: 'ドランバスター', cat: 'blade', line: 'ux' },
    { name: 'ヘルズハンマー', cat: 'blade', line: 'ux' },
    { name: 'ウィザードロッド', cat: 'blade', line: 'ux' },
    { name: 'シノビシャドウ', cat: 'blade', line: 'ux' },
    { name: 'エアロペガサス', cat: 'blade', line: 'ux' },
    { name: 'レオンクレスト', cat: 'blade', line: 'ux' },
    { name: 'フェニックスラダー', cat: 'blade', line: 'ux' },
    { name: 'シルバーウルフ', cat: 'blade', line: 'ux' },
    { name: 'サムライセイバー', cat: 'blade', line: 'ux' },
    { name: 'ナイトメイル', cat: 'blade', line: 'ux' },
    { name: 'インパクトドレイク', cat: 'blade', line: 'ux' },
    { name: 'ゴーストサークル', cat: 'blade', line: 'ux' },
    { name: 'オロチクラスター', cat: 'blade', line: 'ux' },
    { name: 'ゴーレムロック', cat: 'blade', line: 'ux' },
    { name: 'スコーピオスビア', cat: 'blade', line: 'ux' },
    { name: 'シャークスケイル', cat: 'blade', line: 'ux' },
    { name: 'マミーカース', cat: 'blade', line: 'ux' },
    { name: 'クロックミラージュ', cat: 'blade', line: 'ux', otype: true },
    { name: 'メテオドラグーン', cat: 'blade', line: 'ux' },
    { name: 'バレットグリフォン', cat: 'blade', line: 'ux' },
    { name: 'ドラン', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ウィザード', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ペルセウス', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ヘルズ', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ライノ', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'フォックス', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ペガサス', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ケルベロス', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ホエール', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ソル', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ウルフ', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'フェニックス', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'バハムート', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ナイト', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ラグナ', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ユニコーン', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ワルキューレ', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'エンペラー', cat: 'blade', line: 'cx', cxType: 'lock' },
    { name: 'ブレイブ', cat: 'blade', line: 'cx', cxType: 'main' },
    { name: 'アーク', cat: 'blade', line: 'cx', cxType: 'main' },
    { name: 'ダーク', cat: 'blade', line: 'cx', cxType: 'main' },
    { name: 'リーバー', cat: 'blade', line: 'cx', cxType: 'main' },
    { name: 'ブラッシュ', cat: 'blade', line: 'cx', cxType: 'main' },
    { name: 'ブラスト', cat: 'blade', line: 'cx', cxType: 'main' },
    { name: 'フレイム', cat: 'blade', line: 'cx', cxType: 'main' },
    { name: 'ボルト', cat: 'blade', line: 'cx', cxType: 'main' },
    { name: 'ハント', cat: 'blade', line: 'cx', cxType: 'main' },
    { name: 'マイト', cat: 'blade', line: 'cx', cxType: 'main' },
    { name: 'フレア', cat: 'blade', line: 'cx', cxType: 'main' },
    { name: 'エクリプス', cat: 'blade', line: 'cx', cxType: 'main' },
    { name: 'B（ブレイク）', cat: 'blade', line: 'cx', cxType: 'over' },
    { name: 'G（ガード）', cat: 'blade', line: 'cx', cxType: 'over' },
    { name: 'F（フロー）', cat: 'blade', line: 'cx', cxType: 'over' },
    { name: 'P（ピーク）', cat: 'blade', line: 'cx', cxType: 'over' },
    { name: 'ブリッツ', cat: 'blade', line: 'cx', cxType: 'metal' },
    { name: 'フォートレス', cat: 'blade', line: 'cx', cxType: 'metal' },
    { name: 'レイジ', cat: 'blade', line: 'cx', cxType: 'metal' },
    { name: 'デルタ', cat: 'blade', line: 'cx', cxType: 'metal' },
    { name: 'S（スラッシュ）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'J（ジャギー）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'H（ヘビー）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'K（ナックル）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'O（オッド）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'R（ラウンド）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'B（バンパー）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'C（チャージ）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'A（アサルト）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'E（イレイズ）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'M（マッシブ）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'F（フリー）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'V（ヴァーチカル）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'T（ターン）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'D（デュアル）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'W（ウィール）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: 'Z（ジリオン）', cat: 'blade', line: 'cx', cxType: 'assist' },
    { name: '0-60', cat: 'ratchet', rtype: 'normal' },
    { name: '0-70', cat: 'ratchet', rtype: 'normal' },
    { name: '0-80', cat: 'ratchet', rtype: 'normal' },
    { name: '1-50', cat: 'ratchet', rtype: 'normal' },
    { name: '1-60', cat: 'ratchet', rtype: 'normal' },
    { name: '1-70', cat: 'ratchet', rtype: 'normal' },
    { name: '1-80', cat: 'ratchet', rtype: 'normal' },
    { name: '2-60', cat: 'ratchet', rtype: 'normal' },
    { name: '2-70', cat: 'ratchet', rtype: 'normal' },
    { name: '2-80', cat: 'ratchet', rtype: 'normal' },
    { name: '3-60', cat: 'ratchet', rtype: 'normal' },
    { name: '3-70', cat: 'ratchet', rtype: 'normal' },
    { name: '3-80', cat: 'ratchet', rtype: 'normal' },
    { name: '4-50', cat: 'ratchet', rtype: 'normal' },
    { name: '4-60', cat: 'ratchet', rtype: 'normal' },
    { name: '4-70', cat: 'ratchet', rtype: 'normal' },
    { name: '4-80', cat: 'ratchet', rtype: 'normal' },
    { name: '5-60', cat: 'ratchet', rtype: 'normal' },
    { name: '5-70', cat: 'ratchet', rtype: 'normal' },
    { name: '5-80', cat: 'ratchet', rtype: 'normal' },
    { name: '6-60', cat: 'ratchet', rtype: 'normal' },
    { name: '6-70', cat: 'ratchet', rtype: 'normal' },
    { name: '6-80', cat: 'ratchet', rtype: 'normal' },
    { name: '7-60', cat: 'ratchet', rtype: 'normal' },
    { name: '7-70', cat: 'ratchet', rtype: 'normal' },
    { name: '7-80', cat: 'ratchet', rtype: 'normal' },
    { name: '8-70', cat: 'ratchet', rtype: 'normal' },
    { name: '9-60', cat: 'ratchet', rtype: 'normal' },
    { name: '9-70', cat: 'ratchet', rtype: 'normal' },
    { name: '9-80', cat: 'ratchet', rtype: 'normal' },
    { name: '4-55', cat: 'ratchet', rtype: 'otype' },
    { name: '7-55', cat: 'ratchet', rtype: 'otype' },
    { name: '9-65', cat: 'ratchet', rtype: 'otype' },
    { name: '3-85', cat: 'ratchet', rtype: 'otype' },
    { name: 'M-85', cat: 'ratchet', rtype: 'otype' },
    { name: 'F（フラット）', cat: 'bit' },
    { name: 'LF（ロウフラット）', cat: 'bit' },
    { name: 'R（ラッシュ）', cat: 'bit' },
    { name: 'GF（ギヤフラット）', cat: 'bit' },
    { name: 'A（アクセル）', cat: 'bit' },
    { name: 'Q（クエイク）', cat: 'bit' },
    { name: 'C（サイクロン）', cat: 'bit' },
    { name: 'L（レベル）', cat: 'bit' },
    { name: 'RA（ラバーアクセル）', cat: 'bit' },
    { name: 'LR（ロウラッシュ）', cat: 'bit' },
    { name: 'V（ボルテックス）', cat: 'bit' },
    { name: 'GR（ギアラッシュ）', cat: 'bit' },
    { name: 'UF（アンダーフラッ）', cat: 'bit' },
    { name: 'J（ジョルト）', cat: 'bit' },
    { name: 'I（イグニッション）', cat: 'bit' },
    { name: 'T（テーパー）', cat: 'bit' },
    { name: 'P（ポイント）', cat: 'bit' },
    { name: 'HT（ハイテーパー）', cat: 'bit' },
    { name: 'GP（ギヤポイント）', cat: 'bit' },
    { name: 'H（ヘキサ）', cat: 'bit' },
    { name: 'U（ユナイト）', cat: 'bit' },
    { name: 'E（エレベート）', cat: 'bit' },
    { name: 'TP（トランスポイント）', cat: 'bit' },
    { name: 'K（キック）', cat: 'bit' },
    { name: 'Z（ザップ）', cat: 'bit' },
    { name: 'M（マージ）', cat: 'bit' },
    { name: 'TK（トランスキック）', cat: 'bit' },
    { name: 'GU（ギヤユナイト）', cat: 'bit' },
    { name: 'B（ボール）', cat: 'bit' },
    { name: 'O（オーブ）', cat: 'bit' },
    { name: 'GB（ギヤボール）', cat: 'bit' },
    { name: 'DB（ディスクボール）', cat: 'bit' },
    { name: 'G（グライド）', cat: 'bit' },
    { name: 'FB（フリーボール）', cat: 'bit' },
    { name: 'LO（ローオーブ）', cat: 'bit' },
    { name: 'WB（ウォールボール）', cat: 'bit' },
    { name: 'Y（イールディング）', cat: 'bit' },
    { name: 'N（ニードル）', cat: 'bit' },
    { name: 'HN（ハイニードル）', cat: 'bit' },
    { name: 'S（スパイク）', cat: 'bit' },
    { name: 'GN（ギヤニードル）', cat: 'bit' },
    { name: 'MN（メタルニードル）', cat: 'bit' },
    { name: 'D（ドット）', cat: 'bit' },
    { name: 'BS（バウンドスパイク）', cat: 'bit' },
    { name: 'UN（アンダーニードル）', cat: 'bit' },
    { name: 'W（ウェッジ）', cat: 'bit' },
    { name: 'WW（ウォールウェッジ）', cat: 'bit' },
    { name: 'Tr（ターボ）', cat: 'combo', combotype: 'Tr' },
    { name: 'Op（オペレート）', cat: 'combo', combotype: 'Op' }
];

/*各種定数*/
/*定数名={key:値}*/
var LINE = { bx: 'BX', ux: 'UX', cx: 'CX' };
var CXLBL = { lock: 'ロックチップ', main: 'メインブレード', assist: 'アシストブレード', metal: 'メタルブレード', over: 'オーバーブレード' };
var CATLBL = { blade: 'ブレード', ratchet: 'ラチェット', bit: 'ビット', combo: '一体型ビット' };
var EMO = { blade: '⚔️', ratchet: '🔩', bit: '🔵', combo: '💠' };
var RTLBL = { normal: '通常', otype: 'O型' };

/**
 * グローバル変数
 */
var mainTab = 'all', bladeSubTab = 'all', cxSubTab = 'lock';
var thumbTarget = null, thumbMap = {}, cxAddPat = 3;
var rowCount = { bxux: 1, ratchet: 1, bit: 1, combo: 1 };
var deckMode = 'owned', deckBladeLine = 'bx', deckCxPat = 3;
var DS = { blade: null, lock: null, main: null, assist: null, metal: null, over: null, lock4: null, assist4: null, ratchet: null, bit: null, combo: null };
var userEditedName = false;

/**
 * ユーティリティ関数
 */
function showToast(msg, type) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.className = 'toast ' + (type || '');
    t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); }, 2800);
}

/**
 * モーダルの非表示化（閉じる）
 */
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
var pendingNavTarget = null;

/**
 * ナビゲーション切り替え時の入力内容確認
 */
function checkNavSwitch(name) {
    // Check if any input/modal has content
    var hasInput = false;

    /**
     * Check add picker modal
     */
    var addPickerModal = document.getElementById('modal-add-picker');
    if (addPickerModal && !addPickerModal.classList.contains('hidden')) {
        var hasChecked = false;
        Object.keys(addPickerTemp).forEach(function (k) {
            if (Object.keys(addPickerTemp[k]).length > 0) hasChecked = true;
        });
        if (hasChecked) hasInput = true;
    }

    // Check deck modal
    var deckModal = document.getElementById('modal-deck');
    if (deckModal && !deckModal.classList.contains('hidden')) {
        var allNames = [DS.blade, DS.lock, DS.main, DS.assist, DS.lock4, DS.metal, DS.over, DS.assist4, DS.ratchet, DS.bit, DS.combo].filter(Boolean);
        if (allNames.length > 0) hasInput = true;
        var nameInp = document.getElementById('deck-name-inp');
        if (nameInp && nameInp.value.trim()) hasInput = true;
    }

    // Check picker modal (deck)
    var pickerModal = document.getElementById('modal-picker');
    if (pickerModal && !pickerModal.classList.contains('hidden')) {
        var hasP = Object.keys(pickerTemp).some(function (k) { return !!pickerTemp[k]; });
        if (hasP) hasInput = true;
    }

    /**
     * Check picker modal (parts)
     */
    if (hasInput) {
        pendingNavTarget = name;
        document.getElementById('modal-confirm-nav').classList.remove('hidden');
    } else {
        // Close any open modals
        ['modal-part', 'modal-add-picker', 'modal-deck', 'modal-picker', 'modal-rename', 'modal-battle-deck'].forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
        showScreen(name);
    }
}

/**
 * Confirm navigation modal actions
 */
function confirmNavYes() {
    document.getElementById('modal-confirm-nav').classList.add('hidden');
    // Close all modals
    ['modal-part', 'modal-add-picker', 'modal-deck', 'modal-picker', 'modal-rename', 'modal-battle-deck'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    /**
     * Reset temporary data
     */
    addPickerTemp = {};
    DS = { bladeLine: null, cxPat: 3, blade: null, lock: null, main: null, assist: null, lock4: null, metal: null, over: null, assist4: null, ratchet: null, bit: null, combo: null };
    pickerTemp = {};
    if (pendingNavTarget) {
        showScreen(pendingNavTarget);
        pendingNavTarget = null;
    }
}

/**
 * Cancel navigation modal
 */
function confirmNavNo() {
    document.getElementById('modal-confirm-nav').classList.add('hidden');
    pendingNavTarget = null;
}


//画面切替え用関数
function showScreen(name) {
    //全画面のactiveを外す
    document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); });

    //全ナビゲーションボタンのactiveを外す
    document.querySelectorAll('.nav-btn').forEach(function (b) { b.classList.remove('active'); });

    //指定した画面だけactiveをつける
    document.getElementById('screen-' + name).classList.add('active');
    document.getElementById('nav-' + name).classList.add('active');

    //画面ごとの描画関数を呼ぶ(画面下部のタブを押すとそれぞれが呼ばれる)
    if (name === 'home') renderHome();
    if (name === 'parts') renderParts();
    if (name === 'decks') renderDecks();
    if (name === 'battle') renderBattleHome();
    if (name === 'timer') renderTimerHome();
}

// 勝敗記録（将来の拡張用）

// ============================================================
// 計測モード
// ============================================================
var timerState = 'home'; // home, select, standby, running, result
var timerDeck = null;    // 選択中デッキ {name, parts, deckId}
var timerStart = 0;
var timerElapsed = 0;
var timerInterval = null;
var timerLaps = [];
var timerSelectMode = 'saved'; // saved, owned, all
var timerDeckViewMode = 'recent'; // 'recent','best','avg'

function fmtTime(ms) {
    var m = Math.floor(ms / 60000);
    var s = Math.floor((ms % 60000) / 1000);
    var cs = Math.floor((ms % 1000) / 10);
    return (m > 0 ? m + ':' : '') + (m > 0 ? String(s).padStart(2, '0') : s) + '.' + String(cs).padStart(2, '0');
}
function fmtTimeSec(ms) {
    // 持久力表示用：秒単位（小数点以下2桁）
    return (ms / 1000).toFixed(2);
}
function fmtTimeDuration(ms) {
    // 持久力 XX.XX 秒 の形式で返す
    return '持久力 ' + fmtTimeSec(ms) + ' 秒';
}

/**
 * 計測モードホーム画面
 */
function renderTimerHome() {
    timerState = 'home';
    timerDeck = null;
    timerLaps = [];
    timerElapsed = 0;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    document.getElementById('timer-content').innerHTML =
        '<div style="padding:0 0 80px;">'
        + '<div style="padding:12px 16px 4px;font-size:11px;color:var(--text2);">計測対象のベイを選択してください</div>'
        + '<div class="battle-mode-card" onclick="startTimerSelect(\'saved\')">'
        + '<div class="battle-mode-icon" style="background:rgba(0,204,68,0.15);">🌀</div>'
        + '<div class="battle-mode-info"><h3>マイデッキから選ぶ</h3><p>登録済みのデッキを計測対象に選択</p></div>'
        + '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>'
        + '</div>'
        + '<div class="battle-mode-card" onclick="startTimerSelect(\'owned\')">'
        + '<div class="battle-mode-icon" style="background:rgba(79,195,247,0.15);">📦</div>'
        + '<div class="battle-mode-info"><h3>所持パーツから組む</h3><p>所持パーツから計測用デッキを組む</p></div>'
        + '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>'
        + '</div>'
        + '<div class="battle-mode-card" onclick="startTimerSelect(\'all\')">'
        + '<div class="battle-mode-icon" style="background:rgba(124,111,255,0.15);">🌐</div>'
        + '<div class="battle-mode-info"><h3>全パーツから組む</h3><p>未所持を含む全パーツから組む</p></div>'
        + '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>'
        + '</div>'
        + '</div>';
}

/**
 * 計測モード：デッキ選択画面
 */
function startTimerSelect(mode) {
    timerSelectMode = mode;
    timerState = 'select';
    var html = '<div style="padding:0 0 80px;">';
    html += '<div style="padding:8px 16px;"><button class="btn-sm" onclick="renderTimerHome()" style="padding:6px 12px;"><i class="ti ti-arrow-left"></i> 戻る</button></div>';

    /**
     * デッキ選択モードによって表示を切り替える
     */
    if (mode === 'saved') {
        html += '<div style="padding:0 16px 8px;font-size:11px;color:var(--text2);">マイデッキを選択</div>';
        if (!decks.length) {
            html += '<div class="empty">登録済みデッキがありません</div>';
        } else {
            html += decks.map(function (d) {
                return '<div class="timer-deck-card" onclick="selectTimerDeck(' + d.id + ',\'saved\')" style="margin:0 16px 8px;">'
                    + '<div style="font-size:13px;font-weight:500;margin-bottom:4px;">' + d.name + '</div>'
                    + '<div style="font-size:10px;color:var(--text2);">' + getAllNames(d).join(' / ') + '</div>'
                    + '</div>';
            }).join('');
        }
    } else {
        // 所持/全パーツからデッキを組む → デッキビルダーを流用
        html += '<div style="padding:0 16px 8px;font-size:11px;color:var(--text2);">計測用デッキを組んでください</div>';
        html += '<div style="padding:0 16px;">';
        html += '<div id="timer-deck-builder"></div>';
        html += '<button class="btn-save" onclick="confirmTimerNewDeck()" style="width:100%;padding:12px;border:none;border-radius:10px;font-size:13px;cursor:pointer;margin-top:8px;">このデッキで計測</button>';
        html += '</div>';
    }
    html += '</div>';
    document.getElementById('timer-content').innerHTML = html;

    if (mode !== 'saved') {
        // デッキビルダーを埋め込み
        deckMode = mode === 'all' ? 'all' : 'owned';
        pickerMode = deckMode;
        DS = { bladeLine: null, cxPat: 3, blade: null, lock: null, main: null, assist: null, lock4: null, metal: null, over: null, assist4: null, ratchet: null, bit: null, combo: null };
        renderTimerDeckBuilder();
    }
}

function renderTimerDeckBuilder() {
    var el = document.getElementById('timer-deck-builder');
    if (!el) return;
    var html = '';
    // 簡易デッキ選択表示
    html += '<div class="part-sel-display" onclick="openTimerPartPicker(\'blade\')" style="margin-bottom:8px;">'
        + '<span style="font-size:11px;color:var(--text2);">ブレード</span>'
        + '<span id="timer-blade-val" style="font-size:12px;color:var(--accent);margin-left:auto;">' + (DS.blade || DS.lock ? '選択済み' : 'タップして選択') + '</span>'
        + '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:6px;"></i>'
        + '</div>';
    html += '<div class="part-sel-display" onclick="openTimerPartPicker(\'ratchet\')" style="margin-bottom:8px;">'
        + '<span style="font-size:11px;color:var(--text2);">ラチェット / 一体型</span>'
        + '<span id="timer-ratchet-val" style="font-size:12px;color:var(--accent);margin-left:auto;">' + (DS.ratchet || DS.combo ? '選択済み' : 'タップして選択') + '</span>'
        + '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:6px;"></i>'
        + '</div>';
    if (!DS.combo) {
        html += '<div class="part-sel-display" onclick="openTimerPartPicker(\'bit\')" style="margin-bottom:8px;">'
            + '<span style="font-size:11px;color:var(--text2);">ビット</span>'
            + '<span id="timer-bit-val" style="font-size:12px;color:var(--accent);margin-left:auto;">' + (DS.bit ? '選択済み' : 'タップして選択') + '</span>'
            + '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:6px;"></i>'
            + '</div>';
    }
    el.innerHTML = html;
}

function openTimerPartPicker(target) {
    // 既存のpickerを流用
    openPartPicker(target);
    // pickerDone後にrenderTimerDeckBuilderを呼ぶようフック
    window._timerPickerHook = true;
}

// pickerDoneをフック
var _origPickerDone = null;
function pickerDoneWithTimerHook() {
    pickerDone();
    if (window._timerPickerHook) {
        window._timerPickerHook = false;
        renderTimerDeckBuilder();
    }
}

function confirmTimerNewDeck() {
    var isCX = DS.bladeLine === 'cx';
    if (!DS.bladeLine) { showToast('ブレードを選択してください'); return; }
    if (!isCX && !DS.blade) { showToast('ブレードを選択してください'); return; }
    if (!DS.combo && !DS.ratchet) { showToast('ラチェットを選択してください'); return; }
    if (!DS.combo && !DS.bit) { showToast('ビットを選択してください'); return; }

    var bp = '';
    if (isCX) { if (DS.cxPat === 3) bp = (DS.lock || '') + (DS.main || '') + (DS.assist || ''); else bp = (DS.lock4 || '') + (DS.metal || '') + (DS.over || '') + (DS.assist4 || ''); }
    else bp = DS.blade || '';
    var name = bp + (DS.combo || DS.ratchet || '') + (DS.combo ? '' : (DS.bit || ''));

    timerDeck = {
        name: name, deckId: null, isNew: true,
        parts: {
            bladeLine: DS.bladeLine, blade: DS.blade, lock: DS.lock, main: DS.main, assist: DS.assist,
            lock4: DS.lock4, metal: DS.metal, over: DS.over, assist4: DS.assist4,
            ratchet: DS.combo ? null : DS.ratchet, bit: DS.combo ? null : DS.bit, combo: DS.combo || null
        }
    };
    renderTimerStandby();
}

function selectTimerDeck(deckId, mode) {
    var d = decks.find(function (x) { return x.id === deckId; });
    if (!d) return;
    timerDeck = { name: d.name, deckId: deckId, isNew: false, parts: d };
    renderTimerStandby();
}

function renderTimerStandby() {
    timerState = 'standby';
    timerLaps = []; timerElapsed = 0;
    document.getElementById('timer-content').innerHTML =
        '<div style="padding:0 0 80px;">'
        + '<div style="padding:8px 16px;"><button class="btn-sm" onclick="renderTimerHome()" style="padding:6px 12px;"><i class="ti ti-arrow-left"></i> 戻る</button></div>'
        + '<div style="padding:12px 16px;background:var(--bg2);margin:0 16px 14px;border-radius:12px;border:0.5px solid var(--border);">'
        + '<div style="font-size:10px;color:var(--text2);margin-bottom:4px;">計測対象</div>'
        + '<div style="font-size:15px;font-weight:600;">' + timerDeck.name + '</div>'
        + '<div style="font-size:10px;color:var(--text2);margin-top:3px;">' + getAllNames(timerDeck.parts).join(' / ') + '</div>'
        + '</div>'
        + '<div class="timer-display">'
        + '<div><span class="timer-main">0:00</span><span class="timer-ms">.00</span></div>'
        + '<div class="timer-controls" style="margin-top:24px;">'
        + '<button class="timer-btn-start" onclick="startTimer()">START</button>'
        + '</div>'
        + '</div>'
        + '</div>';
}

function startTimer() {
    // 計測開始前にカウントダウンを表示
    timerState = 'countdown';
    renderTimerCountdown();
}

var countdownSteps = ['3', '2', '1', 'ゴーシュート！'];
var countdownInterval = null;
function renderTimerCountdown() {
    var idx = 0;
    document.getElementById('timer-content').innerHTML =
        '<div style="padding:0 0 80px;">'
        + '<div style="padding:6px 16px;font-size:11px;color:var(--text2);">計測対象: ' + timerDeck.name + '</div>'
        + '<div class="countdown-display">'
        + '<div class="countdown-num" id="countdown-num">' + countdownSteps[0] + '</div>'
        + '<div class="countdown-label">構えてください</div>'
        + '</div>'
        + '</div>';

    countdownInterval = setInterval(function () {
        idx++;
        var el = document.getElementById('countdown-num');
        var labelEl = document.querySelector('.countdown-label');
        if (idx < countdownSteps.length) {
            if (el) {
                // アニメーションリセットのため一旦クラス除去→再付与
                el.classList.remove('countdown-num', 'countdown-shoot');
                if (idx === countdownSteps.length - 1) {
                    el.className = 'countdown-shoot';
                } else {
                    el.className = 'countdown-num';
                }
                // 強制リフロー
                void el.offsetWidth;
                el.classList.add(idx === countdownSteps.length - 1 ? 'countdown-shoot' : 'countdown-num');
                el.textContent = countdownSteps[idx];
            }
            if (labelEl) labelEl.textContent = idx === countdownSteps.length - 1 ? '計測開始！' : '構えてください';
        } else {
            clearInterval(countdownInterval);
            countdownInterval = null;
            actuallyStartTimer();
        }
    }, 700);
}

function actuallyStartTimer() {
    timerState = 'running';
    timerElapsed = 0;
    timerStart = Date.now() - timerElapsed;
    timerInterval = setInterval(function () {
        timerElapsed = Date.now() - timerStart;
        updateTimerDisplay();
    }, 30);
    renderTimerRunning();
}

function updateTimerDisplay() {
    var el = document.getElementById('timer-time-main');
    var el2 = document.getElementById('timer-time-ms');
    if (!el) return;
    var ms = timerElapsed;
    var m = Math.floor(ms / 60000);
    var s = Math.floor((ms % 60000) / 1000);
    var cs = Math.floor((ms % 1000) / 10);
    el.textContent = (m > 0 ? m + ':' : '') + (m > 0 ? String(s).padStart(2, '0') : s);
    el2.textContent = '.' + String(cs).padStart(2, '0');
}

function renderTimerRunning() {
    document.getElementById('timer-content').innerHTML =
        '<div style="padding:0 0 80px;">'
        + '<div style="padding:6px 16px;font-size:11px;color:var(--text2);">計測中: ' + timerDeck.name + '</div>'
        + '<div class="timer-display">'
        + '<div><span class="timer-main" id="timer-time-main">0:00</span><span class="timer-ms" id="timer-time-ms">.00</span></div>'
        + '<div class="timer-controls">'
        + '<button class="timer-btn-lap" onclick="recordLap()">LAP</button>'
        + '<button class="timer-btn-stop" onclick="stopTimer()">STOP</button>'
        + '<button class="timer-btn-reset" onclick="resetTimer()">RST</button>'
        + '</div>'
        + '</div>'
        + '<div class="lap-list" id="lap-list"></div>'
        + '</div>';
}

function recordLap() {
    var lapTime = timerElapsed;
    timerLaps.push(lapTime);
    var lapList = document.getElementById('lap-list');
    if (lapList) {
        var prev = timerLaps.length > 1 ? timerLaps[timerLaps.length - 2] : 0;
        var split = lapTime - prev;
        lapList.innerHTML = '<div style="font-size:10px;color:var(--text3);padding:4px 0;">ラップ</div>'
            + timerLaps.slice().reverse().map(function (t, i) {
                var idx = timerLaps.length - i;
                var pr = idx > 1 ? timerLaps[idx - 2] : 0;
                return '<div class="lap-item"><span>Lap ' + idx + '</span><span>+' + fmtTime(t - pr) + '</span><span style="color:var(--accent);">' + fmtTime(t) + '</span></div>';
            }).join('');
    }
}

function stopTimer() {
    clearInterval(timerInterval); timerInterval = null;
    timerState = 'result';
    renderTimerResult();
}

function resetTimer() {
    clearInterval(timerInterval); timerInterval = null;
    if (countdownInterval) { clearInterval(countdownInterval); countdownInterval = null; }
    timerElapsed = 0; timerLaps = [];
    renderTimerStandby();
}

function renderTimerResult() {
    var total = fmtTimeSec(timerElapsed); // 秒単位
    var html = '<div style="padding:0 0 80px;">'
        + '<div class="timer-result-card">'
        + '<div style="font-size:12px;color:var(--text2);margin-bottom:8px;">計測結果</div>'
        + '<div style="font-size:11px;color:var(--text2);margin-bottom:4px;">持久力</div>'
        + '<div class="timer-result-time">' + fmtTimeSec(timerElapsed) + ' 秒</div>'
        + '<div style="font-size:12px;color:var(--text2);margin-top:6px;">' + timerDeck.name + '</div>'
        + (timerLaps.length ? '<div style="font-size:10px;color:var(--text3);margin-top:4px;">ラップ ' + timerLaps.length + '件</div>' : '')
        + '</div>';

    // マイデッキ登録済みか確認
    /**
     * timerDeck.deckId が存在する場合、decks 配列から対応するデッキを検索し、matchedDeck に格納します。
     */
    var matchedDeck = timerDeck.deckId ? decks.find(function (d) { return d.id === timerDeck.deckId; }) : null;

    /**
     * matchedDeck が存在する場合、計測結果を登録するかどうかの確認メッセージとボタンを表示します。
     * matchedDeck が存在しない場合、デッキがマイデッキに登録されていないことを示すメッセージと、登録して計測結果を保存するかどうかの確認ボタンを表示します。
     */
    if (matchedDeck) {
        html += '<div style="padding:0 16px;">'
            + '<p style="font-size:13px;color:var(--text);margin-bottom:12px;">この計測結果を「' + matchedDeck.name + '」に登録しますか？</p>'
            + '<div style="display:flex;gap:8px;">'
            + '<button class="btn-save" onclick="saveTimerResult(' + matchedDeck.id + ')" style="flex:1;padding:11px;border:none;border-radius:8px;font-size:13px;cursor:pointer;">登録する</button>'
            + '<button class="btn-cancel" onclick="confirmDiscardTimer()" style="flex:1;padding:11px;border-radius:8px;cursor:pointer;background:var(--bg3);border:none;color:var(--text2);">いいえ</button>'
            + '</div>'
            + '</div>';
    } else {
        html += '<div style="padding:0 16px;">'
            + '<p style="font-size:13px;color:var(--text);margin-bottom:12px;">このデッキはマイデッキに登録されていません。登録して計測結果を保存しますか？</p>'
            + '<div style="display:flex;gap:8px;">'
            + '<button class="btn-save" onclick="registerAndSaveTimer()" style="flex:1;padding:11px;border:none;border-radius:8px;font-size:13px;cursor:pointer;">登録して保存</button>'
            + '<button class="btn-cancel" onclick="confirmDiscardTimer()" style="flex:1;padding:11px;border-radius:8px;cursor:pointer;background:var(--bg3);border:none;color:var(--text2);">登録しない</button>'
            + '</div>'
            + '</div>';
    }
    /**
     * 計測結果の詳細を表示するためのHTMLを生成します。ラップタイムが存在する場合、ラップタイムのリストを表示します。
     */
    html += '</div>';
    document.getElementById('timer-content').innerHTML = html;
}

function saveTimerResult(deckId) {
    if (!measureRecords[deckId]) measureRecords[deckId] = [];
    measureRecords[deckId].push({
        time_ms: timerElapsed,
        laps: timerLaps.slice(),
        date: new Date().toISOString()
    });
    saveMeasureRecords();
    showToast('計測結果を登録しました', 'ok');
    renderTimerHome();
    renderHome();
}

function registerAndSaveTimer() {
    // デッキをマイデッキに登録
    var p = timerDeck.parts;
    var newDeck = Object.assign({}, p, {
        id: nextDeckId++,
        name: timerDeck.name,
        battle: false
    });

    decks.push(newDeck);
    saveDecks();
    timerDeck.deckId = newDeck.id;

    /*未所持パーツの抽出*/
    var deckPartNames = getAllNames(p)
        .filter(function (name) { return name.trim() !== ''; });
    var unownedNames = deckPartNames.filter(function (name) {
        return !parts.some(function (owned) {
            return owned.name === name;
        });
    });

    // 未所持パーツがあれば確認
    if (unownedNames.length > 0) {
        var msg = '以下のパーツが未登録です。所持パーツに追加しますか？\n\n'
            + unownedNames.join('\n');

        if (confirm(msg)) {
            // 未所持パーツをpartsに追加
            unownedNames.forEach(function (name) {
                // ALL_DBから該当パーツを探す
                var dbItem = ALL_DB.find(function (item) { return item.name === name; });
                if (dbItem) {
                    parts.push(Object.assign({}, dbItem, {
                        id: nextId++,
                        qty: 1,
                        memo: '',
                        img: null
                    }));
                }
            });
            saveParts();
            showToast(unownedNames.length + '件のパーツを登録しました', 'ok');
        }
    }

    saveTimerResult(newDeck.id);
    renderDecks();
}

function confirmDiscardTimer() {
    if (confirm('計測結果が無効になりますがよろしいですか？')) {
        renderTimerHome();
    }
}

// ============================================================
// デッキ詳細（計測記録）
// ============================================================
function toggleDeckDetail(deckId) {
    var el = document.getElementById('deck-detail-' + deckId);
    if (!el) return;
    var isOpen = el.style.display !== 'none';
    el.style.display = isOpen ? 'none' : 'block';
    // ボタンのテキストも更新
    var btn = document.getElementById('deck-detail-btn-' + deckId);
    if (btn) btn.innerHTML = '<i class="ti ti-chart-bar"></i> ' + (isOpen ? '詳細' : '閉じる');
    if (!isOpen) el.innerHTML = renderDeckMeasureDetail(decks.find(function (d) { return d.id === deckId; }));
}

function renderDeckMeasureDetail(d) {
    if (!d) return '';
    var records = measureRecords[d.id] || [];
    var html = '<div>';

    // 表示切り替えタブ
    var viewMode = d._measViewMode || 'recent';
    html += '<div class="meas-record-tabs">'
        + '<span class="meas-record-tab ' + (viewMode === 'recent' ? 'active' : '') + '" onclick="setDeckMeasView(' + d.id + ',\'recent\')">直近5件</span>'
        + '<span class="meas-record-tab ' + (viewMode === 'best' ? 'active' : '') + '" onclick="setDeckMeasView(' + d.id + ',\'best\')">最長記録</span>'
        + '<span class="meas-record-tab ' + (viewMode === 'avg' ? 'active' : '') + '" onclick="setDeckMeasView(' + d.id + ',\'avg\')">平均</span>'
        + '</div>';

    if (!records.length) {
        html += '<div class="no-record">未計測</div>';
    } else {
        if (viewMode === 'recent') {
            var recentStart = Math.max(0, records.length - 5);
            var recent = records.slice(recentStart).reverse();
            html += recent.map(function (r, i) {
                var realIdx = records.length - 1 - i; // 実際のインデックス
                return '<div class="meas-record-item">'
                    + '<div><div class="meas-record-time">' + fmtTime(r.time_ms) + '</div>'
                    + (r.laps && r.laps.length ? '<div style="font-size:9px;color:var(--text3);">ラップ' + r.laps.length + '件</div>' : '')
                    + '</div>'
                    + '<div style="text-align:right;">'
                    + '<div class="meas-record-date">' + new Date(r.date).toLocaleDateString('ja-JP') + '</div>'
                    + '<button class="btn-sm danger" onclick="deleteMeasRecord(' + d.id + ',' + realIdx + ')" style="font-size:9px;padding:2px 6px;margin-top:2px;">削除</button>'
                    + '</div>'
                    + '</div>';
            }).join('');
        } else if (viewMode === 'best') {
            var best = records.reduce(function (a, b) { return b.time_ms > a.time_ms ? b : a; });
            html += '<div class="meas-record-item">'
                + '<div><div style="font-size:10px;color:var(--text2);">🏆 最長記録</div><div class="meas-record-time">' + fmtTime(best.time_ms) + '</div></div>'
                + '<div class="meas-record-date">' + new Date(best.date).toLocaleDateString('ja-JP') + '</div>'
                + '</div>';
        } else {
            var avg = Math.round(records.reduce(function (s, r) { return s + r.time_ms; }, 0) / records.length);
            html += '<div class="meas-record-item">'
                + '<div><div style="font-size:10px;color:var(--text2);">📊 平均 (全' + records.length + '回)</div><div class="meas-record-time">' + fmtTime(avg) + '</div></div>'
                + '</div>';
        }
        // 全記録削除
        html += '<button class="btn-sm danger" onclick="clearMeasRecords(' + d.id + ')" style="font-size:10px;margin-top:8px;width:100%;text-align:center;">計測記録をすべて削除</button>';
    }
    html += '</div>';
    return html;
}

function setDeckMeasView(deckId, mode) {
    var d = decks.find(function (x) { return x.id === deckId; });
    if (d) d._measViewMode = mode;
    var el = document.getElementById('deck-detail-' + deckId);
    if (el) el.innerHTML = renderDeckMeasureDetail(d);
}

function deleteMeasRecord(deckId, idx) {
    if (!measureRecords[deckId]) return;
    measureRecords[deckId].splice(idx, 1);
    saveMeasureRecords();
    var d = decks.find(function (x) { return x.id === deckId; });
    var el = document.getElementById('deck-detail-' + deckId);
    if (el) el.innerHTML = renderDeckMeasureDetail(d);
    renderHome();
}

function clearMeasRecords(deckId) {
    if (!confirm('このデッキの計測記録をすべて削除しますか？')) return;
    measureRecords[deckId] = [];
    saveMeasureRecords();
    var d = decks.find(function (x) { return x.id === deckId; });
    var el = document.getElementById('deck-detail-' + deckId);
    if (el) el.innerHTML = renderDeckMeasureDetail(d);
    renderHome();
}

// ===== テーマ管理 =====
var themeMode = localStorage.getItem('bx_theme') || 'system'; // 'system','dark','light'
function applyTheme() {
    var root = document.documentElement;
    if (themeMode === 'light') { root.setAttribute('data-theme', 'light'); }
    else if (themeMode === 'dark') { root.setAttribute('data-theme', 'dark'); }
    else { root.removeAttribute('data-theme'); }
}
applyTheme();

var battleRecords = JSON.parse(localStorage.getItem('bx_battleRecords') || '[]');
var measureRecords = JSON.parse(localStorage.getItem('bx_measureRecords') || '{}');
// measureRecords[deckId] = [{time_ms, laps, date}]
function saveMeasureRecords() { localStorage.setItem('bx_measureRecords', JSON.stringify(measureRecords)); }
var myRuleSetting = JSON.parse(localStorage.getItem('bx_myRule') || JSON.stringify({ winPt: 4, deckCount: 1, noDupe: true }));
var winCountMode = localStorage.getItem('bx_winCountMode') || 'match'; // 'match' or 'battle'
var myPlayerName = localStorage.getItem('bx_playerName') || '自分';
function saveParts() {
    localStorage.setItem('bx_parts', JSON.stringify(parts));
    localStorage.setItem('bx_nextId', nextId);
}
function saveDecks() {
    localStorage.setItem('bx_decks', JSON.stringify(decks));
    localStorage.setItem('bx_nextDeckId', nextDeckId);
}
function saveBattleRecords() { localStorage.setItem('bx_battleRecords', JSON.stringify(battleRecords)); }
function saveMyRule() { localStorage.setItem('bx_myRule', JSON.stringify(myRuleSetting)); }


// ============================================================
// 対戦モード
// ============================================================

// ポイント定数（全ルール不変）
var FINISH_PT = { ef: 4, bf: 2, of: 2, sf: 1 };
var FINISH_LABEL = { ef: 'エクストリームフィニッシュ', bf: 'バーストフィニッシュ', of: 'オーバーフィニッシュ', sf: 'スピンフィニッシュ' };
var FINISH_COLOR = { ef: '#7c6fff', bf: '#4fc3f7', of: '#f7a94f', sf: '#4caf82' };

// 対戦セッション状態
var BS = {
    mode: null,         // 'free','official','myrule'
    ruleWinPt: 4,
    ruleDeckCount: 1,
    ruleNoDupe: true,
    // デッキ設定
    myDecks: [],        // [{name,parts,deckId,isNew}] deckCount分
    oppDecks: [],
    oppName: '対戦相手',
    // バトル状態
    myPt: 0,
    oppPt: 0,
    battles: [],        // {finish,winner,myPt,oppPt}
    currentMyDeckIdx: 0,
    currentOppDeckIdx: 0,
    finished: false,
    winner: null,       // 'my','opp','draw'
};

function renderBattleHome() {
    document.getElementById('battle-screen-title').textContent = '対戦モード';
    var html = '<div style="padding:0 0 80px;">';
    html += '<div style="padding:12px 16px 4px;font-size:11px;color:var(--text2);">モードを選択</div>';
    // フリーバトル
    html += '<div class="battle-mode-card" onclick="startBattleSetup(\'free\')">'
        + '<div class="battle-mode-icon" style="background:rgba(124,111,255,0.15);">⚔️</div>'
        + '<div class="battle-mode-info"><h3>フリーバトル</h3>'
        + '<p>何度でも記録可能。デッキ1個・ポイント4pt先取がデフォルト。</p></div>'
        + '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>'
        + '</div>';
    // 公式試合
    html += '<div class="battle-mode-card" onclick="startBattleSetup(\'official\')">'
        + '<div class="battle-mode-icon" style="background:rgba(79,195,247,0.15);">🏆</div>'
        + '<div class="battle-mode-info"><h3>試合モード（公式）</h3>'
        + '<p>3on3・4pt先取。公式レギュレーション第12版準拠。</p></div>'
        + '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>'
        + '</div>';
    // マイルール
    html += '<div class="battle-mode-card" onclick="startBattleSetup(\'myrule\')">'
        + '<div class="battle-mode-icon" style="background:rgba(247,169,79,0.15);">⚙️</div>'
        + '<div class="battle-mode-info"><h3>試合モード（マイルール）</h3>'
        + '<p>勝利pt・デッキ数・重複可否を自由に設定。</p></div>'
        + '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>'
        + '</div>';

    // プレイヤーカード一覧
    html += '<div class="battle-mode-card" onclick="renderPlayerCardHome()">'
        + '<div class="battle-mode-icon" style="background:rgba(0,204,68,0.15);">📩</div>'
        + '<div class="battle-mode-info"><h3>プレイヤーカード</h3>'
        + '<p>自分のカードを表示・ライバルのカードを管理。</p></div>'
        + '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>'
        + '</div>';

    // 設定
    html += '<div style="padding:0 16px;">'
        + '<div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:12px;padding:14px;">'
        + '<div style="font-size:12px;font-weight:500;color:var(--text);margin-bottom:12px;">⚙️ 勝敗カウント設定</div>'
        + '<div class="rule-setting-row">'
        + '<div><div class="rule-setting-label">カウント単位</div>'
        + '<div class="rule-setting-sub">試合単位：4pt到達で1勝 / バトル単位：1バトルで1勝</div></div>'
        + '<div style="display:flex;gap:6px;">'
        + '<span class="sel-chip ' + (typeof winCountMode !== 'undefined' && winCountMode === 'match' ? 'active' : '') + '" onclick="setWinCountMode(\'match\')" style="font-size:10px;padding:4px 10px;">試合</span>'
        + '<span class="sel-chip ' + (typeof winCountMode !== 'undefined' && winCountMode === 'battle' ? 'active' : '') + '" onclick="setWinCountMode(\'battle\')" style="font-size:10px;padding:4px 10px;">バトル</span>'
        + '</div>'
        + '</div>'
        + '<div class="rule-setting-row">'
        + '<div><div class="rule-setting-label">自分の名前</div></div>'
        + '<input class="rule-setting-input" style="width:120px;text-align:left;" value="' + myPlayerName + '" id="my-player-name-inp" onchange="savePlayerName(this.value)">'
        + '</div>'
        + '<div class="rule-setting-row">'
        + '<div><div class="rule-setting-label">テーマ</div><div class="rule-setting-sub">システム / ダーク / ライト</div></div>'
        + getThemeChipsHtml()
        + '</div>'
        + '</div>'
        + '</div>';
    html += '</div>';
    document.getElementById('battle-content').innerHTML = html;
}

function getThemeChipsHtml() {
    var chips = [['system', '自動'], ['dark', '🌙 ダーク'], ['light', '☀️ ライト']];
    var html = '<div style="display:flex;gap:5px;">';
    chips.forEach(function (c) {
        var active = themeMode === c[0] ? 'active' : '';
        html += '<span class="sel-chip ' + active + '" data-t="' + c[0] + '" onclick="setTheme(this.dataset.t)" style="font-size:10px;padding:4px 8px;cursor:pointer;">' + c[1] + '</span>';
    });
    html += '</div>';
    return html;
}

function setTheme(t) {
    themeMode = t;
    localStorage.setItem('bx_theme', t);
    applyTheme();
    renderBattleHome();
}

function setWinCountMode(m) {
    winCountMode = m;
    localStorage.setItem('bx_winCountMode', m);
    renderBattleHome();
    renderHome();
}
function savePlayerName(v) {
    myPlayerName = v.trim() || '自分';
    localStorage.setItem('bx_playerName', myPlayerName);
}

// ============================================================
// バトルセットアップ
// ============================================================
function startBattleSetup(mode) {
    BS.mode = mode;
    BS.myPt = 0; BS.oppPt = 0; BS.battles = [];
    BS.finished = false; BS.winner = null;
    BS.currentMyDeckIdx = 0; BS.currentOppDeckIdx = 0;
    BS.oppName = '対戦相手';

    if (mode === 'free') {
        BS.ruleWinPt = 4; BS.ruleDeckCount = 1; BS.ruleNoDupe = true;
        BS.myDecks = [{ name: '', parts: null, deckId: null, isNew: false, choiceMode: null }];
        BS.oppDecks = [{ name: '', parts: null, deckId: null, isNew: false, choiceMode: null }];
        renderBattleSetup();
    } else if (mode === 'official') {
        BS.ruleWinPt = 4; BS.ruleDeckCount = 3; BS.ruleNoDupe = true;
        BS.myDecks = [0, 1, 2].map(function () { return { name: '', parts: null, deckId: null, isNew: false, choiceMode: null }; });
        BS.oppDecks = [0, 1, 2].map(function () { return { name: '', parts: null, deckId: null, isNew: false, choiceMode: null }; });
        renderBattleSetup();
    } else {
        renderMyRuleSetup();
    }
}

/**
 * retryBattleSetup(mode)
 *  対戦時に「もう一度」ボタンを押したときに呼ばれる関数
 * （自分と対戦相手のデッキ情報を保持したままセッティング画面に戻る）
 * */
function retryBattleSetup(mode) {
    BS.mode = mode;
    BS.myPt = 0; BS.oppPt = 0; BS.battles = [];
    BS.finished = false; BS.winner = null;
    BS.currentMyDeckIdx = 0; BS.currentOppDeckIdx = 0;

    if (mode === 'free') {
        BS.ruleWinPt = 4; BS.ruleDeckCount = 1; BS.ruleNoDupe = true;
        renderBattleSetup();
    } else if (mode === 'official') {
        BS.ruleWinPt = 4; BS.ruleDeckCount = 3; BS.ruleNoDupe = true;
        renderBattleSetup();
    } else {
        renderMyRuleSetup();
    }
}

function renderMyRuleSetup() {
    document.getElementById('battle-screen-title').textContent = 'マイルール設定';
    var mr = myRuleSetting;
    var html = '<div style="padding:0 16px 80px;">'
        + '<div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:12px;padding:14px;margin-bottom:14px;">'
        + '<div class="rule-setting-row"><div><div class="rule-setting-label">勝利ポイント</div><div class="rule-setting-sub">この点数先取で1試合の勝利</div></div>'
        + '<input class="rule-setting-input" type="number" min="1" max="20" id="mr-winpt" value="' + mr.winPt + '"></div>'
        + '<div class="rule-setting-row"><div><div class="rule-setting-label">使用デッキ数</div><div class="rule-setting-sub">1試合で使えるデッキの数</div></div>'
        + '<input class="rule-setting-input" type="number" min="1" max="5" id="mr-deckcnt" value="' + mr.deckCount + '"></div>'
        + '<div class="rule-setting-row"><div><div class="rule-setting-label">パーツ重複なし</div><div class="rule-setting-sub">デッキ間で同名パーツを使えない</div></div>'
        + '<div class="toggle-btn ' + (mr.noDupe ? 'on' : '') + '" id="mr-nodupe-toggle" onclick="toggleMyRuleNoDupe()"><div class="toggle-dot"></div></div></div>'
        + '</div>'
        + '<div style="display:flex;gap:8px;">'
        + '<button class="btn-sm" onclick="renderBattleHome()" style="flex:1;padding:11px;">戻る</button>'
        + '<button class="btn-save" onclick="applyMyRule()" style="flex:2;padding:11px;border:none;border-radius:8px;cursor:pointer;font-size:13px;">この設定で開始</button>'
        + '</div>'
        + '</div>';
    document.getElementById('battle-content').innerHTML = html;
}

function toggleMyRuleNoDupe() {
    myRuleSetting.noDupe = !myRuleSetting.noDupe;
    var t = document.getElementById('mr-nodupe-toggle');
    if (t) t.classList.toggle('on', myRuleSetting.noDupe);
}
function applyMyRule() {
    myRuleSetting.winPt = parseInt(document.getElementById('mr-winpt').value) || 4;
    myRuleSetting.deckCount = parseInt(document.getElementById('mr-deckcnt').value) || 1;
    saveMyRule();
    BS.ruleWinPt = myRuleSetting.winPt;
    BS.ruleDeckCount = myRuleSetting.deckCount;
    BS.ruleNoDupe = myRuleSetting.noDupe;
    BS.myDecks = Array(BS.ruleDeckCount).fill(null).map(function () { return { name: '', parts: null, deckId: null, isNew: false, choiceMode: null }; });
    BS.oppDecks = Array(BS.ruleDeckCount).fill(null).map(function () { return { name: '', parts: null, deckId: null, isNew: false, choiceMode: null }; });
    renderBattleSetup();
}

// ============================================================
// デッキ選択セットアップ画面
// ============================================================
var setupEditTarget = null; // {side:'my'|'opp', idx:int}

function renderBattleSetup() {
    document.getElementById('battle-screen-title').textContent = 'デッキを選択';
    var deckCount = BS.ruleDeckCount;
    var html = '<div style="padding:0 0 80px;">';

    // 自分のデッキ
    html += '<div class="battle-section"><div class="battle-section-title">自分のデッキ（' + deckCount + '個）</div>';
    for (var i = 0; i < deckCount; i++) {
        html += renderDeckSelectSlot('my', i);
    }
    html += '</div>';

    html += '<div class="battle-vs">VS</div>';

    // 相手の名前入力
    html += '<div class="battle-section">'
        + '<div class="battle-section-title">対戦相手の名前</div>'
        + '<input class="battle-name-input" id="opp-name-inp" value="' + BS.oppName + '" placeholder="対戦相手" '
        + 'oninput="BS.oppName=this.value||\'対戦相手\'">'
        + '</div>';

    // 相手のデッキ
    html += '<div class="battle-section"><div class="battle-section-title">' + BS.oppName + 'のデッキ（' + deckCount + '個）</div>';
    for (var i = 0; i < deckCount; i++) {
        html += renderDeckSelectSlot('opp', i);
    }
    html += '</div>';

    // 開始ボタン
    html += '<div style="padding:0 16px;">'
        + '<button class="btn-save" onclick="tryStartBattle()" style="width:100%;padding:13px;border:none;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;">バトル開始</button>'
        + '</div>';

    html += '</div>';
    document.getElementById('battle-content').innerHTML = html;
}

function renderDeckSelectSlot(side, idx) {
    var deck = (side === 'my' ? BS.myDecks : BS.oppDecks)[idx];
    var arr = (side === 'my' ? BS.myDecks : BS.oppDecks);
    var label = (BS.ruleDeckCount > 1 ? 'デッキ ' + (idx + 1) : 'デッキ');

    // 重複チェック（デッキが選択済みの場合のみ）
    var dupeWarn = '';
    if (deck.parts) {
        var names = getAllNames(deck.parts);
        var dupInfo = checkDeckDupe(arr, idx, names);
        if (dupInfo) {
            dupeWarn = '<div style="color:var(--danger);font-size:11px;margin-top:6px;">'
                + '⚠️ デッキ' + dupInfo.deckNum + 'と重複：' + dupInfo.parts.join(', ')
                + '</div>';
        }
    }

    var html = '<div class="deck-select-slot" id="slot-' + side + '-' + idx + '">'
        + '<div class="deck-slot-label">' + label + '</div>'
        + '<div class="deck-slot-choice">'
        + '<button class="deck-choice-btn ' + (deck.choiceMode === 'saved' ? 'active' : '') + '" onclick="selectDeckChoiceMode(\'' + side + '\',' + idx + ',\'saved\')">🌀 マイデッキから選択</button>'
        + '<button class="deck-choice-btn ' + (deck.choiceMode === 'new' ? 'active' : '') + '" onclick="selectDeckChoiceMode(\'' + side + '\',' + idx + ',\'new\')">✏️ 新しいデッキを組む</button>'
        + '</div>';
    if (deck.parts) {
        html += '<div class="deck-chosen-display">'
            + '<div style="font-size:13px;font-weight:500;">' + deck.name + '</div>'
            + '<div class="deck-chosen-parts">' + getAllNames(deck.parts).join(' / ') + '</div>'
            + dupeWarn
            + '<button class="btn-sm" onclick="clearDeckSlot(\'' + side + '\',' + idx + ')" style="font-size:10px;padding:3px 8px;margin-top:6px;">変更</button>'
            + '</div>';
    }
    html += '</div>';
    return html;
}

function selectDeckChoiceMode(side, idx, mode) {
    var arr = side === 'my' ? BS.myDecks : BS.oppDecks;
    arr[idx].choiceMode = mode;
    if (mode === 'saved') {
        openSavedDeckPicker(side, idx);
    } else {
        openNewDeckBuilder(side, idx);
    }
}

function clearDeckSlot(side, idx) {
    var arr = side === 'my' ? BS.myDecks : BS.oppDecks;
    arr[idx] = { name: '', parts: null, deckId: null, isNew: false, choiceMode: null };
    renderBattleSetup();
}

// マイデッキ選択モーダル
function openSavedDeckPicker(side, idx) {
    setupEditTarget = { side: side, idx: idx };
    var html = '';
    if (!decks.length) {
        html = '<div class="empty" style="padding:20px 0;">登録されているデッキがありません</div>';
    } else {
        html = decks.map(function (d) {
            return '<div class="part-sel-item" onclick="pickSavedDeck(' + d.id + ')" style="margin-bottom:8px;cursor:pointer;">'
                + '<div style="flex:1;">'
                + '<div style="font-size:13px;font-weight:500;">' + d.name + '</div>'
                + '<div style="font-size:10px;color:var(--text2);margin-top:2px;">' + getAllNames(d).join(' / ') + '</div>'
                + '</div>'
                + '<i class="ti ti-chevron-right" style="color:var(--text3);"></i>'
                + '</div>';
        }).join('');
    }
    document.getElementById('battle-deck-modal-content').innerHTML = html;
    document.getElementById('modal-battle-deck').classList.remove('hidden');
}

function closeBattleDeckModal() {
    document.getElementById('modal-battle-deck').classList.add('hidden');
    document.getElementById('battle-deck-modal-content').innerHTML = '';
}

function pickSavedDeck(deckId) {
    var d = decks.find(function (x) { return x.id === deckId; });
    if (!d) return;
    var t = setupEditTarget;
    var arr = t.side === 'my' ? BS.myDecks : BS.oppDecks;
    arr[t.idx] = { name: d.name, parts: d, deckId: deckId, isNew: false, choiceMode: 'saved' };
    closeBattleDeckModal();
    renderBattleSetup();
}

// 新規デッキ組み立てモーダル（既存のデッキビルダーを流用）
function openNewDeckBuilder(side, idx) {
    setupEditTarget = { side: side, idx: idx };
    // 既存のopenAddDeckを呼び出してモーダルを開く
    // 保存ボタンの動作だけ差し替え
    deckMode = 'all';
    pickerMode = 'all';
    DS = {
        bladeLine: null, cxPat: 3, blade: null, lock: null, main: null, assist: null,
        lock4: null, metal: null, over: null, assist4: null, ratchet: null, bit: null, combo: null
    };
    userEditedName = false;
    document.getElementById('deck-name-inp').value = '';
    document.getElementById('deck-name-inp').oninput = function () { userEditedName = true; };
    document.getElementById('deck-name-hint').textContent = '';
    document.getElementById('dt-owned').classList.remove('active');
    document.getElementById('dt-all').classList.add('active');
    updateDeckDisplay();
    // 保存ボタンを差し替え
    var saveBtn = document.querySelector('#modal-deck .btn-save');
    if (saveBtn) {
        saveBtn.textContent = 'このデッキで出場';
        saveBtn.onclick = function () { saveTempDeck(); };
    }
    document.getElementById('modal-deck').classList.remove('hidden');
}

function saveTempDeck() {
    var isCX = DS.bladeLine === 'cx';
    if (!DS.bladeLine) { showToast('ブレードを選択してください'); return; }
    if (!isCX && !DS.blade) { showToast('ブレードを選択してください'); return; }
    if (isCX && DS.cxPat === 3 && !(DS.lock && DS.main && DS.assist)) { showToast('CXパーツをすべて選択してください'); return; }
    if (isCX && DS.cxPat === 4 && !(DS.lock4 && DS.metal && DS.over && DS.assist4)) { showToast('CXパーツをすべて選択してください'); return; }
    if (!DS.combo && !DS.ratchet) { showToast('ラチェット（または一体型ビット）を選択してください'); return; }
    if (!DS.combo && !DS.bit) { showToast('ビット（または一体型ビット）を選択してください'); return; }

    var bp = '';
    if (isCX) { if (DS.cxPat === 3) bp = (DS.lock || '') + (DS.main || '') + (DS.assist || ''); else bp = (DS.lock4 || '') + (DS.metal || '') + (DS.over || '') + (DS.assist4 || ''); }
    else bp = DS.blade || '';
    var auto = bp + (DS.combo || DS.ratchet || '') + (DS.combo ? '' : (DS.bit || ''));
    var inputName = document.getElementById('deck-name-inp').value.trim();
    var deckName = inputName || auto || '新しいデッキ';

    var tempDeck = {
        name: deckName, bladeLine: DS.bladeLine, blade: !isCX ? DS.blade : null,
        lock: isCX && DS.cxPat === 3 ? DS.lock : null, main: isCX && DS.cxPat === 3 ? DS.main : null,
        assist: isCX && DS.cxPat === 3 ? DS.assist : null,
        lock4: isCX && DS.cxPat === 4 ? DS.lock4 : null, metal: isCX && DS.cxPat === 4 ? DS.metal : null,
        over: isCX && DS.cxPat === 4 ? DS.over : null, assist4: isCX && DS.cxPat === 4 ? DS.assist4 : null,
        ratchet: DS.combo ? null : DS.ratchet, bit: DS.combo ? null : DS.bit, combo: DS.combo || null,
    };

    var t = setupEditTarget;
    var arr = t.side === 'my' ? BS.myDecks : BS.oppDecks;
    arr[t.idx] = { name: deckName, parts: tempDeck, deckId: null, isNew: true, choiceMode: 'new' };

    // 保存ボタンを元に戻す
    var saveBtn = document.querySelector('#modal-deck .btn-save');
    if (saveBtn) { saveBtn.textContent = '保存'; saveBtn.onclick = function () { saveDeck(); }; }
    closeModal('modal-deck');
    renderBattleSetup();
}

// ============================================================
// デッキ重複チェック共通関数
// ============================================================
function checkDeckDupe(deckArr, skipIdx, newNames) {
    if (!BS.ruleNoDupe) return null;
    for (var i = 0; i < deckArr.length; i++) {
        if (i === skipIdx) continue;
        if (!deckArr[i].parts) continue;
        var otherNames = getAllNames(deckArr[i].parts);
        var dupes = newNames.filter(function (n) {
            return otherNames.indexOf(n) >= 0;
        });
        if (dupes.length) return { deckNum: i + 1, parts: dupes };
    }
    return null;
}

function checkAllDecksDupe(deckArr, label) {
    for (var i = 0; i < deckArr.length; i++) {
        if (!deckArr[i].parts) continue;
        var names = getAllNames(deckArr[i].parts);
        var dup = checkDeckDupe(deckArr, i, names);
        if (dup) return label + 'のデッキ' + (i + 1) + 'とデッキ' + dup.deckNum + 'に重複：' + dup.parts.join(', ');
    }
    return null;
}

function tryStartBattle() {
    // 全デッキ選択確認
    var allSet = BS.myDecks.every(function (d) { return !!d.parts; })
        && BS.oppDecks.every(function (d) { return !!d.parts; });
    if (!allSet) { showToast('全てのデッキを選択してください'); return; }

    // 重複チェック（ruleNoDupeがtrueの場合のみ）
    var myDupe = checkAllDecksDupe(BS.myDecks, myPlayerName);
    if (myDupe) { showToast(myDupe); return; }

    var oppDupe = checkAllDecksDupe(BS.oppDecks, BS.oppName);
    if (oppDupe) { showToast(oppDupe); return; }

    BS.currentMyDeckIdx = 0;
    BS.currentOppDeckIdx = 0;
    BS.myPt = 0; BS.oppPt = 0; BS.battles = [];
    renderBattleArena();
}

// ============================================================
// バトルアリーナ
// ============================================================
function renderBattleArena() {
    document.getElementById('battle-screen-title').textContent = 'バトル中';
    var myDeck = BS.myDecks[BS.currentMyDeckIdx];
    var oppDeck = BS.oppDecks[BS.currentOppDeckIdx];
    var html = '<div class="battle-arena" style="padding-bottom:80px;">';

    // スコアボード
    html += '<div class="battle-score-board">'
        + '<div class="battle-player-score ' + (BS.myPt >= BS.ruleWinPt ? 'winner' : '') + '">'
        + '<div class="battle-player-name">' + myPlayerName + '</div>'
        + '<div class="battle-score-num">' + BS.myPt + '</div>'
        + '<div class="battle-score-max">/ ' + BS.ruleWinPt + 'pt</div>'
        + '</div>'
        + '<div class="battle-vs-center">VS</div>'
        + '<div class="battle-player-score ' + (BS.oppPt >= BS.ruleWinPt ? 'winner' : '') + '">'
        + '<div class="battle-player-name">' + BS.oppName + '</div>'
        + '<div class="battle-score-num">' + BS.oppPt + '</div>'
        + '<div class="battle-score-max">/ ' + BS.ruleWinPt + 'pt</div>'
        + '</div>'
        + '</div>';

    // 現在のデッキ表示
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">'
        + '<div style="background:var(--bg2);border-radius:8px;padding:8px;border:0.5px solid var(--border);">'
        + '<div style="font-size:9px;color:var(--text3);">' + myPlayerName + 'のデッキ</div>'
        + '<div style="font-size:12px;font-weight:500;margin-top:2px;">' + myDeck.name + '</div>'
        + '<div style="font-size:10px;color:var(--text2);margin-top:2px;">' + getAllNames(myDeck.parts).join(' / ') + '</div>'
        + '</div>'
        + '<div style="background:var(--bg2);border-radius:8px;padding:8px;border:0.5px solid var(--border);">'
        + '<div style="font-size:9px;color:var(--text3);">' + BS.oppName + 'のデッキ</div>'
        + '<div style="font-size:12px;font-weight:500;margin-top:2px;">' + oppDeck.name + '</div>'
        + '<div style="font-size:10px;color:var(--text2);margin-top:2px;">' + getAllNames(oppDeck.parts).join(' / ') + '</div>'
        + '</div>'
        + '</div>';

    // フィニッシュ選択
    html += '<div style="font-size:11px;color:var(--text2);margin-bottom:8px;">バトル結果を選択</div>';
    html += '<div style="font-size:10px;color:var(--text3);margin-bottom:6px;">— ' + myPlayerName + 'の勝ち —</div>';
    html += '<div class="finish-grid">';
    ['ef', 'bf', 'of', 'sf'].forEach(function (f) {
        html += '<div class="finish-btn ' + f + '" onclick="recordBattle(\'my\',\'' + f + '\' )">'
            + '<div class="finish-btn-name">' + FINISH_LABEL[f] + '</div>'
            + '<div class="finish-btn-pt">+' + FINISH_PT[f] + 'pt</div>'
            + '</div>';
    });
    html += '</div>';
    html += '<div style="font-size:10px;color:var(--text3);margin-bottom:6px;">— ' + BS.oppName + 'の勝ち —</div>';
    html += '<div class="finish-grid">';
    ['ef', 'bf', 'of', 'sf'].forEach(function (f) {
        html += '<div class="finish-btn ' + f + '" onclick="recordBattle(\'opp\',\'' + f + '\')">'
            + '<div class="finish-btn-name">' + FINISH_LABEL[f] + '</div>'
            + '<div class="finish-btn-pt">+' + FINISH_PT[f] + 'pt</div>'
            + '</div>';
    });
    html += '</div>';
    html += '<div style="margin-bottom:6px;">'
        + '<div class="finish-btn" style="border-color:var(--text3);" onclick="recordBattle(\'draw\',\'draw\')">'
        + '<div class="finish-btn-name">引き分け</div>'
        + '<div class="finish-btn-pt">0pt</div>'
        + '</div>'
        + '</div>';

    // バトルログ
    if (BS.battles.length) {
        html += '<div class="battle-section-title" style="margin-top:4px;">バトルログ</div>';
        html += '<div class="battle-log">';
        BS.battles.slice().reverse().forEach(function (b, i) {
            var ri = BS.battles.length - 1 - i;
            var winner = b.winner === 'my' ? myPlayerName : b.winner === 'opp' ? BS.oppName : '引き分け';
            var finish = b.winner === 'draw' ? '引き分け' : FINISH_LABEL[b.finish];
            html += '<div class="battle-log-item">バトル' + (ri + 1) + ': ' + winner + ' 勝利（' + finish + '）'
                + ' — ' + myPlayerName + ' ' + b.myPtAfter + 'pt / ' + BS.oppName + ' ' + b.oppPtAfter + 'pt</div>';
        });
        html += '</div>';
    }

    html += '</div>';
    document.getElementById('battle-content').innerHTML = html;
}

function recordBattle(winner, finish) {
    var pt = winner === 'draw' ? 0 : FINISH_PT[finish];
    if (winner === 'my') BS.myPt += pt;
    else if (winner === 'opp') BS.oppPt += pt;

    BS.battles.push({
        winner: winner, finish: finish, pt: pt,
        myPtAfter: BS.myPt, oppPtAfter: BS.oppPt,
        myDeckIdx: BS.currentMyDeckIdx,
        oppDeckIdx: BS.currentOppDeckIdx,
    });

    // 3on3: デッキ切り替え（バーストフィニッシュ等で相手のデッキが次に）
    // 公式: 負けたブレーダーが次のデッキに交代
    if (BS.ruleDeckCount > 1 && winner !== 'draw') {
        if (winner === 'my' && BS.currentOppDeckIdx < BS.oppDecks.length - 1) BS.currentOppDeckIdx++;
        else if (winner === 'opp' && BS.currentMyDeckIdx < BS.myDecks.length - 1) BS.currentMyDeckIdx++;
    }

    // 勝利判定
    if (BS.myPt >= BS.ruleWinPt) {
        BS.finished = true; BS.winner = 'my';
        renderBattleResult();
    } else if (BS.oppPt >= BS.ruleWinPt) {
        BS.finished = true; BS.winner = 'opp';
        renderBattleResult();
    } else {
        renderBattleArena();
    }
}

// ============================================================
// リザルト
// ============================================================
function renderBattleResult() {
    document.getElementById('battle-screen-title').textContent = 'リザルト';
    var isMyWin = BS.winner === 'my';
    var isDraw = BS.winner === 'draw';
    var resultClass = isDraw ? 'draw' : isMyWin ? 'win' : 'lose';
    var resultLabel = isDraw ? '引き分け' : isMyWin ? '勝利！' : '敗北';

    // 対戦記録をbattleRecordsに追加
    var matchResult = isDraw ? 'draw' : isMyWin ? 'win' : 'loss';
    var record = {
        id: Date.now(),
        date: new Date().toISOString(),
        mode: BS.mode,
        myName: myPlayerName,
        oppName: BS.oppName,
        myPt: BS.myPt, oppPt: BS.oppPt,
        result: matchResult,
        battles: BS.battles.map(function (b) { return Object.assign({}, b, { result: b.winner === 'my' ? 'win' : b.winner === 'opp' ? 'loss' : 'draw' }); }),
        myDecks: BS.myDecks.map(function (d) { return { name: d.name, parts: d.parts, deckId: d.deckId }; }),
        oppDecks: BS.oppDecks.map(function (d) { return { name: d.name, parts: d.parts, deckId: d.deckId }; }),
    };
    battleRecords.push(record);
    saveBattleRecords();

    var html = '<div style="padding:0 0 80px;">';
    html += '<div class="result-card result-' + resultClass + '">'
        + '<div class="result-label ' + resultClass + '">' + resultLabel + '</div>'
        + '<div class="result-detail">' + myPlayerName + ' ' + BS.myPt + 'pt / ' + BS.oppName + ' ' + BS.oppPt + 'pt</div>'
        + '</div>';

    // 未登録デッキの確認
    html += renderUnregDeckPrompts();

    html += '<div style="padding:0 16px;display:flex;flex-direction:column;gap:8px;">'
        + '<button class="btn-save" onclick="retryBattleSetup(BS.mode)" style="width:100%;padding:12px;border:none;border-radius:10px;font-size:13px;cursor:pointer;">もう一度</button>'
        + '<button class="btn-sm" onclick="renderBattleHome()" style="width:100%;padding:12px;text-align:center;">モード選択に戻る</button>'
        + '</div>';
    html += '</div>';

    document.getElementById('battle-content').innerHTML = html;
    renderHome();
}

function renderUnregDeckPrompts() {
    var html = '';
    var allDecks = BS.myDecks.concat(BS.oppDecks);
    // 使用したデッキ（未登録のもの）
    var usedIdxSet = {};
    BS.battles.forEach(function (b) {
        usedIdxSet['my_' + b.myDeckIdx] = true;
        usedIdxSet['opp_' + b.oppDeckIdx] = true;
    });
    // 未使用の未登録デッキも3on3で試合終了時に確認
    for (var i = 0; i < BS.myDecks.length; i++) usedIdxSet['my_' + i] = true;
    for (var i = 0; i < BS.oppDecks.length; i++) usedIdxSet['opp_' + i] = true;

    BS.myDecks.forEach(function (d, i) {
        if (d.isNew && d.parts) {
            html += '<div class="unreg-deck-card">'
                + '<div class="unreg-deck-title"><i class="ti ti-alert-circle"></i>未登録のデッキがあります</div>'
                + '<div class="unreg-deck-name">' + d.name + '</div>'
                + '<div class="unreg-deck-parts">' + getAllNames(d.parts).join(' / ') + '</div>'
                + '<div style="display:flex;gap:8px;margin-top:10px;">'
                + '<button class="btn-save" onclick="registerTempDeck(\'my\',' + i + ')" style="flex:1;padding:9px;border:none;border-radius:8px;font-size:12px;cursor:pointer;">登録する</button>'
                + '<button class="btn-sm" onclick="discardTempDeck(\'my\',' + i + ')" style="flex:1;padding:9px;text-align:center;font-size:12px;">いいえ</button>'
                + '</div>'
                + '</div>';
        }
    });
    BS.oppDecks.forEach(function (d, i) {
        if (d.isNew && d.parts) {
            html += '<div class="unreg-deck-card">'
                + '<div class="unreg-deck-title"><i class="ti ti-alert-circle"></i>' + BS.oppName + 'の未登録デッキ</div>'
                + '<div class="unreg-deck-name">' + d.name + '</div>'
                + '<div class="unreg-deck-parts">' + getAllNames(d.parts).join(' / ') + '</div>'
                + '<div style="display:flex;gap:8px;margin-top:10px;">'
                + '<button class="btn-save" onclick="registerTempDeck(\'opp\',' + i + ')" style="flex:1;padding:9px;border:none;border-radius:8px;font-size:12px;cursor:pointer;">登録する</button>'
                + '<button class="btn-sm" onclick="discardTempDeck(\'opp\',' + i + ')" style="flex:1;padding:9px;text-align:center;font-size:12px;">いいえ</button>'
                + '</div>'
                + '</div>';
        }
    });
    return html;
}

function registerTempDeck(side, idx) {
    var arr = side === 'my' ? BS.myDecks : BS.oppDecks;
    var d = arr[idx];
    if (!d || !d.parts) return;
    var p = d.parts;
    var newDeck = Object.assign({}, p, { id: nextDeckId++, name: d.name, battle: false });
    decks.push(newDeck);
    arr[idx].isNew = false;
    arr[idx].deckId = newDeck.id;
    saveDecks();
    showToast('「' + d.name + '」を登録しました', 'ok');
    // リザルト再描画
    var html = document.getElementById('battle-content').innerHTML;
    document.getElementById('battle-content').innerHTML = html.replace(
        /<div class="unreg-deck-card">[\s\S]*?<\/div>\s*<\/div>/, ''
    );
    renderBattleResult();
}

function discardTempDeck(side, idx) {
    var arr = side === 'my' ? BS.myDecks : BS.oppDecks;
    if (arr[idx]) arr[idx].isNew = false;
    renderBattleResult();
}

function renderHome() {
    // 所持パーツ数（qty>0）
    var ownedCount = parts.filter(function (p) { return p.qty > 0; }).length;
    document.getElementById('home-parts-count').textContent = ownedCount;
    document.getElementById('home-decks-count').textContent = decks.length;

    // 勝敗集計（winCountModeに対応）
    var src = winCountMode === 'battle'
        ? battleRecords.reduce(function (a, r) { return a.concat(r.battles || []); }, [])
        : battleRecords;
    var wins = src.filter(function (r) { return r.result === 'win'; }).length;
    var losses = src.filter(function (r) { return r.result === 'loss'; }).length;
    var draws = src.filter(function (r) { return r.result === 'draw'; }).length;
    var total = wins + losses + draws;
    document.getElementById('home-wins').textContent = wins;
    document.getElementById('home-losses').textContent = losses;
    document.getElementById('home-draws').textContent = draws;
    var rateEl = document.getElementById('home-win-rate');
    if (total > 0) {
        rateEl.textContent = Math.round(wins / total * 100) + '%';
    } else {
        rateEl.textContent = '—';
    }

    // 最近追加パーツ（最大5件）
    var recentParts = [].concat(parts).reverse().slice(0, 5);
    var rpEl = document.getElementById('home-recent-parts');
    if (rpEl) {
        if (!recentParts.length) {
            rpEl.innerHTML = '<div style="font-size:11px;color:var(--text3);">パーツ未登録</div>';
        } else {
            rpEl.innerHTML = recentParts.map(function (p) {
                var th = p.img ? '<img src="' + p.img + '">' : (EMO[p.cat] || '❓');
                return '<div class="home-recent-part">'
                    + '<div class="home-recent-part-thumb">' + th + '</div>'
                    + '<div class="home-recent-part-name">' + p.name + '</div>'
                    + '</div>';
            }).join('');
        }
    }

    // 最近追加デッキ（最大3件）
    var recentDecks = [].concat(decks).reverse().slice(0, 3);
    var rdEl = document.getElementById('home-recent-decks');
    if (rdEl) {
        if (!recentDecks.length) {
            rdEl.innerHTML = '<div style="font-size:11px;color:var(--text3);">デッキ未登録</div>';
        } else {
            rdEl.innerHTML = recentDecks.map(function (d) {
                return '<div class="home-recent-deck">'
                    + '<div class="home-recent-deck-name">' + d.name + '</div>'
                    + '<div class="home-recent-deck-parts">' + getAllNames(d).join(' / ') + '</div>'
                    + '</div>';
            }).join('');
        }
    }

    // 計測最高記録
    var bestTimeEl = document.getElementById('home-best-time');
    if (bestTimeEl) {
        var bestTime = 0, bestDeckName = '', bestDate = '';
        Object.keys(measureRecords).forEach(function (deckId) {
            var recs = measureRecords[deckId] || [];
            recs.forEach(function (r) {
                if (r.time_ms > bestTime) {
                    bestTime = r.time_ms;
                    bestDate = r.date;
                    var d = decks.find(function (x) { return x.id === parseInt(deckId); });
                    bestDeckName = d ? d.name : '不明なデッキ';
                }
            });
        });
        if (bestTime > 0) {
            bestTimeEl.innerHTML = '<div class="home-deck-card" style="border-color:var(--accent);">'
                + '<div style="display:flex;align-items:center;justify-content:space-between;">'
                + '<div>'
                + '<div style="font-size:10px;color:var(--text2);margin-bottom:2px;">🏆 ベストタイム</div>'
                + '<div style="font-size:10px;color:var(--text2);margin-bottom:2px;">持久力</div>'
                + '<div style="font-size:24px;font-weight:700;color:var(--accent);">' + fmtTimeSec(bestTime) + ' 秒</div>'
                + '<div style="font-size:11px;color:var(--text2);margin-top:2px;">' + bestDeckName + '</div>'
                + '</div>'
                + '<div style="font-size:10px;color:var(--text3);">' + new Date(bestDate).toLocaleDateString('ja-JP') + '</div>'
                + '</div>'
                + '</div>';
        } else {
            bestTimeEl.innerHTML = '<div style="font-size:11px;color:var(--text3);">計測記録なし</div>';
        }
    }

    // 試合用デッキ
    var battleDecks = decks.filter(function (d) { return d.battle; });
    var el = document.getElementById('home-battle-decks');
    if (!battleDecks.length) {
        el.innerHTML = '<div class="home-empty">試合用デッキが登録されていません<br>マイデッキから「試合用に登録」してください</div>';
        return;
    }
    el.innerHTML = battleDecks.map(function (d, idx) {
        var parts_list = [];
        if (d.blade) parts_list.push({ label: 'ブレード', name: d.blade });
        if (d.lock) parts_list.push({ label: 'ロック', name: d.lock });
        if (d.main) parts_list.push({ label: 'メイン', name: d.main });
        if (d.assist) parts_list.push({ label: 'アシスト', name: d.assist });
        if (d.lock4) parts_list.push({ label: 'ロック', name: d.lock4 });
        if (d.metal) parts_list.push({ label: 'メタル', name: d.metal });
        if (d.over) parts_list.push({ label: 'オーバー', name: d.over });
        if (d.assist4) parts_list.push({ label: 'アシスト', name: d.assist4 });
        if (d.combo) parts_list.push({ label: '一体型', name: d.combo });
        else {
            if (d.ratchet) parts_list.push({ label: 'ラチェット', name: d.ratchet });
            if (d.bit) parts_list.push({ label: 'ビット', name: d.bit });
        }
        var slots = parts_list.map(function (p) {
            return '<span class="home-deck-part"><span style="color:var(--color-text-tertiary,var(--text3));font-size:9px;">' + p.label + '</span> ' + p.name + '</span>';
        }).join('');
        return '<div class="home-deck-card">'
            + '<div class="home-deck-name">'
            + '<span style="font-size:11px;background:rgba(76,175,130,0.2);color:#4caf82;padding:2px 8px;border-radius:10px;">DECK ' + (idx + 1) + '</span>'
            + d.name
            + '</div>'
            + '<div class="home-deck-slot">' + slots + '</div>'
            + '</div>';
    }).join('');
}

function renderStats() {
    var c = { blade: 0, ratchet: 0, bit: 0, combo: 0 };
    parts.forEach(function (p) { c[p.cat] = (c[p.cat] || 0) + p.qty; });
    document.getElementById('stats-row').innerHTML =
        ['blade', 'ratchet', 'bit', 'combo'].map(function (k) {
            return '<div class="stat ' + k + '"><div class="stat-num">' + (c[k] || 0) + '</div><div class="stat-label">' + (k === 'combo' ? '一体型' : CATLBL[k]) + '</div></div>';
        }).join('');
}
function renderMainTabs() {
    document.getElementById('main-tabs').innerHTML =
        ['all', 'blade', 'ratchet', 'bit', 'combo'].map(function (t) {
            return '<span class="tab-chip ' + (mainTab === t ? 'active' : '') + '" onclick="setMainTab(\'' + t + '\')">' + (t === 'all' ? 'すべて' : t === 'combo' ? '一体型ビット' : CATLBL[t]) + '</span>';
        }).join('');
}
function renderSubTabs() {
    var area = document.getElementById('sub-tabs-area');
    if (mainTab !== 'blade') { area.innerHTML = ''; return; }
    var h = '<div class="sub-tabs">';
    ['all', 'bx', 'ux', 'cx'].forEach(function (l) {
        h += '<span class="sub-tab ' + (bladeSubTab === l ? 'active' : '') + '" onclick="setBladeSubTab(\'' + l + '\')">' + (l === 'all' ? 'すべて' : LINE[l]) + '</span>';
    });
    h += '</div>';
    if (bladeSubTab === 'cx') {
        h += '<div class="cx-tabs">';
        ['lock', 'main', 'assist', 'metal', 'over'].forEach(function (c) {
            h += '<span class="cx-tab ' + (cxSubTab === c ? 'active' : '') + '" onclick="setCxSubTab(\'' + c + '\')">' + CXLBL[c] + '</span>';
        });
        h += '</div>';
    }
    area.innerHTML = h;
}
var partsSearchQuery = '';

function normalizeStr(s) {
    // ひらがな→カタカナ変換して比較
    return s.replace(/[ぁ-ゖ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) + 0x60); }).toLowerCase();
}

function getFiltered() {
    var q = normalizeStr(partsSearchQuery.trim());
    return parts.filter(function (p) {
        if (mainTab !== 'all' && mainTab !== p.cat) return false;
        if (mainTab === 'blade') {
            if (bladeSubTab !== 'all' && bladeSubTab !== p.line) return false;
            if (bladeSubTab === 'cx' && p.cxType !== cxSubTab) return false;
        }
        if (q && normalizeStr(p.name).indexOf(q) < 0) return false;
        return true;
    });
}

function onPartsSearch(val) {
    partsSearchQuery = val;
    var wrap = document.getElementById('parts-search-wrap');
    if (wrap) wrap.classList.toggle('has-query', !!val);
    updatePartsDatalist(val);
    // パーツリストだけ更新（検索窓は再描画しない）
    var list = document.getElementById('parts-list');
    var filtered = getFiltered();
    if (!filtered.length) {
        list.innerHTML = '<div class="empty">「' + val + '」に一致するパーツがありません</div>';
        return;
    }
    // renderPartsのリスト部分だけ実行
    renderStats();
    list.innerHTML = filtered.map(function (p) {
        var th = p.img ? '<img src="' + p.img + '" alt="' + p.name + '">'
            : '<span class="part-thumb-placeholder">' + EMO[p.cat] + '</span>';
        var statsOpen = p._statsOpen ? 'open' : '';
        var memoOpen = p._memoOpen ? 'open' : '';
        return '<div class="part-card" id="pcard-' + p.id + '">'
            + '<div class="part-del-btn" onclick="askDelPart(' + p.id + ')" title="削除"><i class="ti ti-minus"></i></div>'
            + '<div class="part-card-inner">'
            + '<div class="part-thumb-col">'
            + '<div class="part-thumb">' + th + '</div>'
            + '<div class="part-qty-row">'
            + '<button class="qty-btn" onclick="chgQty(' + p.id + ',-1)" style="width:24px;height:24px;font-size:14px;">−</button>'
            + '<span class="qty-num" id="qty-' + p.id + '" style="font-size:14px;min-width:18px;">' + p.qty + '</span>'
            + '<button class="qty-btn" onclick="chgQty(' + p.id + ',1)" style="width:24px;height:24px;font-size:14px;">＋</button>'
            + '</div>'
            + '</div>'
            + '<div class="part-info">'
            + '<div class="part-name">' + p.name + '</div>'
            + '<div class="part-badges">' + getBadges(p) + '</div>'
            + (p.memo && memoOpen ? '<div class="part-memo-full open" id="pmemo-' + p.id + '">' + p.memo + '</div>' : '<div class="part-memo-full" id="pmemo-' + p.id + '">' + p.memo + '</div>')
            + '<div class="part-actions">'
            + '<button class="btn-sm" onclick="openEditPart(' + p.id + ')" style="font-size:10px;padding:3px 10px;"><i class="ti ti-pencil"></i> 編集</button>'
            + '<button class="btn-sm" onclick="toggleMemo(' + p.id + ')" style="font-size:10px;padding:3px 10px;" id="pmemo-btn-' + p.id + '">'
            + (p._memoOpen ? '<i class="ti ti-chevron-up"></i> 閉じる' : '<i class="ti ti-notes"></i> 詳細')
            + '</button>'
            + '</div>'
            + '</div>'
            + '</div>'
            + '<div class="part-stats-area ' + statsOpen + '" id="pstats-' + p.id + '">'
            + getPartStatsHtml(p)
            + '</div>'
            + '</div>';
    }).join('');
}

function clearPartsSearch() {
    partsSearchQuery = '';
    var inp = document.getElementById('parts-search-inp');
    if (inp) inp.value = '';
    var wrap = document.getElementById('parts-search-wrap');
    if (wrap) wrap.classList.remove('has-query');
    renderParts();
}

function updatePartsDatalist(q) {
    var dl = document.getElementById('parts-search-list');
    if (!dl) return;
    var nq = normalizeStr(q || '');
    // 現在のタブ内パーツ候補
    var candidates = parts.filter(function (p) {
        if (mainTab !== 'all' && mainTab !== p.cat) return false;
        if (mainTab === 'blade') {
            if (bladeSubTab !== 'all' && bladeSubTab !== p.line) return false;
            if (bladeSubTab === 'cx' && p.cxType !== cxSubTab) return false;
        }
        if (nq && normalizeStr(p.name).indexOf(nq) < 0) return false;
        return true;
    }).slice(0, 10);
    dl.innerHTML = candidates.map(function (p) { return '<option value="' + p.name + '">'; }).join('');
}
function renderParts() {
    renderStats(); renderMainTabs(); renderSubTabs();
    var list = document.getElementById('parts-list');
    var filtered = getFiltered();
    if (!filtered.length) { list.innerHTML = '<div class="empty">パーツがありません<br>「追加」から登録してください</div>'; return; }
    list.innerHTML = filtered.map(function (p) {
        var th = p.img ? '<img src="' + p.img + '" alt="' + p.name + '">'
            : '<span class="part-thumb-placeholder">' + EMO[p.cat] + '</span>';
        var statsOpen = p._statsOpen ? 'open' : '';
        var memoOpen = p._memoOpen ? 'open' : '';
        return '<div class="part-card" id="pcard-' + p.id + '">'
            // 削除ボタン（右上赤丸）
            + '<div class="part-del-btn" onclick="askDelPart(' + p.id + ')" title="削除"><i class="ti ti-minus"></i></div>'
            + '<div class="part-card-inner">'
            // サムネイル + 所持数ボタン（縦並び）
            + '<div class="part-thumb-col">'
            + '<div class="part-thumb">' + th + '</div>'
            + '<div class="part-qty-row">'
            + '<button class="qty-btn" onclick="chgQty(' + p.id + ',-1)" style="width:24px;height:24px;font-size:14px;">−</button>'
            + '<span class="qty-num" id="qty-' + p.id + '" style="font-size:14px;min-width:18px;">' + p.qty + '</span>'
            + '<button class="qty-btn" onclick="chgQty(' + p.id + ',1)" style="width:24px;height:24px;font-size:14px;">＋</button>'
            + '</div>'
            + '</div>'
            // パーツ情報
            + '<div class="part-info">'
            + '<div class="part-name">' + p.name + '</div>'
            + '<div class="part-badges">' + getBadges(p) + '</div>'
            + (p.memo && memoOpen ? '<div class="part-memo-full open" id="pmemo-' + p.id + '">' + p.memo + '</div>' : '<div class="part-memo-full" id="pmemo-' + p.id + '">' + p.memo + '</div>')
            // アクションボタン横並び
            + '<div class="part-actions">'
            + '<button class="btn-sm" onclick="openEditPart(' + p.id + ')" style="font-size:10px;padding:3px 10px;"><i class="ti ti-pencil"></i> 編集</button>'
            + '<button class="btn-sm" onclick="toggleMemo(' + p.id + ')" style="font-size:10px;padding:3px 10px;" id="pmemo-btn-' + p.id + '">'
            + (p._memoOpen ? '<i class="ti ti-chevron-up"></i> 閉じる' : '<i class="ti ti-notes"></i> 詳細')
            + '</button>'
            + '</div>'
            + '</div>'
            + '</div>'
            // 詳細エリア（統計）
            + '<div class="part-stats-area ' + statsOpen + '" id="pstats-' + p.id + '">'
            + getPartStatsHtml(p)
            + '</div>'
            + '</div>';
    }).join('');
}

function toggleMemo(id) {
    var p = parts.find(function (x) { return x.id === id; });
    if (!p) return;
    p._memoOpen = !p._memoOpen;
    p._statsOpen = p._memoOpen; // 詳細エリアも連動
    var memoEl = document.getElementById('pmemo-' + id);
    var statsEl = document.getElementById('pstats-' + id);
    var btn = document.getElementById('pmemo-btn-' + id);
    if (memoEl) memoEl.classList.toggle('open', p._memoOpen);
    if (statsEl) {
        statsEl.classList.toggle('open', p._memoOpen);
        if (p._memoOpen) statsEl.innerHTML = getPartStatsHtml(p);
    }
    if (btn) btn.innerHTML = p._memoOpen
        ? '<i class="ti ti-chevron-up"></i> 閉じる'
        : '<i class="ti ti-notes"></i> 詳細';
}

// ============================================================
// パーツ統計計算
// ============================================================

//バースト負けの回数
function getBurstLossCount(partName, records) {
    var burstCount = 0;
    for (var i = 0; i < records.length; i++) {
        var record = records[i];
        for (var j = 0; j < record.battles.length; j++) {
            var battle = record.battles[j];
            if (battle.winner === 'opp' && battle.finish === 'bf') {
                var deckUsed = record.myDecks[battle.myDeckIdx];
                var partNames = getAllNames(deckUsed.parts);
                if (partNames.indexOf(partName) >= 0) {
                    burstCount++;
                }
            }
        }
    }
    return burstCount;
}

function getPartStatsHtml(p) {
    // このパーツを含む試合記録を抽出
    var records = getPartRecords(p.name);
    if (!records.length) {
        return '<div class="no-record">対戦記録無し</div>';
    }

    var wins = records.filter(function (r) { return r.result === 'win'; }).length;
    var total = records.length;
    var rate = Math.round(wins / total * 100);

    var html = '';
    // 勝敗サマリー
    html += '<div class="part-stats-title">📊 このパーツの戦績</div>';
    html += '<div class="part-win-rate-row">'
        + '<div class="part-win-rate-num">' + rate + '%</div>'
        + '<div class="part-win-rate-detail">'
        + wins + '勝 ' + (total - wins) + '敗<br>'
        + total + '試合'
        + '</div>'
        + '</div>';

    // ベストコンボパーツ（カテゴリ別）
    html += getBestComboHtml(p, records);

    //バースト回数の表示
    var burstCount = getBurstLossCount(p.name, records);
    if (burstCount > 0) {
        html += '<div class="part-stats-title">💥 バースト負け回数<span style="font-size:22px;font-weight:700;color:var(--danger);">' + burstCount + '</span>'
            + '<span style="font-size:12px;color:var(--text2);"> 回</span>'
            + '</div>';
    }

    return html;
}

function getPartRecords(partName) {
    // battleRecordsからこのパーツを使用した試合を抽出
    return battleRecords.filter(function (r) {
        var myDecks = r.myDecks || [];
        return myDecks.some(function (d) {
            if (!d.parts) return false;
            var dp = d.parts;
            var allNames = [dp.blade, dp.lock, dp.main, dp.assist, dp.lock4, dp.metal, dp.over, dp.assist4, dp.ratchet, dp.bit, dp.combo].filter(Boolean);
            return allNames.indexOf(partName) >= 0;
        });
    });
}

function getBestComboHtml(p, records) {
    // このパーツと一緒に使われた他カテゴリのパーツごとに勝率集計
    // ブレード系なら「ラチェット」「ビット/一体型」でランキング
    // ラチェットなら「ブレード」「ビット」でランキング
    // ビットなら「ブレード」「ラチェット」でランキング

    var cat = p.cat;
    var partName = p.name;
    var targetCats = [];
    if (cat === 'blade') targetCats = ['ratchet', 'bit'];
    else if (cat === 'ratchet') targetCats = ['blade', 'bit'];
    else if (cat === 'bit' || cat === 'combo') targetCats = ['blade', 'ratchet'];

    if (!targetCats.length) return '';

    var html = '<div class="best-combo-section">';
    html += '<div class="part-stats-title" style="margin-top:10px;">⭐ ベストコンボパーツ</div>';

    targetCats.forEach(function (tCat) {
        // このパーツと一緒に使われた tCat のパーツごとに勝率集計
        var comboMap = {};
        records.forEach(function (r) {
            var myDecks = r.myDecks || [];
            myDecks.forEach(function (d) {
                if (!d.parts) return;
                var dp = d.parts;
                var allNames = [dp.blade, dp.lock, dp.main, dp.assist, dp.lock4, dp.metal, dp.over, dp.assist4, dp.ratchet, dp.bit, dp.combo].filter(Boolean);
                if (allNames.indexOf(partName) < 0) return;
                // tCatのパーツを探す
                var comboNames = [];
                if (tCat === 'blade') comboNames = [dp.blade, dp.lock, dp.main, dp.assist, dp.lock4, dp.metal, dp.over, dp.assist4].filter(Boolean);
                else if (tCat === 'ratchet') comboNames = [dp.ratchet].filter(Boolean);
                else if (tCat === 'bit') comboNames = [dp.bit, dp.combo].filter(Boolean);
                comboNames.forEach(function (cn) {
                    if (!comboMap[cn]) comboMap[cn] = { wins: 0, total: 0 };
                    comboMap[cn].total++;
                    if (r.result === 'win') comboMap[cn].wins++;
                });
            });
        });

        // 勝率順にソート（2試合以上のみ）
        var ranked = Object.keys(comboMap)
            .filter(function (k) { return comboMap[k].total >= 1; })
            .map(function (k) {
                return {
                    name: k, wins: comboMap[k].wins, total: comboMap[k].total,
                    rate: Math.round(comboMap[k].wins / comboMap[k].total * 100)
                };
            })
            .sort(function (a, b) { return b.rate - a.rate || b.total - a.total; })
            .slice(0, 3);

        var catLabel = { blade: 'ブレード', ratchet: 'ラチェット', bit: 'ビット/一体型' }[tCat] || tCat;
        html += '<div class="best-combo-title">' + catLabel + '</div>';
        if (!ranked.length) {
            html += '<div style="font-size:10px;color:var(--text3);padding:4px 0 6px;">データ不足(ビット一体型使用の場合ビットでカウントされてます)</div>';
        } else {
            html += '<div class="best-combo-list">';
            ranked.forEach(function (item, i) {
                var medal = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
                html += '<div class="best-combo-item">'
                    + '<span class="best-combo-rank">' + medal + '</span>'
                    + '<span class="best-combo-name">' + item.name + '：勝率' + '</span>'
                    + '<span class="best-combo-rate">' + item.rate + '% (' + item.wins + '勝/' + item.total + '戦中)</span>'
                    + '</div>';
            });
            html += '</div>';
        }
    });

    html += '</div>';
    return html;
}

// 削除確認
var delPartTargetId = null;
function askDelPart(id) {
    var p = parts.find(function (x) { return x.id === id; });
    if (!p) return;
    delPartTargetId = id;
    document.getElementById('del-part-msg').textContent = '「' + p.name + '」を削除しますか？';
    document.getElementById('modal-del-part').classList.remove('hidden');
}
function confirmDelPart() {
    parts = parts.filter(function (x) { return x.id !== delPartTargetId; });
    closeModal('modal-del-part');
    saveParts();
    renderParts();
}
function getBadges(p) {
    var b = '<span class="badge ' + p.cat + '">' + CATLBL[p.cat] + '</span>';
    if (p.cat === 'blade') {
        b += '<span class="badge ' + p.line + '">' + LINE[p.line] + '</span>';
        if (p.line === 'cx' && p.cxType) {
            var cls = { lock: 'lock', main: 'main-b', assist: 'assist', metal: 'metal', over: 'over' }[p.cxType] || 'lock';
            b += '<span class="badge ' + cls + '">' + CXLBL[p.cxType] + '</span>';
        }
        if (p.otype) b += '<span class="badge otype-only">O型専用</span>';
    }
    if (p.cat === 'ratchet' && p.rtype) b += '<span class="badge ' + (p.rtype === 'otype' ? 'otype-r' : 'normal-r') + '">' + RTLBL[p.rtype] + '</span>';
    if (p.cat === 'combo' && p.combotype) b += '<span class="badge otype-r">' + p.combotype + '</span>';
    return b;
}
function setMainTab(t) { mainTab = t; if (t !== 'blade') bladeSubTab = 'all'; renderParts(); }
function setBladeSubTab(t) { bladeSubTab = t; if (t !== 'cx') cxSubTab = 'lock'; renderParts(); }
function setCxSubTab(t) { cxSubTab = t; renderParts(); }
function chgQty(id, d) {
    var p = parts.find(function (x) { return x.id === id; }); if (!p) return;
    p.qty = Math.max(0, p.qty + d);
    document.getElementById('qty-' + id).textContent = p.qty; renderStats(); saveParts();
}
var editPartId = null;
var editThumbData = null;

function openEditPart(id) {
    var p = parts.find(function (x) { return x.id === id; });
    if (!p) return;
    editPartId = id;
    editThumbData = p.img || null;

    document.getElementById('edit-part-name').textContent = p.name;
    document.getElementById('edit-part-badges').innerHTML = getBadges(p);
    document.getElementById('edit-memo-inp').value = p.memo || '';
    document.getElementById('edit-memo-count').textContent = (p.memo || '').length + ' / 500';

    var prev = document.getElementById('edit-thumb-preview');
    if (p.img) {
        prev.innerHTML = '<img src="' + p.img + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">';
        document.getElementById('edit-del-img-btn').style.display = 'inline-flex';
    } else {
        prev.innerHTML = '<i class="ti ti-camera" style="font-size:22px;"></i><span>画像</span>';
        document.getElementById('edit-del-img-btn').style.display = 'none';
    }

    var memoInp = document.getElementById('edit-memo-inp');
    memoInp.oninput = function () {
        document.getElementById('edit-memo-count').textContent = memoInp.value.length + ' / 500';
    };

    document.getElementById('modal-edit-part').classList.remove('hidden');
}

function handleEditThumb(e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function (ev) {
        editThumbData = ev.target.result;
        var prev = document.getElementById('edit-thumb-preview');
        prev.innerHTML = '<img src="' + editThumbData + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">';
        document.getElementById('edit-del-img-btn').style.display = 'inline-flex';
    }; r.readAsDataURL(f);
    e.target.value = '';
}

function deleteEditThumb() {
    editThumbData = null;
    var prev = document.getElementById('edit-thumb-preview');
    prev.innerHTML = '<i class="ti ti-camera" style="font-size:22px;"></i><span>画像</span>';
    document.getElementById('edit-del-img-btn').style.display = 'none';
}

function saveEditPart() {
    var p = parts.find(function (x) { return x.id === editPartId; });
    if (!p) return;
    p.img = editThumbData;
    p.memo = document.getElementById('edit-memo-inp').value.trim();
    saveParts();
    closeModal('modal-edit-part');
    renderParts();
}

function delPart(id) { parts = parts.filter(function (x) { return x.id !== id; }); saveParts(); renderParts(); }

// ADD PART
function mkBxuxRow(i) {
    return '<div class="add-row" id="bxux-row-' + i + '">'
        + '<div class="thumb-sm" id="bxux-t-' + i + '" onclick="trigThumb(\'bxux\',' + i + ')"><i class="ti ti-camera" style="font-size:16px;"></i><span>画像</span></div>'
        + '<div style="flex:1;display:flex;flex-direction:column;gap:6px;">'
        + '<input class="form-input" placeholder="パーツ名" data-field="name" oninput="checkAddBtn()">'
        + '<div style="display:flex;gap:6px;">'
        + '<select class="form-input" data-field="line" style="flex:1;"><option value="bx">BX</option><option value="ux">UX</option></select>'
        + '<select class="form-input" data-field="otype" style="flex:1;"><option value="0">通常対応</option><option value="1">O型専用</option></select>'
        + '</div>'
        + '<div style="display:flex;gap:6px;">'
        + '<input class="form-input" type="number" min="0" value="1" data-field="qty" style="width:80px;" placeholder="所持数">'
        + '<input class="form-input" placeholder="メモ" data-field="memo" style="flex:1;">'
        + '</div>'
        + '</div>'
        + (i > 0 ? '<button class="del-btn" onclick="removeRow(\'bxux-row-' + i + '\')" style="position:static;margin-top:4px;"><i class="ti ti-x"></i></button>' : '')
        + '</div>';
}
function mkRatchetRow(i) {
    return '<div class="add-row" id="ratchet-row-' + i + '">'
        + '<div class="thumb-sm" id="ratchet-t-' + i + '" onclick="trigThumb(\'ratchet\',' + i + ')"><i class="ti ti-camera" style="font-size:16px;"></i><span>画像</span></div>'
        + '<div style="flex:1;display:flex;flex-direction:column;gap:6px;">'
        + '<input class="form-input" placeholder="パーツ名（例：3-60）" data-field="name" oninput="checkAddBtn()">'
        + '<div style="display:flex;gap:6px;">'
        + '<select class="form-input" data-field="rtype" style="flex:1;"><option value="normal">通常ラチェット</option><option value="otype">O型ラチェット</option></select>'
        + '<input class="form-input" type="number" min="0" value="1" data-field="qty" style="width:80px;" placeholder="所持数">'
        + '</div>'
        + '<input class="form-input" placeholder="メモ" data-field="memo">'
        + '</div>'
        + (i > 0 ? '<button class="del-btn" onclick="removeRow(\'ratchet-row-' + i + '\')" style="position:static;margin-top:4px;"><i class="ti ti-x"></i></button>' : '')
        + '</div>';
}
function mkBitRow(i) {
    return '<div class="add-row" id="bit-row-' + i + '">'
        + '<div class="thumb-sm" id="bit-t-' + i + '" onclick="trigThumb(\'bit\',' + i + ')"><i class="ti ti-camera" style="font-size:16px;"></i><span>画像</span></div>'
        + '<div style="flex:1;display:flex;flex-direction:column;gap:6px;">'
        + '<input class="form-input" placeholder="パーツ名（例：Flat）" data-field="name" oninput="checkAddBtn()">'
        + '<div style="display:flex;gap:6px;">'
        + '<input class="form-input" type="number" min="0" value="1" data-field="qty" style="width:80px;" placeholder="所持数">'
        + '<input class="form-input" placeholder="メモ" data-field="memo" style="flex:1;">'
        + '</div>'
        + '</div>'
        + (i > 0 ? '<button class="del-btn" onclick="removeRow(\'bit-row-' + i + '\')" style="position:static;margin-top:4px;"><i class="ti ti-x"></i></button>' : '')
        + '</div>';
}
function mkComboRow(i) {
    return '<div class="add-row" id="combo-row-' + i + '">'
        + '<div class="thumb-sm" id="combo-t-' + i + '" onclick="trigThumb(\'combo\',' + i + ')"><i class="ti ti-camera" style="font-size:16px;"></i><span>画像</span></div>'
        + '<div style="flex:1;display:flex;flex-direction:column;gap:6px;">'
        + '<input class="form-input" placeholder="パーツ名（例：3-60Tr）" data-field="name" oninput="checkAddBtn()">'
        + '<div style="display:flex;gap:6px;">'
        + '<select class="form-input" data-field="combotype" style="flex:1;"><option value="Tr">Tr（ターボ）</option><option value="Op">Op（オペレート）</option></select>'
        + '<input class="form-input" type="number" min="0" value="1" data-field="qty" style="width:80px;" placeholder="所持数">'
        + '</div>'
        + '<input class="form-input" placeholder="メモ" data-field="memo">'
        + '</div>'
        + (i > 0 ? '<button class="del-btn" onclick="removeRow(\'combo-row-' + i + '\')" style="position:static;margin-top:4px;"><i class="ti ti-x"></i></button>' : '')
        + '</div>';
}
// ADD PART
var addPickerCat = null;
var addPickerBladeLine = 'bx';
var addPickerCxPat = 3;
var addPickerTemp = {};  // {blade, lock, main, assist, lock4, metal, over, assist4, ratchet, bit, combo}

/*開く*/
function openAddPart() {
    document.getElementById('modal-part').classList.remove('hidden');
}

function onAddPickerSearch(val) {
    addPickerSearchQuery = val;
    var wrap = document.getElementById('add-picker-search-wrap');
    if (wrap) wrap.classList.toggle('has-query', !!val);
    // リストだけ再生成（検索窓は再描画しない）
    updateAddPickerList();
}
function updateAddPickerList() {
    var listHtml = '';
    if (addPickerCat === 'blade') {
        if (addPickerBladeLine === 'bx' || addPickerBladeLine === 'ux') {
            var items = getAddPickerItems('blade', addPickerBladeLine, null);
            listHtml = '<div class="picker-section">'
                + '<div class="picker-section-label">' + LINE[addPickerBladeLine] + ' ブレード一覧（複数選択可）</div>'
                + '<div class="radio-list">' + makeAddCheckList(items, 'blade') + '</div>'
                + '</div>';
            listHtml += '<div style="display:flex;align-items:center;gap:8px;margin-top:10px;padding:10px;background:var(--bg3);border-radius:8px;">'
                + '<input type="checkbox" id="add-otype-check" style="width:16px;height:16px;">'
                + '<label for="add-otype-check" style="font-size:12px;color:var(--text2);">O型専用ブレード</label>'
                + '</div>';
        } else if (addPickerBladeLine === 'cx') {
            var cxFields = addPickerCxPat === 3 ? ['lock', 'main', 'assist'] : ['lock', 'metal', 'over', 'assist'];
            listHtml = cxFields.map(function (f) {
                var items = getAddPickerItems('blade', 'cx', f);
                return '<div class="picker-section">'
                    + '<div class="picker-section-label">' + CXLBL[f] + '（複数選択可・単体登録可）</div>'
                    + '<div class="radio-list">' + makeAddCheckList(items, f) + '</div>'
                    + '</div>';
            }).join('');
        }
    } else if (addPickerCat === 'ratchet') {
        var items = getAddPickerItems('ratchet', null, null);
        listHtml = '<div class="picker-section">'
            + '<div class="picker-section-label">通常ラチェット（複数選択可）</div>'
            + '<div class="radio-list">' + makeAddCheckList(items.filter(function (p) { return p.rtype === 'normal' || !p.rtype; }), 'ratchet_n') + '</div>'
            + '</div>'
            + '<div class="picker-section" style="margin-top:8px;">'
            + '<div class="picker-section-label">O型ラチェット（複数選択可）</div>'
            + '<div class="radio-list">' + makeAddCheckList(items.filter(function (p) { return p.rtype === 'otype'; }), 'ratchet_o') + '</div>'
            + '</div>';
    } else if (addPickerCat === 'bit') {
        var items = getAddPickerItems('bit', null, null);
        listHtml = '<div class="radio-list">' + makeAddCheckList(items, 'bit') + '</div>';
    } else if (addPickerCat === 'combo') {
        var items = getAddPickerItems('combo', null, null);
        listHtml = '<div class="radio-list">' + makeAddCheckList(items, 'combo') + '</div>';
    }
    var container = document.getElementById('add-picker-list-container');
    if (container) container.innerHTML = listHtml;
    updateAddPickerDoneBtn();
}
function clearAddPickerSearch() {
    addPickerSearchQuery = '';
    var inp = document.getElementById('add-picker-search-inp');
    if (inp) inp.value = '';
    var wrap = document.getElementById('add-picker-search-wrap');
    if (wrap) wrap.classList.remove('has-query');
    renderAddPickerMain();
}

function openAddPicker(cat) {
    addPickerCat = cat;
    addPickerBladeLine = 'bx';
    addPickerCxPat = 3;
    addPickerTemp = {};
    addPickerSearchQuery = '';

    document.getElementById('add-picker-title').textContent =
        cat === 'blade' ? 'ブレードを追加' :
            cat === 'ratchet' ? 'ラチェットを追加' :
                cat === 'bit' ? 'ビットを追加' : '一体型ビットを追加';

    var bladeLineArea = document.getElementById('add-picker-blade-line');
    bladeLineArea.style.display = cat === 'blade' ? 'block' : 'none';
    document.getElementById('add-picker-cx-pattern').style.display = 'none';
    document.getElementById('add-picker-detail').style.display = 'none';
    document.getElementById('add-picker-qty').value = 1;
    document.getElementById('add-picker-memo').value = '';

    if (cat === 'blade') {
        setAddPickerBladeLine('bx');
    } else {
        renderAddPickerMain();
    }
    document.getElementById('modal-add-picker').classList.remove('hidden');
}

function setAddPickerBladeLine(l) {
    addPickerBladeLine = l;
    addPickerTemp = {};
    ['bx', 'ux', 'cx'].forEach(function (x) {
        var el = document.getElementById('apbl-' + x);
        if (el) el.classList.toggle('active', x === l);
    });
    document.getElementById('add-picker-cx-pattern').style.display = l === 'cx' ? 'block' : 'none';
    document.getElementById('apcxp-3').classList.add('active');
    document.getElementById('apcxp-4').classList.remove('active');
    addPickerCxPat = 3;
    renderAddPickerMain();
}

function setAddPickerCxPat(n) {
    addPickerCxPat = n;
    addPickerTemp = {};
    document.getElementById('apcxp-3').classList.toggle('active', n === 3);
    document.getElementById('apcxp-4').classList.toggle('active', n === 4);
    renderAddPickerMain();
}

var addPickerSearchQuery = '';

function renderAddPickerMain() {
    var area = document.getElementById('add-picker-main-area');
    var searchHtml = '<div class="search-wrap" id="add-picker-search-wrap" style="padding:0 0 10px;">'
        + '<i class="ti ti-search search-icon" style="left:12px;"></i>'
        + '<input class="search-input" id="add-picker-search-inp" placeholder="パーツ名で検索..." '
        + 'value="' + addPickerSearchQuery + '" oninput="onAddPickerSearch(this.value)" autocomplete="off" list="add-picker-datalist">'
        + '<datalist id="add-picker-datalist"></datalist>'
        + '<i class="ti ti-x search-clear" onclick="clearAddPickerSearch()" style="right:12px;"></i>'
        + '</div>';
    var listHtml = '';

    if (addPickerCat === 'blade') {
        if (addPickerBladeLine === 'bx' || addPickerBladeLine === 'ux') {
            var items = getAddPickerItems('blade', addPickerBladeLine, null);
            listHtml = '<div class="picker-section">'
                + '<div class="picker-section-label">' + LINE[addPickerBladeLine] + ' ブレード一覧（複数選択可）</div>'
                + '<div class="radio-list">' + makeAddCheckList(items, 'blade') + '</div>'
                + '</div>';
            listHtml += '<div style="display:flex;align-items:center;gap:8px;margin-top:10px;padding:10px;background:var(--bg3);border-radius:8px;">'
                + '<input type="checkbox" id="add-otype-check" style="width:16px;height:16px;">'
                + '<label for="add-otype-check" style="font-size:12px;color:var(--text2);">O型専用ブレード</label>'
                + '</div>';
        } else if (addPickerBladeLine === 'cx') {
            var cxFields = addPickerCxPat === 3 ? ['lock', 'main', 'assist'] : ['lock', 'metal', 'over', 'assist'];
            listHtml = cxFields.map(function (f) {
                var items = getAddPickerItems('blade', 'cx', f);
                return '<div class="picker-section">'
                    + '<div class="picker-section-label">' + CXLBL[f] + '（複数選択可・単体登録可）</div>'
                    + '<div class="radio-list">' + makeAddCheckList(items, f) + '</div>'
                    + '</div>';
            }).join('');
        }
    } else if (addPickerCat === 'ratchet') {
        var items = getAddPickerItems('ratchet', null, null);
        listHtml = '<div class="picker-section">'
            + '<div class="picker-section-label">通常ラチェット（複数選択可）</div>'
            + '<div class="radio-list">' + makeAddCheckList(items.filter(function (p) { return p.rtype === 'normal' || !p.rtype; }), 'ratchet_n') + '</div>'
            + '</div>'
            + '<div class="picker-section" style="margin-top:8px;">'
            + '<div class="picker-section-label">O型ラチェット（複数選択可）</div>'
            + '<div class="radio-list">' + makeAddCheckList(items.filter(function (p) { return p.rtype === 'otype'; }), 'ratchet_o') + '</div>'
            + '</div>';
    } else if (addPickerCat === 'bit') {
        var items = getAddPickerItems('bit', null, null);
        listHtml = '<div class="radio-list">' + makeAddCheckList(items, 'bit') + '</div>';
    } else if (addPickerCat === 'combo') {
        var items = getAddPickerItems('combo', null, null);
        listHtml = '<div class="radio-list">' + makeAddCheckList(items, 'combo') + '</div>';
    }

    // 初回描画か確認（検索窓が既にあればリストだけ更新）
    var existingSearch = document.getElementById('add-picker-search-wrap');
    if (existingSearch) {
        // 検索窓は維持、リストコンテナだけ更新
        var listContainer = document.getElementById('add-picker-list-container');
        if (listContainer) listContainer.innerHTML = listHtml;
        else area.innerHTML = searchHtml + '<div id="add-picker-list-container">' + listHtml + '</div>';
    } else {
        area.innerHTML = searchHtml + '<div id="add-picker-list-container">' + listHtml + '</div>';
    }
    updateAddPickerDoneBtn();
}

function getAddPickerItems(cat, line, cxType) {
    var regNames = {};
    parts.filter(function (p) { return p.cat === cat; }).forEach(function (p) { regNames[p.name] = true; });
    var q = normalizeStr(addPickerSearchQuery.trim());
    return ALL_DB.filter(function (p) {
        if (p.cat !== cat) return false;
        if (line && p.line !== line) return false;
        if (cxType && p.cxType !== cxType) return false;
        if (q && normalizeStr(p.name).indexOf(q) < 0) return false;
        return true;
    }).map(function (p) {
        var already = !!regNames[p.name];
        return Object.assign({}, p, { _already: already });
    });
}

function makeAddCheckList(items, selKey) {
    if (!items.length) return '<div style="font-size:11px;color:var(--text3);padding:8px;">パーツなし</div>';
    var html = '<div class="part-grid">';
    items.forEach(function (p) {
        var name = p.name;
        var sel = !!(addPickerTemp[selKey] && addPickerTemp[selKey][name]);
        var already = p._already;
        var safeName = name.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
        var thumb = p.img ? ('<img src="' + p.img + '">') : '<span style="font-size:24px;">' + (EMO[p.cat] || '❓') + '</span>';
        html += '<div class="grid-item ' + (sel ? 'selected ' : '') + (already ? 'registered' : '') + '" '
            + 'data-akey="' + selKey + '" data-aname="' + safeName + '" '
            + (already ? '' : 'onclick="handleAddCheck(this)"') + '>'
            + (already ? '<div class="grid-owned-badge">登録済</div>' : '')
            + '<div class="grid-thumb">' + thumb + '</div>'
            + '<div class="grid-name">' + name + '</div>'
            + '<div class="grid-check"><i class="ti ti-check"></i></div>'
            + '</div>';
    });
    html += '</div>';
    return html;
}

function handleAddCheck(el) {
    var key = el.getAttribute('data-akey');
    var name = el.getAttribute('data-aname').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    if (!addPickerTemp[key]) addPickerTemp[key] = {};
    if (addPickerTemp[key][name]) {
        delete addPickerTemp[key][name];
    } else {
        addPickerTemp[key][name] = true;
    }
    el.classList.toggle('selected', !!addPickerTemp[key][name]);
    updateAddPickerDoneBtn();
    updateAddPickerDetail();
}

function updateAddPickerDoneBtn() {
    var btn = document.getElementById('add-picker-done-btn');
    var hasAny = false;
    Object.keys(addPickerTemp).forEach(function (k) {
        if (Object.keys(addPickerTemp[k]).length > 0) hasAny = true;
    });
    if (btn) btn.disabled = !hasAny;
    updateAddPickerDetail();
}

function updateAddPickerDetail() {
    var detail = document.getElementById('add-picker-detail');
    var namesEl = document.getElementById('add-picker-selected-names');
    var allNames = [];
    Object.keys(addPickerTemp).forEach(function (k) {
        Object.keys(addPickerTemp[k]).forEach(function (n) { allNames.push(n); });
    });
    if (allNames.length > 0) {
        detail.style.display = 'block';
        namesEl.textContent = allNames.join('、');
    } else {
        detail.style.display = 'none';
    }
}

function addPickerDone() {
    var qty = parseInt(document.getElementById('add-picker-qty').value) || 1;
    var memo = document.getElementById('add-picker-memo').value.trim();
    var added = [];

    if (addPickerCat === 'blade') {
        var otype = false;
        var otypeEl = document.getElementById('add-otype-check');
        if (otypeEl) otype = otypeEl.checked;

        if (addPickerBladeLine === 'bx' || addPickerBladeLine === 'ux') {
            var names = Object.keys(addPickerTemp['blade'] || {});
            names.forEach(function (name) {
                added.push({ id: nextId++, name: name, cat: 'blade', line: addPickerBladeLine, cxType: null, otype: otype, qty: qty, memo: memo, img: null });
            });
        } else {
            // CX: each field can be registered independently
            var cxFields = addPickerCxPat === 3 ? ['lock', 'main', 'assist'] : ['lock', 'metal', 'over', 'assist'];
            cxFields.forEach(function (f) {
                var names = Object.keys(addPickerTemp[f] || {});
                names.forEach(function (name) {
                    added.push({ id: nextId++, name: name, cat: 'blade', line: 'cx', cxType: f, otype: false, qty: qty, memo: memo, img: null });
                });
            });
        }
    } else if (addPickerCat === 'ratchet') {
        var nNames = Object.keys(addPickerTemp['ratchet_n'] || {});
        var oNames = Object.keys(addPickerTemp['ratchet_o'] || {});
        nNames.forEach(function (name) {
            added.push({ id: nextId++, name: name, cat: 'ratchet', rtype: 'normal', qty: qty, memo: memo, img: null });
        });
        oNames.forEach(function (name) {
            added.push({ id: nextId++, name: name, cat: 'ratchet', rtype: 'otype', qty: qty, memo: memo, img: null });
        });
    } else if (addPickerCat === 'bit') {
        var names = Object.keys(addPickerTemp['bit'] || {});
        names.forEach(function (name) {
            added.push({ id: nextId++, name: name, cat: 'bit', qty: qty, memo: memo, img: null });
        });
    } else if (addPickerCat === 'combo') {
        var names = Object.keys(addPickerTemp['combo'] || {});
        names.forEach(function (name) {
            var dbItem = ALL_DB.find(function (p) { return p.name === name; });
            var combotype = dbItem && dbItem.combotype ? dbItem.combotype : 'Tr';
            added.push({ id: nextId++, name: name, cat: 'combo', combotype: combotype, qty: qty, memo: memo, img: null });
        });
    }

    if (!added.length) { showToast('パーツを選択してください'); return; }
    parts.push.apply(parts, added);
    saveParts();
    closeModal('modal-add-picker');
    showToast(added.length + '件登録しました', 'ok');
    renderParts();
}

function renderDecks() {
    var list = document.getElementById('deck-list');
    if (!decks.length) { list.innerHTML = '<div class="empty">デッキがありません<br>「新規」から作成してください</div>'; return; }
    var bCount = decks.filter(function (d) { return d.battle; }).length;
    list.innerHTML = decks.map(function (d) {
        var ib = d.battle, hu = checkUnowned(d);
        return '<div class="deck-card ' + (ib ? 'battle-selected' : '') + '">'
            + '<div class="deck-name-row">'
            + '<span>' + d.name + '</span>'
            + (ib ? '<span class="battle-badge">試合用</span>' : '')
            + '<button class="btn-sm" onclick="openRename(' + d.id + ')" style="margin-left:auto;padding:4px 8px;font-size:10px;"><i class="ti ti-pencil"></i> 名前変更</button>'
            + '</div>'
            + (hu ? '<div class="missing-warn"><i class="ti ti-alert-triangle"></i>未所持のパーツあり</div>' : '')
            + '<div class="deck-parts">' + renderDeckParts(d) + '</div>'
            + '<div class="deck-actions">'
            + (ib
                ? '<button class="btn-sm danger" onclick="toggleBattle(' + d.id + ')">試合用を解除</button>'
                : bCount < 3
                    ? '<button class="btn-sm success" onclick="tryAddBattle(' + d.id + ')">試合用に登録</button>'
                    : '<span style="font-size:10px;color:var(--text3);">試合用は3つまで</span>'
            )
            + '<button class="btn-sm" id="deck-detail-btn-' + d.id + '" onclick="toggleDeckDetail(' + d.id + ')" style="padding:4px 8px;font-size:10px;"><i class="ti ti-chart-bar"></i> 詳細</button>'
            + '<button class="btn-sm danger" onclick="delDeck(' + d.id + ')" style="margin-left:auto;">削除</button>'
            + '</div>'
            + '<div class="deck-detail-area" id="deck-detail-' + d.id + '" style="display:none;margin-top:10px;padding-top:10px;border-top:0.5px solid var(--border);">'
            + renderDeckMeasureDetail(d)
            + '</div>'
            + '</div>';
    }).join('');
}

function renderDeckParts(d) {
    var rows = [];
    if (d.blade) rows.push(mkDRow(d.blade, 'blade', 'ブレード'));
    if (d.lock) rows.push(mkDRow(d.lock, 'blade', 'ロックチップ'));
    if (d.main) rows.push(mkDRow(d.main, 'blade', 'メインブレード'));
    if (d.assist) rows.push(mkDRow(d.assist, 'blade', 'アシストブレード'));
    if (d.lock4) rows.push(mkDRow(d.lock4, 'blade', 'ロックチップ'));
    if (d.metal) rows.push(mkDRow(d.metal, 'blade', 'メタルブレード'));
    if (d.over) rows.push(mkDRow(d.over, 'blade', 'オーバーブレード'));
    if (d.assist4) rows.push(mkDRow(d.assist4, 'blade', 'アシストブレード'));
    if (d.combo) rows.push(mkDRow(d.combo, 'combo', '一体型ビット（ラチェット+ビット）'));
    else {
        if (d.ratchet) rows.push(mkDRow(d.ratchet, 'ratchet', 'ラチェット'));
        if (d.bit) rows.push(mkDRow(d.bit, 'bit', 'ビット'));
    }
    return rows.join('');
}

function mkDRow(name, cat, label) {
    var p = parts.find(function (x) { return x.name === name && x.cat === cat; });
    var thumb = p && p.img ? '<img src="' + p.img + '">' : (EMO[cat] || '❓');
    return '<div class="deck-part-row">'
        + '<div class="deck-part-thumb">' + thumb + '</div>'
        + '<div><div style="font-size:10px;color:var(--text2);">' + label + '</div>'
        + '<div style="font-size:13px;">' + name + '</div></div>'
        + '</div>';
}

function checkUnowned(d) {
    var names = [d.blade, d.lock, d.main, d.assist, d.lock4, d.metal, d.over, d.assist4, d.ratchet, d.bit, d.combo].filter(Boolean);
    return names.some(function (n) { var p = parts.find(function (x) { return x.name === n; }); return !p || p.qty === 0; });
}

function getAllNames(d) {
    return [d.blade, d.lock, d.main, d.assist, d.lock4, d.metal, d.over, d.assist4, d.ratchet, d.bit, d.combo].filter(Boolean);
}

function toggleBattle(id) {
    var d = decks.find(function (x) { return x.id === id; });
    if (d) d.battle = false;
    saveDecks();
    renderDecks();
    renderHome();
}

function tryAddBattle(id) {
    var d = decks.find(function (x) { return x.id === id; }); if (!d) return;
    var bds = decks.filter(function (x) { return x.battle && x.id !== id; });
    if (bds.length >= 3) { showToast('試合用デッキは3つまでです'); return; }
    var np = getAllNames(d);
    for (var i = 0; i < bds.length; i++) {
        var cf = np.filter(function (n) { return getAllNames(bds[i]).indexOf(n) >= 0; });
        if (cf.length) { showToast('「' + bds[i].name + '」と重複: ' + cf.join(', ')); return; }
    }
    d.battle = true;
    saveDecks();
    renderDecks();
    renderHome();
}

function delDeck(id) {
    decks = decks.filter(function (x) { return x.id !== id; });
    saveDecks();
    renderDecks();
    renderHome();
}

function openRename(id) {
    renameDeckId = id;
    var d = decks.find(function (x) { return x.id === id; });
    if (!d) return;
    document.getElementById('rename-inp').value = d.name;
    document.getElementById('modal-rename').classList.remove('hidden');
}

function saveRename() {
    var name = document.getElementById('rename-inp').value.trim();
    if (!name) { showToast('デッキ名を入力してください'); return; }
    var d = decks.find(function (x) { return x.id === renameDeckId; });
    if (d) d.name = name;
    closeModal('modal-rename');
    saveDecks();
    renderDecks();
}


// デッキ作成
var deckMode = 'owned';
// DS ->デッキセット：選択中のデッキの情報
var DS = {
    bladeLine: null,   // 'bx','ux','cx'各ラインの種別
    cxPat: 3,          // 3 or 4　cxラインの場合3ピース型か4ピース型のどっちか
    blade: null,       // BX/UXラインはブレードの名前そのまま
    lock: null, main: null, assist: null,        // CXラインの3ピースの各ピースの名前
    lock4: null, metal: null, over: null, assist4: null, // CXラインの４ピースの各ピースの名前
    ratchet: null, //ラチェット名 
    bit: null,  //ビット名
    combo: null //ラチェット+ビット1体型
};
var userEditedName = false;

// Picker state
var pickerTarget = null; // 'blade','ratchet','bit','combo'
var pickerBladeLine = 'bx';
var pickerCxPat = 3;
var pickerTemp = {}; // temp selections inside picker
var pickerMode = 'all'; // 'owned' or 'all' - picker独自のモード管理

function openAddDeck() {
    deckMode = 'owned';
    DS = { bladeLine: null, cxPat: 3, blade: null, lock: null, main: null, assist: null, lock4: null, metal: null, over: null, assist4: null, ratchet: null, bit: null, combo: null };
    userEditedName = false;
    document.getElementById('deck-name-inp').value = '';
    document.getElementById('deck-name-inp').oninput = function () { userEditedName = true; };
    document.getElementById('deck-name-hint').textContent = '';
    document.getElementById('dt-owned').classList.remove('active');
    document.getElementById('dt-all').classList.add('active');
    updateDeckDisplay();
    document.getElementById('modal-deck').classList.remove('hidden');
}

function setDeckMode(m) {
    deckMode = m;
    pickerMode = m;
    document.getElementById('dt-owned').classList.toggle('active', m === 'owned');
    document.getElementById('dt-all').classList.toggle('active', m === 'all');
    var pm = document.getElementById('modal-picker');
    if (pm && !pm.classList.contains('hidden')) renderPickerMain();
}

function updateDeckDisplay() {
    // Blade display
    var bladeTxt = '';
    if (DS.bladeLine === 'bx' || DS.bladeLine === 'ux') {
        bladeTxt = DS.blade || '';
    } else if (DS.bladeLine === 'cx') {
        if (DS.cxPat === 3) bladeTxt = [DS.lock, DS.main, DS.assist].filter(Boolean).join(' + ');
        else bladeTxt = [DS.lock4, DS.metal, DS.over, DS.assist4].filter(Boolean).join(' + ');
    }
    setSelDisplay('blade', bladeTxt);

    // Combo display
    setSelDisplay('combo', DS.combo || '');

    // Ratchet/Bit area visibility
    var hasCombo = !!DS.combo;
    document.getElementById('ratchet-sel-area').style.display = hasCombo ? 'none' : 'block';
    document.getElementById('bit-sel-area').style.display = hasCombo ? 'none' : 'block';
    if (!hasCombo) {
        setSelDisplay('ratchet', DS.ratchet || '');
        setSelDisplay('bit', DS.bit || '');
    }

    checkDeckWarn();
    updateAutoName();
}

function setSelDisplay(key, value) {
    var el = document.getElementById(key + '-sel-text');
    if (!el) return;
    if (value) {
        el.textContent = value;
        el.className = 'part-sel-value';
        // Check unowned
        var names = value.split(' + ');
        var anyUnowned = names.some(function (n) {
            var p = parts.find(function (x) { return x.name === n; });
            return !p || p.qty === 0;
        });
        if (anyUnowned) el.className = 'part-sel-value unowned-tag';
    } else {
        var placeholders = { blade: 'タップして選択', combo: 'タップして選択（任意）', ratchet: 'タップして選択', bit: 'タップして選択' };
        el.textContent = placeholders[key] || 'タップして選択';
        el.className = 'part-sel-placeholder';
    }
}

function checkDeckWarn() {
    var allNames = getAllDSNames();
    var hasUnowned = allNames.some(function (n) {
        var p = parts.find(function (x) { return x.name === n; });
        return !p || p.qty === 0;
    });
    document.getElementById('missing-warn').style.display = hasUnowned ? 'flex' : 'none';

    // O型 check
    var bp = DS.blade ? parts.find(function (p) { return p.name === DS.blade && p.cat === 'blade'; }) : null;
    var rp = DS.ratchet ? parts.find(function (p) { return p.name === DS.ratchet && p.cat === 'ratchet'; }) : null;
    var bad = bp && bp.otype && rp && rp.rtype === 'normal';
    document.getElementById('otype-warn').style.display = bad ? 'flex' : 'none';
}

function getAllDSNames() {
    return [DS.blade, DS.lock, DS.main, DS.assist, DS.lock4, DS.metal, DS.over, DS.assist4, DS.ratchet, DS.bit, DS.combo].filter(Boolean);
}

function updateAutoName() {
    if (userEditedName) return;
    var bp = '';
    if (DS.bladeLine === 'cx') {
        if (DS.cxPat === 3) bp = (DS.lock || '') + (DS.main || '') + (DS.assist || '');
        else bp = (DS.lock4 || '') + (DS.metal || '') + (DS.over || '') + (DS.assist4 || '');
    } else {
        bp = DS.blade || '';
    }
    var rp = DS.combo || DS.ratchet || '';
    var bitp = DS.combo ? '' : (DS.bit || '');
    var auto = bp + rp + bitp;
    var hint = document.getElementById('deck-name-hint');
    var inp = document.getElementById('deck-name-inp');
    if (auto) { hint.textContent = '自動: ' + auto; inp.placeholder = auto; }
    else { hint.textContent = ''; inp.placeholder = '自動生成されます'; }
}

// ============================================================
// PICKER
// ============================================================
function onPickerSearch(val) {
    pickerSearchQuery = val;
    var wrap = document.getElementById('picker-search-wrap');
    if (wrap) wrap.classList.toggle('has-query', !!val);
    updatePickerList();
}
function updatePickerList() {
    var listHtml = '';
    if (pickerTarget === 'blade') {
        if (pickerBladeLine === 'bx' || pickerBladeLine === 'ux') {
            var items = getPickerParts('blade', pickerBladeLine, null);
            listHtml = '<div class="picker-section">'
                + '<div class="picker-section-label">' + LINE[pickerBladeLine] + ' ブレード一覧</div>'
                + '<div class="radio-list">' + makeRadioList(items, 'blade', DS.blade, false) + '</div>'
                + '</div>';
        } else if (pickerBladeLine === 'cx') {
            if (pickerCxPat === 3) {
                var lockItems = getPickerParts('blade', 'cx', 'lock');
                var mainItems = getPickerParts('blade', 'cx', 'main');
                var assistItems = getPickerParts('blade', 'cx', 'assist');
                listHtml = '<div class="picker-section"><div class="picker-section-label">ロックチップ</div>'
                    + '<div class="radio-list">' + makeRadioList(lockItems, 'lock', null, false) + '</div></div>'
                    + '<div class="picker-section"><div class="picker-section-label">メインブレード</div>'
                    + '<div class="radio-list">' + makeRadioList(mainItems, 'main', null, false) + '</div></div>'
                    + '<div class="picker-section"><div class="picker-section-label">アシストブレード</div>'
                    + '<div class="radio-list">' + makeRadioList(assistItems, 'assist', null, false) + '</div></div>';
            } else {
                var lockItems = getPickerParts('blade', 'cx', 'lock');
                var metalItems = getPickerParts('blade', 'cx', 'metal');
                var overItems = getPickerParts('blade', 'cx', 'over');
                var assistItems = getPickerParts('blade', 'cx', 'assist');
                listHtml = '<div class="picker-section"><div class="picker-section-label">ロックチップ</div>'
                    + '<div class="radio-list">' + makeRadioList(lockItems, 'lock4', null, false) + '</div></div>'
                    + '<div class="picker-section"><div class="picker-section-label">メタルブレード</div>'
                    + '<div class="radio-list">' + makeRadioList(metalItems, 'metal', null, false) + '</div></div>'
                    + '<div class="picker-section"><div class="picker-section-label">オーバーブレード</div>'
                    + '<div class="radio-list">' + makeRadioList(overItems, 'over', null, false) + '</div></div>'
                    + '<div class="picker-section"><div class="picker-section-label">アシストブレード</div>'
                    + '<div class="radio-list">' + makeRadioList(assistItems, 'assist4', null, false) + '</div></div>';
            }
            listHtml += '<div class="picker-incomplete" id="picker-incomplete-msg"><i class="ti ti-alert-triangle"></i>全パーツを選択してください</div>';
        }
    } else if (pickerTarget === 'ratchet') {
        var bp = DS.blade ? parts.find(function (p) { return p.name === DS.blade && p.cat === 'blade'; }) : null;
        var oOnly = bp && bp.otype;
        var items = getPickerParts('ratchet', null, null).filter(function (p) { return !(oOnly && p.rtype === 'normal'); });
        listHtml = '<div class="radio-list">' + makeRadioList(items, 'ratchet', DS.ratchet, false) + '</div>';
    } else if (pickerTarget === 'bit') {
        var items = getPickerParts('bit', null, null);
        listHtml = '<div class="radio-list">' + makeRadioList(items, 'bit', DS.bit, false) + '</div>';
    } else if (pickerTarget === 'combo') {
        var items = getPickerParts('combo', null, null);
        listHtml = '<div style="font-size:11px;color:var(--text2);margin-bottom:8px;">選択するとラチェット+ビットを兼用。解除するには再度タップ。</div>'
            + '<div class="radio-list">' + makeRadioList(items, 'combo', DS.combo, false) + '</div>';
    }
    var container = document.getElementById('picker-list-container');
    if (container) container.innerHTML = listHtml;
    updatePickerDoneBtn();
}
function clearPickerSearch() {
    pickerSearchQuery = '';
    var inp = document.getElementById('picker-search-inp');
    if (inp) inp.value = '';
    var wrap = document.getElementById('picker-search-wrap');
    if (wrap) wrap.classList.remove('has-query');
    renderPickerMain();
}

function openPartPicker(target) {
    pickerTarget = target;
    pickerTemp = {};
    pickerBladeLine = 'bx';
    pickerCxPat = DS.cxPat || 3;
    pickerSearchQuery = '';
    pickerMode = deckMode; // deckModeを直接引き継ぐ（最も確実）

    // Pre-fill with current selections
    if (target === 'blade') {
        pickerBladeLine = DS.bladeLine || 'bx';
        pickerCxPat = DS.cxPat || 3;
        pickerTemp = {
            blade: DS.blade, lock: DS.lock, main: DS.main, assist: DS.assist,
            lock4: DS.lock4, metal: DS.metal, over: DS.over, assist4: DS.assist4
        };
    } else if (target === 'ratchet') {
        pickerTemp = { ratchet: DS.ratchet };
    } else if (target === 'bit') {
        pickerTemp = { bit: DS.bit };
    } else if (target === 'combo') {
        pickerTemp = { combo: DS.combo };
    }

    document.getElementById('picker-title').textContent =
        target === 'blade' ? 'ブレードを選択' :
            target === 'ratchet' ? 'ラチェットを選択' :
                target === 'bit' ? 'ビットを選択' : '一体型ビットを選択';

    var bladeLineArea = document.getElementById('picker-blade-line');
    var cxPatArea = document.getElementById('picker-cx-pattern');
    bladeLineArea.style.display = target === 'blade' ? 'block' : 'none';
    cxPatArea.style.display = (target === 'blade' && pickerBladeLine === 'cx') ? 'block' : 'none';

    if (target === 'blade') {
        renderPickerBladeLineChips();
        renderPickerMain();
    } else {
        renderPickerMain();
    }

    document.getElementById('modal-picker').classList.remove('hidden');
}

function renderPickerBladeLineChips() {
    ['bx', 'ux', 'cx'].forEach(function (l) {
        var el = document.getElementById('pbl-' + l);
        if (el) el.classList.toggle('active', pickerBladeLine === l);
    });
}

function setPickerBladeLine(l) {
    pickerBladeLine = l;
    pickerTemp = {};
    pickerSearchQuery = '';
    pickerMode = deckMode;
    renderPickerBladeLineChips();
    document.getElementById('picker-cx-pattern').style.display = l === 'cx' ? 'block' : 'none';
    renderPickerMain();
}

function setPickerCxPat(n) {
    pickerCxPat = n;
    pickerTemp = {};
    pickerMode = deckMode;
    document.getElementById('pcxp-3').classList.toggle('active', n === 3);
    document.getElementById('pcxp-4').classList.toggle('active', n === 4);
    renderPickerMain();
}

function getPickerParts(cat, line, cxType) {
    var useAll = (pickerMode !== 'owned');
    var q = normalizeStr(pickerSearchQuery.trim());
    var owned = parts.filter(function (p) {
        if (p.cat !== cat) return false;
        if (line != null && p.line !== line) return false;
        if (cxType != null && p.cxType !== cxType) return false;
        if (q && normalizeStr(p.name).indexOf(q) < 0) return false;
        return true;
    });
    if (!useAll) return owned;
    var ownedNames = {};
    parts.filter(function (p) { return p.cat === cat; }).forEach(function (p) { ownedNames[p.name] = true; });
    var extra = ALL_DB.filter(function (p) {
        if (p.cat !== cat) return false;
        if (line != null && p.line !== line) return false;
        if (cxType != null && p.cxType !== cxType) return false;
        if (q && normalizeStr(p.name).indexOf(q) < 0) return false;
        return !ownedNames[p.name];
    }).map(function (p) {
        return Object.assign({}, p, { qty: 0, img: null, _unowned: true });
    });
    return owned.concat(extra);
}

function makeRadioList(items, selKey, currentVal, isOtypeFilter) {
    if (!items.length) return '<div style="font-size:11px;color:var(--text3);padding:8px;">パーツなし</div>';
    var html = '<div class="part-grid">';
    items.forEach(function (p) {
        var name = p.name;
        var sel = pickerTemp[selKey] === name;
        var unowned = p._unowned || (p.qty === 0);
        var disabled = isOtypeFilter && p.rtype === 'normal';
        if (disabled) return;
        var safeName = name.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
        var thumb = p.img ? ('<img src="' + p.img + '">') : '<span style="font-size:24px;">' + (EMO[p.cat] || '❓') + '</span>';
        html += '<div class="grid-item ' + (sel ? 'selected ' : '') + (unowned ? 'unowned' : '') + '" '
            + 'data-key="' + selKey + '" data-name="' + safeName + '" onclick="handleRadioClick(this)">'
            + '<div class="grid-thumb">' + thumb + '</div>'
            + '<div class="grid-name">' + name + '</div>'
            + (unowned ? '<div class="grid-unowned-badge">未所持</div>' : '<div class="grid-unowned-badge" style="color:var(--text3);">×' + p.qty + '</div>')
            + '<div class="grid-check"><i class="ti ti-check"></i></div>'
            + '</div>';
    });
    html += '</div>';
    return html;
}

function handleRadioClick(el) {
    var key = el.getAttribute('data-key');
    var name = el.getAttribute('data-name').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    selectRadio(key, name);
}

var pickerSearchQuery = '';

function renderPickerMain() {
    var area = document.getElementById('picker-main-area');
    var searchHtml =
        '<div class="search-wrap" id="picker-search-wrap" style="padding:0 0 10px;">'
        + '<i class="ti ti-search search-icon" style="left:12px;"></i>'
        + '<input class="search-input" id="picker-search-inp" placeholder="パーツ名で検索..." '
        + 'value="' + pickerSearchQuery + '" oninput="onPickerSearch(this.value)" autocomplete="off">'
        + '<i class="ti ti-x search-clear" onclick="clearPickerSearch()" style="right:12px;"></i>'
        + '</div>';
    var listHtml = '';

    if (pickerTarget === 'blade') {
        if (pickerBladeLine === 'bx' || pickerBladeLine === 'ux') {
            var items = getPickerParts('blade', pickerBladeLine, null);
            listHtml = '<div class="picker-section">'
                + '<div class="picker-section-label">' + LINE[pickerBladeLine] + ' ブレード一覧</div>'
                + '<div class="radio-list">' + makeRadioList(items, 'blade', DS.blade, false) + '</div>'
                + '</div>';
        } else if (pickerBladeLine === 'cx') {
            if (pickerCxPat === 3) {
                var lockItems = getPickerParts('blade', 'cx', 'lock');
                var mainItems = getPickerParts('blade', 'cx', 'main');
                var assistItems = getPickerParts('blade', 'cx', 'assist');
                listHtml = '<div class="picker-section"><div class="picker-section-label">ロックチップ</div>'
                    + '<div class="radio-list">' + makeRadioList(lockItems, 'lock', null, false) + '</div></div>'
                    + '<div class="picker-section"><div class="picker-section-label">メインブレード</div>'
                    + '<div class="radio-list">' + makeRadioList(mainItems, 'main', null, false) + '</div></div>'
                    + '<div class="picker-section"><div class="picker-section-label">アシストブレード</div>'
                    + '<div class="radio-list">' + makeRadioList(assistItems, 'assist', null, false) + '</div></div>';
            } else {
                var lockItems = getPickerParts('blade', 'cx', 'lock');
                var metalItems = getPickerParts('blade', 'cx', 'metal');
                var overItems = getPickerParts('blade', 'cx', 'over');
                var assistItems = getPickerParts('blade', 'cx', 'assist');
                listHtml =
                    '<div class="picker-section"><div class="picker-section-label">ロックチップ</div>'
                    + '<div class="radio-list">' + makeRadioList(lockItems, 'lock4', null, false) + '</div></div>'
                    + '<div class="picker-section"><div class="picker-section-label">メタルブレード</div>'
                    + '<div class="radio-list">' + makeRadioList(metalItems, 'metal', null, false) + '</div></div>'
                    + '<div class="picker-section"><div class="picker-section-label">オーバーブレード</div>'
                    + '<div class="radio-list">' + makeRadioList(overItems, 'over', null, false) + '</div></div>'
                    + '<div class="picker-section"><div class="picker-section-label">アシストブレード</div>'
                    + '<div class="radio-list">' + makeRadioList(assistItems, 'assist4', null, false) + '</div></div>';
            }
        }
        listHtml += '<div class="picker-incomplete" id="picker-incomplete-msg"><i class="ti ti-alert-triangle"></i>全パーツを選択してください</div>';
    } else if (pickerTarget === 'ratchet') {
        var bp = DS.blade ? parts.find(function (p) { return p.name === DS.blade && p.cat === 'blade'; }) : null;
        var oOnly = bp && bp.otype;
        var items = getPickerParts('ratchet', null, null).filter(function (p) { return !(oOnly && p.rtype === 'normal'); });
        listHtml = '<div class="radio-list">' + makeRadioList(items, 'ratchet', DS.ratchet, false) + '</div>';
    } else if (pickerTarget === 'bit') {
        var items = getPickerParts('bit', null, null);
        listHtml = '<div class="radio-list">' + makeRadioList(items, 'bit', DS.bit, false) + '</div>';
    } else if (pickerTarget === 'combo') {
        var items = getPickerParts('combo', null, null);
        listHtml = '<div style="font-size:11px;color:var(--text2);margin-bottom:8px;">選択するとラチェット+ビットを兼用。解除するには再度タップ。</div>'
            + '<div class="radio-list">' + makeRadioList(items, 'combo', DS.combo, false) + '</div>';
    }

    var existingSearch = document.getElementById('picker-search-wrap');
    if (existingSearch) {
        var listContainer = document.getElementById('picker-list-container');
        if (listContainer) listContainer.innerHTML = listHtml;
        else area.innerHTML = searchHtml + '<div id="picker-list-container">' + listHtml + '</div>';
    } else {
        area.innerHTML = searchHtml + '<div id="picker-list-container">' + listHtml + '</div>';
    }
    updatePickerDoneBtn();
}

function selectRadio(key, name) {
    // Toggle: if already selected, deselect
    if (pickerTemp[key] === name) {
        pickerTemp[key] = null;
    } else {
        pickerTemp[key] = name;
    }
    // Re-render only the affected section
    renderPickerMain();
}

function updatePickerDoneBtn() {
    var btn = document.getElementById('picker-done-btn');
    var incomplete = document.getElementById('picker-incomplete-msg');
    var ok = false;

    if (pickerTarget === 'blade') {
        if (pickerBladeLine === 'bx' || pickerBladeLine === 'ux') {
            ok = !!pickerTemp.blade;
        } else if (pickerBladeLine === 'cx') {
            if (pickerCxPat === 3) ok = !!(pickerTemp.lock && pickerTemp.main && pickerTemp.assist);
            else ok = !!(pickerTemp.lock4 && pickerTemp.metal && pickerTemp.over && pickerTemp.assist4);
        }
        if (incomplete) incomplete.classList.toggle('show', !ok && (Object.values(pickerTemp).some(Boolean)));
    } else if (pickerTarget === 'ratchet') ok = !!pickerTemp.ratchet;
    else if (pickerTarget === 'bit') ok = !!pickerTemp.bit;
    else if (pickerTarget === 'combo') ok = true; // always ok (can deselect)

    if (btn) btn.disabled = !ok;
}

function pickerDone() {
    if (pickerTarget === 'blade') {
        DS.bladeLine = pickerBladeLine;
        DS.cxPat = pickerCxPat;
        if (pickerBladeLine === 'bx' || pickerBladeLine === 'ux') {
            DS.blade = pickerTemp.blade;
            DS.lock = null; DS.main = null; DS.assist = null;
            DS.lock4 = null; DS.metal = null; DS.over = null; DS.assist4 = null;
        } else {
            DS.blade = null;
            if (pickerCxPat === 3) {
                DS.lock = pickerTemp.lock; DS.main = pickerTemp.main; DS.assist = pickerTemp.assist;
                DS.lock4 = null; DS.metal = null; DS.over = null; DS.assist4 = null;
            } else {
                DS.lock4 = pickerTemp.lock4; DS.metal = pickerTemp.metal; DS.over = pickerTemp.over; DS.assist4 = pickerTemp.assist4;
                DS.lock = null; DS.main = null; DS.assist = null;
            }
        }
    } else if (pickerTarget === 'ratchet') {
        DS.ratchet = pickerTemp.ratchet;
    } else if (pickerTarget === 'bit') {
        DS.bit = pickerTemp.bit;
    } else if (pickerTarget === 'combo') {
        DS.combo = pickerTemp.combo || null;
        if (DS.combo) { DS.ratchet = null; DS.bit = null; }
    }

    closeModal('modal-picker');
    updateDeckDisplay();
}

function saveDeck() {
    var isCX = DS.bladeLine === 'cx';
    if (!DS.bladeLine) { showToast('ブレードを選択してください'); return; }
    if (!isCX && !DS.blade) { showToast('ブレードを選択してください'); return; }
    if (isCX && DS.cxPat === 3 && !(DS.lock && DS.main && DS.assist)) { showToast('CXパーツをすべて選択してください'); return; }
    if (isCX && DS.cxPat === 4 && !(DS.lock4 && DS.metal && DS.over && DS.assist4)) { showToast('CXパーツをすべて選択してください'); return; }
    if (!DS.combo && !DS.ratchet) { showToast('ラチェット（または一体型ビット）を選択してください'); return; }
    if (!DS.combo && !DS.bit) { showToast('ビット（または一体型ビット）を選択してください'); return; }

    // O型 check
    if (!isCX && DS.blade && DS.ratchet) {
        var bp = parts.find(function (p) { return p.name === DS.blade && p.cat === 'blade'; });
        var rp = parts.find(function (p) { return p.name === DS.ratchet && p.cat === 'ratchet'; });
        if (bp && bp.otype && rp && rp.rtype === 'normal') { showToast('O型専用ブレードに通常ラチェットは使用不可です'); return; }
    }

    var bp = '';
    if (isCX) {
        if (DS.cxPat === 3) bp = (DS.lock || '') + (DS.main || '') + (DS.assist || '');
        else bp = (DS.lock4 || '') + (DS.metal || '') + (DS.over || '') + (DS.assist4 || '');
    } else bp = DS.blade || '';
    var auto = bp + (DS.combo || DS.ratchet || '') + (DS.combo ? '' : (DS.bit || ''));
    var inputName = document.getElementById('deck-name-inp').value.trim();
    var finalName = inputName || auto || '新しいデッキ';

    decks.push({
        id: nextDeckId++, name: finalName, battle: false,
        bladeLine: DS.bladeLine,
        blade: !isCX ? DS.blade : null,
        lock: isCX && DS.cxPat === 3 ? DS.lock : null,
        main: isCX && DS.cxPat === 3 ? DS.main : null,
        assist: isCX && DS.cxPat === 3 ? DS.assist : null,
        lock4: isCX && DS.cxPat === 4 ? DS.lock4 : null,
        metal: isCX && DS.cxPat === 4 ? DS.metal : null,
        over: isCX && DS.cxPat === 4 ? DS.over : null,
        assist4: isCX && DS.cxPat === 4 ? DS.assist4 : null,
        ratchet: DS.combo ? null : DS.ratchet,
        bit: DS.combo ? null : DS.bit,
        combo: DS.combo || null,
    });
    saveDecks();
    closeModal('modal-deck');
    renderDecks();
}

renderHome();
showScreen('home');

// ページ離脱時の保険として保存
window.addEventListener('beforeunload', function () {
    saveParts();
    saveDecks();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').then(function (reg) {
            console.log('SW registered:', reg.scope);
        }).catch(function (err) {
            console.log('SW registration failed:', err);
        });
    });
}
if (window.navigator.standalone) {
    document.body.style.paddingTop = 'env(safe-area-inset-top)';
}

/*QRコード関連*/
function renderPlayerCardHome() {
    document.getElementById('battle-screen-title').textContent = 'プレーヤーカード';
    var html = '<div style="padding:0 0 80px;">';

    //戻るボタン
    html += '<div style="padding:12px 16px 4px;">'
        + '<button class="btn-sm" onclick="renderBattleHome()" '
        + 'style="padding:6px 12px;">'
        + '<i class="ti ti-arrow-left"></i> 戻る</button>'
        + '</div>';

    html += '<div style="padding:12px 16px 4px;font-size:11px;color:var(--text2);">カードを選択</div>';

    //自分のカード
    html += '<div class="battle-mode-card" onclick="renderMyPlayerCard()">'
        + '<div class="battle-mode-icon" style="background:rgba(124,111,255,0.15);">🌌</div>'
        + '<div class="battle-mode-info"><h3>マイカード</h3>'
        + '<p>自分のプレイヤーカード、自分のQRコードを確認できます</p></div>'
        + '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>'
        + '</div>';
    //ライバルカード一覧
    html += '<div class="battle-mode-card" onclick="renderRivalList()">'
        + '<div class="battle-mode-icon" style="background:rgba(124,111,255,0.15);">👥</div>'
        + '<div class="battle-mode-info"><h3>ライバルカード</h3>'
        + '<p>ライバルのプレイヤーカードを確認できます</p></div>'
        + '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>'
        + '</div>';
    //QRコードを読み取る
    html += '<div class="battle-mode-card" onclick="renderQRReader()">'
        + '<div class="battle-mode-icon" style="background:rgba(124,111,255,0.15);">📸</div>'
        + '<div class="battle-mode-info"><h3>QRコード読み取り</h3>'
        + '<p>ライバルのプレイヤーカードのQRコードを読み取ります</p></div>'
        + '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>'
        + '</div>';
    html += '</div>';
    document.getElementById('battle-content').innerHTML = html;
}





//プレイヤーカード画面
function renderMyPlayerCard() {

    var wins = battleRecords.filter(function (r) { return r.result === 'win'; }).length;
    var total = battleRecords.length;
    var battleDecks = decks.filter(function (d) { return d.battle; });
    var rate = total > 0 ? Math.round(wins / total * 100) : 0;

    //QRコードに含むデータ
    var qrData = JSON.stringify({
        v: 1,
        n: myPlayerName,
        w: wins,
        t: total,
        d: battleDecks.map(function (d) {
            return {
                b: d.blade || '',
                r: d.ratchet || '',
                bt: d.bit || '',
                c: d.combo || ''
            };
        })
    });
    console.log('内容:', qrData);
    console.log('文字数:', qrData.length);
    console.log('バイト数:', encodeURIComponent(qrData).length);

    var html = '<div style="padding:0 0 80px;">';

    //戻るボタン
    html += '<div style="padding:12px 16px 4px;">'
        + '<button class="btn-sm" onclick="renderPlayerCardHome()" '
        + 'style="padding:6px 12px;">'
        + '<i class="ti ti-arrow-left"></i> 戻る</button>'
        + '</div>';


    //プレイヤーカード表示
    html += '<div class="player-card">'
        + '<div class="player-card-name">'
        + '<input style=style="background:transparent;border:none;border-bottom:1px solid var(--accent);color:var(--text);font-size:20px;font-weight:700;width:100%;"'
        + 'value="' + myPlayerName + '" '
        + 'onchange="savePlayerName(this.value);renderMyPlayerCard();">'
        + '</div>';
    +'<div class ="player-card-stats">'
        + '勝率 ' + rate + '%(' + wins + '勝 / ' + total + '試合)'
        + '</div>';

    //試合用デッキ一覧
    if (battleDecks.length) {
        battleDecks.forEach(function (d) {
            html += '<div class ="player-card-deck">'
                + '<div class ="player-card-deck-name">' + d.name + '</div>'
                + '<div>' + getAllNames(d).join(' / ') + '</div>'
                + '</div>';
        });
    } else {
        html += '<div style="font-size:12px;color:var(--text3);">試合用デッキ未登録</div>';
    }
    html += '</div>';


    // HTMLにQRコード表示用のdiv
    html += '<div id="qr-code-area" style="display:flex;justify-content:center;padding:16px;"></div>';

    html += '</div>';
    document.getElementById('battle-content').innerHTML = html;

    // QRコード生成（HTML描画後に実行）
    setTimeout(function () {
        var qrArea = document.getElementById('qr-code-area');
        if (!qrArea) return;
        var canvas = document.createElement('canvas');
        qrArea.appendChild(canvas);
        new QRious({
            element: canvas,
            value: qrData,
            size: 200,
            level: 'L'
        });
    }, 300);

}