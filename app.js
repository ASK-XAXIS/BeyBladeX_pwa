
/**
 * ユーティリティ関数
 */
// ============================================================
// 対戦モード
// ============================================================

// ポイント定数（全ルール不変）
var FINISH_PT = { ef: 4, bf: 2, of: 2, sf: 1 };
var FINISH_LABEL = {
  ef: "エクストリームフィニッシュ",
  bf: "バーストフィニッシュ",
  of: "オーバーフィニッシュ",
  sf: "スピンフィニッシュ",
};
var FINISH_COLOR = {
  ef: "#7c6fff",
  bf: "#4fc3f7",
  of: "#f7a94f",
  sf: "#4caf82",
};

// 対戦セッション状態
var BS = {
  mode: null, // 'free','official','myrule'
  ruleWinPt: 4,
  ruleDeckCount: 1,
  ruleNoDupe: true,
  // デッキ設定
  myDecks: [], // [{name,parts,deckId,isNew}] deckCount分
  oppDecks: [],
  oppName: "対戦相手",
  // バトル状態
  myPt: 0,
  oppPt: 0,
  battles: [], // {finish,winner,myPt,oppPt}
  currentMyDeckIdx: 0,
  currentOppDeckIdx: 0,
  finished: false,
  winner: null, // 'my','opp','draw'
};

function renderBattleHome() {
  document.getElementById("battle-screen-title").textContent = "対戦モード";
  var html = '<div style="padding:0 0 80px;">';
  html +=
    '<div style="padding:12px 16px 4px;font-size:11px;color:var(--text2);">モードを選択</div>';
  // フリーバトル
  html +=
    '<div class="battle-mode-card" onclick="startBattleSetup(\'free\')">' +
    '<div class="battle-mode-icon" style="background:rgba(124,111,255,0.15);">⚔️</div>' +
    '<div class="battle-mode-info"><h3>フリーバトル</h3>' +
    "<p>何度でも記録可能。デッキ1個・ポイント4pt先取がデフォルト。</p></div>" +
    '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>' +
    "</div>";
  // 公式試合
  html +=
    '<div class="battle-mode-card" onclick="startBattleSetup(\'official\')">' +
    '<div class="battle-mode-icon" style="background:rgba(79,195,247,0.15);">🏆</div>' +
    '<div class="battle-mode-info"><h3>試合モード（公式）</h3>' +
    "<p>3on3・4pt先取。公式レギュレーション第12版準拠。</p></div>" +
    '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>' +
    "</div>";
  // マイルール
  html +=
    '<div class="battle-mode-card" onclick="startBattleSetup(\'myrule\')">' +
    '<div class="battle-mode-icon" style="background:rgba(247,169,79,0.15);">⚙️</div>' +
    '<div class="battle-mode-info"><h3>試合モード（マイルール）</h3>' +
    "<p>勝利pt・デッキ数・重複可否を自由に設定。</p></div>" +
    '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>' +
    "</div>";

  // プレイヤーカード一覧
  html +=
    '<div class="battle-mode-card" onclick="renderPlayerCardHome()">' +
    '<div class="battle-mode-icon" style="background:rgba(0,204,68,0.15);">📩</div>' +
    '<div class="battle-mode-info"><h3>プレイヤーカード</h3>' +
    "<p>自分のカードを表示・ライバルのカードを管理。</p></div>" +
    '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>' +
    "</div>";

  // 設定
  html +=
    '<div style="padding:0 16px;">' +
    '<div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:12px;padding:14px;">' +
    '<div style="font-size:12px;font-weight:500;color:var(--text);margin-bottom:12px;">⚙️ マイルール用勝敗カウント設定</div>' +
    '<div class="rule-setting-row">' +
    '<div><div class="rule-setting-label">カウント単位</div>' +
    '<div class="rule-setting-sub">試合単位：4pt到達で1勝 / バトル単位：1バトルで1勝</div></div>' +
    '<div style="display:flex;gap:6px;">' +
    '<span class="sel-chip ' +
    (typeof winCountMode !== "undefined" && winCountMode === "match"
      ? "active"
      : "") +
    '" onclick="setWinCountMode(\'match\')" style="font-size:10px;padding:4px 10px;">試合</span>' +
    '<span class="sel-chip ' +
    (typeof winCountMode !== "undefined" && winCountMode === "battle"
      ? "active"
      : "") +
    '" onclick="setWinCountMode(\'battle\')" style="font-size:10px;padding:4px 10px;">バトル</span>' +
    "</div>" +
    "</div>" +
    '<div class="rule-setting-row">' +
    '<div><div class="rule-setting-label">自分の名前</div></div>' +
    '<input class="rule-setting-input" style="width:120px;text-align:left;" value="' +
    myPlayerName +
    '" id="my-player-name-inp" onchange="savePlayerName(this.value)">' +
    "</div>" +
    '<div class="rule-setting-row">' +
    '<div><div class="rule-setting-label">テーマ</div><div class="rule-setting-sub">システム / ダーク / ライト</div></div>' +
    getThemeChipsHtml() +
    "</div>" +
    "</div>" +
    "</div>";
  html += "</div>";
  document.getElementById("battle-content").innerHTML = html;
}







// ============================================================
// バトルセットアップ
// ============================================================
function startBattleSetup(mode) {
  BS.mode = mode;
  BS.myPt = 0;
  BS.oppPt = 0;
  BS.battles = [];
  BS.finished = false;
  BS.winner = null;
  BS.currentMyDeckIdx = 0;
  BS.currentOppDeckIdx = 0;
  BS.oppName = "対戦相手";

  if (mode === "free") {
    BS.ruleWinPt = 4;
    BS.ruleDeckCount = 1;
    BS.ruleNoDupe = true;
    BS.myDecks = [
      { name: "", parts: null, deckId: null, isNew: false, choiceMode: null },
    ];
    BS.oppDecks = [
      { name: "", parts: null, deckId: null, isNew: false, choiceMode: null },
    ];
    renderBattleSetup();
  } else if (mode === "official") {
    BS.ruleWinPt = 4;
    BS.ruleDeckCount = 3;
    BS.ruleNoDupe = true;
    BS.myDecks = [0, 1, 2].map(function () {
      return {
        name: "",
        parts: null,
        deckId: null,
        isNew: false,
        choiceMode: null,
      };
    });
    BS.oppDecks = [0, 1, 2].map(function () {
      return {
        name: "",
        parts: null,
        deckId: null,
        isNew: false,
        choiceMode: null,
      };
    });
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
  BS.myPt = 0;
  BS.oppPt = 0;
  BS.battles = [];
  BS.finished = false;
  BS.winner = null;
  BS.currentMyDeckIdx = 0;
  BS.currentOppDeckIdx = 0;

  if (mode === "free") {
    BS.ruleWinPt = 4;
    BS.ruleDeckCount = 1;
    BS.ruleNoDupe = true;
    renderBattleSetup();
  } else if (mode === "official") {
    BS.ruleWinPt = 4;
    BS.ruleDeckCount = 3;
    BS.ruleNoDupe = true;
    renderBattleSetup();
  } else {
    renderMyRuleSetup();
  }
}

function renderMyRuleSetup() {
  document.getElementById("battle-screen-title").textContent = "マイルール設定";
  var mr = myRuleSetting;
  var html =
    '<div style="padding:0 16px 80px;">' +
    '<div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:12px;padding:14px;margin-bottom:14px;">' +
    '<div class="rule-setting-row"><div><div class="rule-setting-label">勝利ポイント</div><div class="rule-setting-sub">この点数先取で1試合の勝利</div></div>' +
    '<input class="rule-setting-input" type="number" min="1" max="20" id="mr-winpt" value="' +
    mr.winPt +
    '"></div>' +
    '<div class="rule-setting-row"><div><div class="rule-setting-label">使用デッキ数</div><div class="rule-setting-sub">1試合で使えるデッキの数</div></div>' +
    '<input class="rule-setting-input" type="number" min="1" max="5" id="mr-deckcnt" value="' +
    mr.deckCount +
    '"></div>' +
    '<div class="rule-setting-row"><div><div class="rule-setting-label">パーツ重複なし</div><div class="rule-setting-sub">デッキ間で同名パーツを使えない</div></div>' +
    '<div class="toggle-btn ' +
    (mr.noDupe ? "on" : "") +
    '" id="mr-nodupe-toggle" onclick="toggleMyRuleNoDupe()"><div class="toggle-dot"></div></div></div>' +
    "</div>" +
    '<div style="display:flex;gap:8px;">' +
    '<button class="btn-sm" onclick="renderBattleHome()" style="flex:1;padding:11px;">戻る</button>' +
    '<button class="btn-save" onclick="applyMyRule()" style="flex:2;padding:11px;border:none;border-radius:8px;cursor:pointer;font-size:13px;">この設定で開始</button>' +
    "</div>" +
    "</div>";
  document.getElementById("battle-content").innerHTML = html;
}

function toggleMyRuleNoDupe() {
  myRuleSetting.noDupe = !myRuleSetting.noDupe;
  var t = document.getElementById("mr-nodupe-toggle");
  if (t) t.classList.toggle("on", myRuleSetting.noDupe);
}
function applyMyRule() {
  myRuleSetting.winPt =
    parseInt(document.getElementById("mr-winpt").value) || 4;
  myRuleSetting.deckCount =
    parseInt(document.getElementById("mr-deckcnt").value) || 1;
  saveMyRule();
  BS.ruleWinPt = myRuleSetting.winPt;
  BS.ruleDeckCount = myRuleSetting.deckCount;
  BS.ruleNoDupe = myRuleSetting.noDupe;
  BS.myDecks = Array(BS.ruleDeckCount)
    .fill(null)
    .map(function () {
      return {
        name: "",
        parts: null,
        deckId: null,
        isNew: false,
        choiceMode: null,
      };
    });
  BS.oppDecks = Array(BS.ruleDeckCount)
    .fill(null)
    .map(function () {
      return {
        name: "",
        parts: null,
        deckId: null,
        isNew: false,
        choiceMode: null,
      };
    });
  renderBattleSetup();
}

// ============================================================
// デッキ選択セットアップ画面
// ============================================================
var setupEditTarget = null; // {side:'my'|'opp', idx:int}

function renderBattleSetup() {
  document.getElementById("battle-screen-title").textContent = "デッキを選択";
  var deckCount = BS.ruleDeckCount;
  var html = '<div style="padding:0 0 80px;">';

  // 自分のデッキ
  html +=
    '<div class="battle-section"><div class="battle-section-title">自分のデッキ（' +
    deckCount +
    "個）</div>";
  for (var i = 0; i < deckCount; i++) {
    html += renderDeckSelectSlot("my", i);
  }
  html += "</div>";

  html += '<div class="battle-vs">VS</div>';

  // 相手の名前入力
  html +=
    '<div class="battle-section">' +
    '<div class="battle-section-title">対戦相手の名前</div>' +
    '<input class="battle-name-input" id="opp-name-inp" value="' +
    BS.oppName +
    '" placeholder="対戦相手" ' +
    "oninput=\"BS.oppName=this.value||'対戦相手'\">" +
    "</div>";

  // 相手のデッキ
  html +=
    '<div class="battle-section"><div class="battle-section-title">' +
    BS.oppName +
    "のデッキ（" +
    deckCount +
    "個）</div>";
  for (var i = 0; i < deckCount; i++) {
    html += renderDeckSelectSlot("opp", i);
  }
  html += "</div>";

  // 開始ボタン
  html +=
    '<div style="padding:0 16px;">' +
    '<button class="btn-save" onclick="tryStartBattle()" style="width:100%;padding:13px;border:none;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;">バトル開始</button>' +
    "</div>";

  html += "</div>";
  document.getElementById("battle-content").innerHTML = html;
}

function renderDeckSelectSlot(side, idx) {
  var deck = (side === "my" ? BS.myDecks : BS.oppDecks)[idx];
  var arr = side === "my" ? BS.myDecks : BS.oppDecks;
  var label = BS.ruleDeckCount > 1 ? "デッキ " + (idx + 1) : "デッキ";

  // 重複チェック（デッキが選択済みの場合のみ）
  var dupeWarn = "";
  if (deck.parts) {
    var names = getAllNames(deck.parts);
    var dupInfo = checkDeckDupe(arr, idx, names);
    if (dupInfo) {
      dupeWarn =
        '<div style="color:var(--danger);font-size:11px;margin-top:6px;">' +
        "⚠️ デッキ" +
        dupInfo.deckNum +
        "と重複：" +
        dupInfo.parts.join(", ") +
        "</div>";
    }
  }

  var html =
    '<div class="deck-select-slot" id="slot-' +
    side +
    "-" +
    idx +
    '">' +
    '<div class="deck-slot-label">' +
    label +
    "</div>" +
    '<div class="deck-slot-choice">' +
    '<button class="deck-choice-btn ' +
    (deck.choiceMode === "saved" ? "active" : "") +
    '" onclick="selectDeckChoiceMode(\'' +
    side +
    "'," +
    idx +
    ",'saved')\">🌀 マイデッキから選択</button>" +
    '<button class="deck-choice-btn ' +
    (deck.choiceMode === "new" ? "active" : "") +
    '" onclick="selectDeckChoiceMode(\'' +
    side +
    "'," +
    idx +
    ",'new')\">✏️ 新しいデッキを組む</button>" +
    "</div>";
  if (deck.parts) {
    html +=
      '<div class="deck-chosen-display">' +
      '<div style="font-size:13px;font-weight:500;">' +
      deck.name +
      "</div>" +
      '<div class="deck-chosen-parts">' +
      getAllNames(deck.parts).join(" / ") +
      "</div>" +
      dupeWarn +
      '<button class="btn-sm" onclick="clearDeckSlot(\'' +
      side +
      "'," +
      idx +
      ')" style="font-size:10px;padding:3px 8px;margin-top:6px;">変更</button>' +
      "</div>";
  }
  html += "</div>";
  return html;
}

function selectDeckChoiceMode(side, idx, mode) {
  var arr = side === "my" ? BS.myDecks : BS.oppDecks;
  arr[idx].choiceMode = mode;
  if (mode === "saved") {
    openSavedDeckPicker(side, idx);
  } else {
    openNewDeckBuilder(side, idx);
  }
}

function clearDeckSlot(side, idx) {
  var arr = side === "my" ? BS.myDecks : BS.oppDecks;
  arr[idx] = {
    name: "",
    parts: null,
    deckId: null,
    isNew: false,
    choiceMode: null,
  };
  renderBattleSetup();
}

// マイデッキ選択モーダル
function openSavedDeckPicker(side, idx) {
  setupEditTarget = { side: side, idx: idx };
  var html = "";
  if (!decks.length) {
    html =
      '<div class="empty" style="padding:20px 0;">登録されているデッキがありません</div>';
  } else {
    html = decks
      .map(function (d) {
        return (
          '<div class="part-sel-item" onclick="pickSavedDeck(' +
          d.id +
          ')" style="margin-bottom:8px;cursor:pointer;">' +
          '<div style="flex:1;">' +
          '<div style="font-size:13px;font-weight:500;">' +
          d.name +
          "</div>" +
          '<div style="font-size:10px;color:var(--text2);margin-top:2px;">' +
          getAllNames(d).join(" / ") +
          "</div>" +
          "</div>" +
          '<i class="ti ti-chevron-right" style="color:var(--text3);"></i>' +
          "</div>"
        );
      })
      .join("");
  }
  document.getElementById("battle-deck-modal-content").innerHTML = html;
  document.getElementById("modal-battle-deck").classList.remove("hidden");
}

function closeBattleDeckModal() {
  document.getElementById("modal-battle-deck").classList.add("hidden");
  document.getElementById("battle-deck-modal-content").innerHTML = "";
}

function pickSavedDeck(deckId) {
  var d = decks.find(function (x) {
    return x.id === deckId;
  });
  if (!d) return;
  var t = setupEditTarget;
  var arr = t.side === "my" ? BS.myDecks : BS.oppDecks;
  arr[t.idx] = {
    name: d.name,
    parts: d,
    deckId: deckId,
    isNew: false,
    choiceMode: "saved",
  };
  closeBattleDeckModal();
  renderBattleSetup();
}

// 新規デッキ組み立てモーダル（既存のデッキビルダーを流用）
function openNewDeckBuilder(side, idx) {
  setupEditTarget = { side: side, idx: idx };
  // 既存のopenAddDeckを呼び出してモーダルを開く
  // 保存ボタンの動作だけ差し替え
  deckMode = "all";
  pickerMode = "all";
  dsInit();
  userEditedName = false;
  document.getElementById("deck-name-inp").value = "";
  document.getElementById("deck-name-inp").oninput = function () {
    userEditedName = true;
    onDeckNameInput(this.value);
  };
  document.getElementById("deck-name-hint").textContent = "";
  document.getElementById("dt-owned").classList.remove("active");
  document.getElementById("dt-all").classList.add("active");
  updateDeckDisplay();
  // 保存ボタンを差し替え
  var saveBtn = document.querySelector("#modal-deck .btn-save");
  if (saveBtn) {
    saveBtn.textContent = "このデッキで出場";
    saveBtn.onclick = function () {
      saveTempDeck();
    };
  }
  document.getElementById("modal-deck").classList.remove("hidden");
}

function saveTempDeck() {
  var isCX = DS.bladeLine === "cx";
  if (!DS.bladeLine) {
    showToast("ブレードを選択してください");
    return;
  }
  if (!isCX && !DS.blade) {
    showToast("ブレードを選択してください");
    return;
  }
  if (isCX && DS.cxPat === 3 && !(DS.lock && DS.main && DS.assist)) {
    showToast("CXパーツをすべて選択してください");
    return;
  }
  if (
    isCX &&
    DS.cxPat === 4 &&
    !(DS.lock4 && DS.metal && DS.over && DS.assist4)
  ) {
    showToast("CXパーツをすべて選択してください");
    return;
  }
  if (!DS.combo && !DS.ratchet) {
    showToast("ラチェット（または一体型ビット）を選択してください");
    return;
  }
  if (!DS.combo && !DS.bit) {
    showToast("ビット（または一体型ビット）を選択してください");
    return;
  }

  var bp = "";
  if (isCX) {
    if (DS.cxPat === 3)
      bp = (DS.lock || "") + (DS.main || "") + (DS.assist || "");
    else
      bp =
        (DS.lock4 || "") +
        (DS.metal || "") +
        (DS.over || "") +
        (DS.assist4 || "");
  } else bp = DS.blade || "";
  var auto =
    bp + (DS.combo || DS.ratchet || "") + (DS.combo ? "" : DS.bit || "");
  var inputName = document.getElementById("deck-name-inp").value.trim();
  var deckName = inputName || auto || "新しいデッキ";

  var tempDeck = {
    name: deckName,
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
  };

  var t = setupEditTarget;
  var arr = t.side === "my" ? BS.myDecks : BS.oppDecks;
  arr[t.idx] = {
    name: deckName,
    parts: tempDeck,
    deckId: null,
    isNew: true,
    choiceMode: "new",
  };

  // 保存ボタンを元に戻す
  var saveBtn = document.querySelector("#modal-deck .btn-save");
  if (saveBtn) {
    saveBtn.textContent = "保存";
    saveBtn.onclick = function () {
      saveDeck();
    };
  }
  closeModal("modal-deck");
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
    if (dup)
      return (
        label +
        "のデッキ" +
        (i + 1) +
        "とデッキ" +
        dup.deckNum +
        "に重複：" +
        dup.parts.join(", ")
      );
  }
  return null;
}

function tryStartBattle() {
  // 全デッキ選択確認
  var allSet =
    BS.myDecks.every(function (d) {
      return !!d.parts;
    }) &&
    BS.oppDecks.every(function (d) {
      return !!d.parts;
    });
  if (!allSet) {
    showToast("全てのデッキを選択してください");
    return;
  }

  // 重複チェック（ruleNoDupeがtrueの場合のみ）
  var myDupe = checkAllDecksDupe(BS.myDecks, myPlayerName);
  if (myDupe) {
    showToast(myDupe);
    return;
  }

  var oppDupe = checkAllDecksDupe(BS.oppDecks, BS.oppName);
  if (oppDupe) {
    showToast(oppDupe);
    return;
  }

  BS.currentMyDeckIdx = 0;
  BS.currentOppDeckIdx = 0;
  BS.myPt = 0;
  BS.oppPt = 0;
  BS.battles = [];
  renderBattleArena();
}

// ============================================================
// バトルアリーナ
// ============================================================
function renderBattleArena() {
  document.getElementById("battle-screen-title").textContent = "バトル中";
  var myDeck = BS.myDecks[BS.currentMyDeckIdx];
  var oppDeck = BS.oppDecks[BS.currentOppDeckIdx];
  var html = '<div class="battle-arena" style="padding-bottom:80px;">';

  // スコアボード
  html +=
    '<div class="battle-score-board">' +
    '<div class="battle-player-score ' +
    (BS.myPt >= BS.ruleWinPt ? "winner" : "") +
    '">' +
    '<div class="battle-player-name">' +
    myPlayerName +
    "</div>" +
    '<div class="battle-score-num">' +
    BS.myPt +
    "</div>" +
    '<div class="battle-score-max">/ ' +
    BS.ruleWinPt +
    "pt</div>" +
    "</div>" +
    '<div class="battle-vs-center">VS</div>' +
    '<div class="battle-player-score ' +
    (BS.oppPt >= BS.ruleWinPt ? "winner" : "") +
    '">' +
    '<div class="battle-player-name">' +
    BS.oppName +
    "</div>" +
    '<div class="battle-score-num">' +
    BS.oppPt +
    "</div>" +
    '<div class="battle-score-max">/ ' +
    BS.ruleWinPt +
    "pt</div>" +
    "</div>" +
    "</div>";

  // 現在のデッキ表示
  html +=
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">' +
    '<div style="background:var(--bg2);border-radius:8px;padding:8px;border:0.5px solid var(--border);">' +
    '<div style="font-size:9px;color:var(--text3);">' +
    myPlayerName +
    "のデッキ</div>" +
    '<div style="font-size:12px;font-weight:500;margin-top:2px;">' +
    myDeck.name +
    "</div>" +
    '<div style="font-size:10px;color:var(--text2);margin-top:2px;">' +
    getAllNames(myDeck.parts).join(" / ") +
    "</div>" +
    "</div>" +
    '<div style="background:var(--bg2);border-radius:8px;padding:8px;border:0.5px solid var(--border);">' +
    '<div style="font-size:9px;color:var(--text3);">' +
    BS.oppName +
    "のデッキ</div>" +
    '<div style="font-size:12px;font-weight:500;margin-top:2px;">' +
    oppDeck.name +
    "</div>" +
    '<div style="font-size:10px;color:var(--text2);margin-top:2px;">' +
    getAllNames(oppDeck.parts).join(" / ") +
    "</div>" +
    "</div>" +
    "</div>";

  // フィニッシュ選択
  html +=
    '<div style="font-size:11px;color:var(--text2);margin-bottom:8px;">バトル結果を選択</div>';
  html +=
    '<div style="font-size:10px;color:var(--text3);margin-bottom:6px;">— ' +
    myPlayerName +
    "の勝ち —</div>";
  html += '<div class="finish-grid">';
  ["ef", "bf", "of", "sf"].forEach(function (f) {
    html +=
      '<div class="finish-btn ' +
      f +
      "\" onclick=\"recordBattle('my','" +
      f +
      "' )\">" +
      '<div class="finish-btn-name">' +
      FINISH_LABEL[f] +
      "</div>" +
      '<div class="finish-btn-pt">+' +
      FINISH_PT[f] +
      "pt</div>" +
      "</div>";
  });
  html += "</div>";
  html +=
    '<div style="font-size:10px;color:var(--text3);margin-bottom:6px;">— ' +
    BS.oppName +
    "の勝ち —</div>";
  html += '<div class="finish-grid">';
  ["ef", "bf", "of", "sf"].forEach(function (f) {
    html +=
      '<div class="finish-btn ' +
      f +
      "\" onclick=\"recordBattle('opp','" +
      f +
      "')\">" +
      '<div class="finish-btn-name">' +
      FINISH_LABEL[f] +
      "</div>" +
      '<div class="finish-btn-pt">+' +
      FINISH_PT[f] +
      "pt</div>" +
      "</div>";
  });
  html += "</div>";
  html +=
    '<div style="margin-bottom:6px;">' +
    '<div class="finish-btn" style="border-color:var(--text3);" onclick="recordBattle(\'draw\',\'draw\')">' +
    '<div class="finish-btn-name">引き分け</div>' +
    '<div class="finish-btn-pt">0pt</div>' +
    "</div>" +
    "</div>";

  // バトルログ
  if (BS.battles.length) {
    html +=
      '<div class="battle-section-title" style="margin-top:4px;">バトルログ</div>';
    html += '<div class="battle-log">';
    BS.battles
      .slice()
      .reverse()
      .forEach(function (b, i) {
        var ri = BS.battles.length - 1 - i;
        var winner =
          b.winner === "my"
            ? myPlayerName
            : b.winner === "opp"
            ? BS.oppName
            : "引き分け";
        var finish = b.winner === "draw" ? "引き分け" : FINISH_LABEL[b.finish];
        html +=
          '<div class="battle-log-item">バトル' +
          (ri + 1) +
          ": " +
          winner +
          " 勝利（" +
          finish +
          "）" +
          " — " +
          myPlayerName +
          " " +
          b.myPtAfter +
          "pt / " +
          BS.oppName +
          " " +
          b.oppPtAfter +
          "pt</div>";
      });
    html += "</div>";
  }

  html += "</div>";
  document.getElementById("battle-content").innerHTML = html;
}

function recordBattle(winner, finish) {
  var pt = winner === "draw" ? 0 : FINISH_PT[finish];
  if (winner === "my") BS.myPt += pt;
  else if (winner === "opp") BS.oppPt += pt;

  BS.battles.push({
    winner: winner,
    finish: finish,
    pt: pt,
    myPtAfter: BS.myPt,
    oppPtAfter: BS.oppPt,
    myDeckIdx: BS.currentMyDeckIdx,
    oppDeckIdx: BS.currentOppDeckIdx,
  });

  // 3on3: デッキ切り替え（バーストフィニッシュ等で相手のデッキが次に）
  // 公式: 負けたブレーダーが次のデッキに交代
  if (BS.ruleDeckCount > 1 && winner !== "draw") {
    if (winner === "my" && BS.currentOppDeckIdx < BS.oppDecks.length - 1)
      BS.currentOppDeckIdx++;
    else if (winner === "opp" && BS.currentMyDeckIdx < BS.myDecks.length - 1)
      BS.currentMyDeckIdx++;
  }

  // 勝利判定
  if (BS.myPt >= BS.ruleWinPt) {
    BS.finished = true;
    BS.winner = "my";
    renderBattleResult();
  } else if (BS.oppPt >= BS.ruleWinPt) {
    BS.finished = true;
    BS.winner = "opp";
    renderBattleResult();
  } else {
    renderBattleArena();
  }
}

// ============================================================
// リザルト
// ============================================================
function renderBattleResult() {
  document.getElementById("battle-screen-title").textContent = "リザルト";
  var isMyWin = BS.winner === "my";
  var isDraw = BS.winner === "draw";
  var resultClass = isDraw ? "draw" : isMyWin ? "win" : "lose";
  var resultLabel = isDraw ? "引き分け" : isMyWin ? "勝利！" : "敗北";

  // 対戦記録をbattleRecordsに追加
  var matchResult = isDraw ? "draw" : isMyWin ? "win" : "loss";
  var record = {
    id: Date.now(),
    date: new Date().toISOString(),
    mode: BS.mode,
    myName: myPlayerName,
    oppName: BS.oppName,
    myPt: BS.myPt,
    oppPt: BS.oppPt,
    result: matchResult,
    battles: BS.battles.map(function (b) {
      return Object.assign({}, b, {
        result:
          b.winner === "my" ? "win" : b.winner === "opp" ? "loss" : "draw",
      });
    }),
    myDecks: BS.myDecks.map(function (d) {
      return { name: d.name, parts: d.parts, deckId: d.deckId };
    }),
    oppDecks: BS.oppDecks.map(function (d) {
      return { name: d.name, parts: d.parts, deckId: d.deckId };
    }),
  };
  battleRecords.push(record);
  saveBattleRecords();

  var html = '<div style="padding:0 0 80px;">';
  html +=
    '<div class="result-card result-' +
    resultClass +
    '">' +
    '<div class="result-label ' +
    resultClass +
    '">' +
    resultLabel +
    "</div>" +
    '<div class="result-detail">' +
    myPlayerName +
    " " +
    BS.myPt +
    "pt / " +
    BS.oppName +
    " " +
    BS.oppPt +
    "pt</div>" +
    "</div>";

  // 未登録デッキの確認
  html += renderUnregDeckPrompts();

  html +=
    '<div style="padding:0 16px;display:flex;flex-direction:column;gap:8px;">' +
    '<button class="btn-save" onclick="retryBattleSetup(BS.mode)" style="width:100%;padding:12px;border:none;border-radius:10px;font-size:13px;cursor:pointer;">もう一度</button>' +
    '<button class="btn-sm" onclick="renderBattleHome()" style="width:100%;padding:12px;text-align:center;">モード選択に戻る</button>' +
    "</div>";
  html += "</div>";

  document.getElementById("battle-content").innerHTML = html;
  renderHome();
}

function renderUnregDeckPrompts() {
  var html = "";
  var allDecks = BS.myDecks.concat(BS.oppDecks);
  // 使用したデッキ（未登録のもの）
  var usedIdxSet = {};
  BS.battles.forEach(function (b) {
    usedIdxSet["my_" + b.myDeckIdx] = true;
    usedIdxSet["opp_" + b.oppDeckIdx] = true;
  });
  // 未使用の未登録デッキも3on3で試合終了時に確認
  for (var i = 0; i < BS.myDecks.length; i++) usedIdxSet["my_" + i] = true;
  for (var i = 0; i < BS.oppDecks.length; i++) usedIdxSet["opp_" + i] = true;

  BS.myDecks.forEach(function (d, i) {
    if (d.isNew && d.parts) {
      html +=
        '<div class="unreg-deck-card">' +
        '<div class="unreg-deck-title"><i class="ti ti-alert-circle"></i>未登録のデッキがあります</div>' +
        '<div class="unreg-deck-name">' +
        d.name +
        "</div>" +
        '<div class="unreg-deck-parts">' +
        getAllNames(d.parts).join(" / ") +
        "</div>" +
        '<div style="display:flex;gap:8px;margin-top:10px;">' +
        '<button class="btn-save" onclick="registerTempDeck(\'my\',' +
        i +
        ')" style="flex:1;padding:9px;border:none;border-radius:8px;font-size:12px;cursor:pointer;">登録する</button>' +
        '<button class="btn-sm" onclick="discardTempDeck(\'my\',' +
        i +
        ')" style="flex:1;padding:9px;text-align:center;font-size:12px;">いいえ</button>' +
        "</div>" +
        "</div>";
    }
  });
  BS.oppDecks.forEach(function (d, i) {
    if (d.isNew && d.parts) {
      html +=
        '<div class="unreg-deck-card">' +
        '<div class="unreg-deck-title"><i class="ti ti-alert-circle"></i>' +
        BS.oppName +
        "の未登録デッキ</div>" +
        '<div class="unreg-deck-name">' +
        d.name +
        "</div>" +
        '<div class="unreg-deck-parts">' +
        getAllNames(d.parts).join(" / ") +
        "</div>" +
        '<div style="display:flex;gap:8px;margin-top:10px;">' +
        '<button class="btn-save" onclick="registerTempDeck(\'opp\',' +
        i +
        ')" style="flex:1;padding:9px;border:none;border-radius:8px;font-size:12px;cursor:pointer;">登録する</button>' +
        '<button class="btn-sm" onclick="discardTempDeck(\'opp\',' +
        i +
        ')" style="flex:1;padding:9px;text-align:center;font-size:12px;">いいえ</button>' +
        "</div>" +
        "</div>";
    }
  });
  return html;
}

function registerTempDeck(side, idx) {
  var arr = side === "my" ? BS.myDecks : BS.oppDecks;
  var d = arr[idx];
  if (!d || !d.parts) return;
  var p = d.parts;
  var newDeck = Object.assign({}, p, {
    id: nextDeckId++,
    name: d.name,
    battle: false,
  });
  decks.push(newDeck);
  arr[idx].isNew = false;
  arr[idx].deckId = newDeck.id;
  saveDecks();
  showToast("「" + d.name + "」を登録しました", "ok");
  // リザルト再描画
  var html = document.getElementById("battle-content").innerHTML;
  document.getElementById("battle-content").innerHTML = html.replace(
    /<div class="unreg-deck-card">[\s\S]*?<\/div>\s*<\/div>/,
    ""
  );
  renderBattleResult();
}

function discardTempDeck(side, idx) {
  var arr = side === "my" ? BS.myDecks : BS.oppDecks;
  if (arr[idx]) arr[idx].isNew = false;
  renderBattleResult();
}








function renderDecks() {
  var list = document.getElementById("deck-list");
  if (!decks.length) {
    list.innerHTML =
      '<div class="empty">デッキがありません<br>「新規」から作成してください</div>';
    return;
  }
  var bCount = decks.filter(function (d) {
    return d.battle;
  }).length;
  list.innerHTML = decks
    .map(function (d) {
      var ib = d.battle,
        hu = checkUnowned(d);
      return (
        '<div class="deck-card ' +
        (ib ? "battle-selected" : "") +
        '">' +
        '<div class="deck-name-row">' +
        "<span>" +
        d.name +
        "</span>" +
        (ib ? '<span class="battle-badge">試合用</span>' : "") +
        '<button class="btn-sm" onclick="openRename(' +
        d.id +
        ')" style="margin-left:auto;padding:4px 8px;font-size:10px;"><i class="ti ti-pencil"></i> 名前変更</button>' +
        "</div>" +
        (hu
          ? '<div class="missing-warn"><i class="ti ti-alert-triangle"></i>未所持のパーツあり</div>'
          : "") +
        '<div class="deck-parts">' +
        renderDeckParts(d) +
        "</div>" +
        '<div class="deck-actions">' +
        (ib
          ? '<button class="btn-sm danger" onclick="toggleBattle(' +
            d.id +
            ')">試合用を解除</button>'
          : bCount < 3
          ? '<button class="btn-sm success" onclick="tryAddBattle(' +
            d.id +
            ')">試合用に登録</button>'
          : '<span style="font-size:10px;color:var(--text3);">試合用は3つまで</span>') +
        '<button class="btn-sm" id="deck-detail-btn-' +
        d.id +
        '" onclick="toggleDeckDetail(' +
        d.id +
        ')" style="padding:4px 8px;font-size:10px;"><i class="ti ti-chart-bar"></i> 詳細</button>' +
        '<button class="btn-sm danger" onclick="delDeck(' +
        d.id +
        ')" style="margin-left:auto;">削除</button>' +
        "</div>" +
        '<div class="deck-detail-area" id="deck-detail-' +
        d.id +
        '" style="display:none;margin-top:10px;padding-top:10px;border-top:0.5px solid var(--border);">' +
        renderDeckMeasureDetail(d) +
        "</div>" +
        "</div>"
      );
    })
    .join("");
}

function renderDeckParts(d) {
  var rows = [];
  if (d.blade) rows.push(mkDRow(d.blade, "blade", "ブレード"));
  if (d.lock) rows.push(mkDRow(d.lock, "blade", "ロックチップ"));
  if (d.main) rows.push(mkDRow(d.main, "blade", "メインブレード"));
  if (d.assist) rows.push(mkDRow(d.assist, "blade", "アシストブレード"));
  if (d.lock4) rows.push(mkDRow(d.lock4, "blade", "ロックチップ"));
  if (d.metal) rows.push(mkDRow(d.metal, "blade", "メタルブレード"));
  if (d.over) rows.push(mkDRow(d.over, "blade", "オーバーブレード"));
  if (d.assist4) rows.push(mkDRow(d.assist4, "blade", "アシストブレード"));
  if (d.combo)
    rows.push(mkDRow(d.combo, "combo", "一体型ビット（ラチェット+ビット）"));
  else {
    if (d.ratchet) rows.push(mkDRow(d.ratchet, "ratchet", "ラチェット"));
    if (d.bit) rows.push(mkDRow(d.bit, "bit", "ビット"));
  }
  return rows.join("");
}

function mkDRow(name, cat, label) {
  var p = parts.find(function (x) {
    return x.name === name && x.cat === cat;
  });
  var thumb = p && p.img ? '<img src="' + p.img + '">' : EMOJI[cat] || "❓";
  return (
    '<div class="deck-part-row">' +
    '<div class="deck-part-thumb">' +
    thumb +
    "</div>" +
    '<div><div style="font-size:10px;color:var(--text2);">' +
    label +
    "</div>" +
    '<div style="font-size:13px;">' +
    name +
    "</div></div>" +
    "</div>"
  );
}

function checkUnowned(d) {
  var names = [
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
  return names.some(function (n) {
    var p = parts.find(function (x) {
      return x.name === n;
    });
    return !p || p.qty === 0;
  });
}



function toggleBattle(id) {
  var d = decks.find(function (x) {
    return x.id === id;
  });
  if (d) d.battle = false;
  saveDecks();
  renderDecks();
  renderHome();
}

function tryAddBattle(id) {
  var d = decks.find(function (x) {
    return x.id === id;
  });
  if (!d) return;
  var bds = decks.filter(function (x) {
    return x.battle && x.id !== id;
  });
  if (bds.length >= 3) {
    showToast("試合用デッキは3つまでです");
    return;
  }
  var np = getAllNames(d);
  for (var i = 0; i < bds.length; i++) {
    var cf = np.filter(function (n) {
      return getAllNames(bds[i]).indexOf(n) >= 0;
    });
    if (cf.length) {
      showToast("「" + bds[i].name + "」と重複: " + cf.join(", "));
      return;
    }
  }
  d.battle = true;
  saveDecks();
  renderDecks();
  renderHome();
}

function delDeck(id) {
  decks = decks.filter(function (x) {
    return x.id !== id;
  });
  saveDecks();
  renderDecks();
  renderHome();
}

function openRename(id) {
  renameDeckId = id;
  var d = decks.find(function (x) {
    return x.id === id;
  });
  if (!d) return;
  document.getElementById("rename-inp").value = d.name;
  document.getElementById("modal-rename").classList.remove("hidden");
}

function saveRename() {
  var name = document.getElementById("rename-inp").value.trim();
  if (!name) {
    showToast("デッキ名を入力してください");
    return;
  }
  var d = decks.find(function (x) {
    return x.id === renameDeckId;
  });
  if (d) d.name = name;
  closeModal("modal-rename");
  saveDecks();
  renderDecks();
}

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

// Picker state
var pickerTarget = null; // 'blade','ratchet','bit','combo'
var pickerBladeLine = "bx";
var pickerCxPat = 3;
var pickerTemp = {}; // temp selections inside picker
var pickerMode = "all"; // 'owned' or 'all' - picker独自のモード管理

/**
 * デッキの新規作成時に呼ばれる関数
 * マイデッキモードの（+新規）ボタンを押したとき
 */
function openAddDeck() {
  deckMode = "owned";
  dsInit();
  userEditedName = false;
  document.getElementById("deck-name-inp").value = "";
  document.getElementById("deck-name-inp").oninput = function () {
    userEditedName = true;
    onDeckNameInput(this.value);
  };
  document.getElementById("deck-name-hint").textContent = "";
  document.getElementById("dt-all").classList.remove("active");
  document.getElementById("dt-owned").classList.add("active");
  updateDeckDisplay();
  document.getElementById("modal-deck").classList.remove("hidden");
}

function setDeckMode(m) {
  deckMode = m;
  pickerMode = m;
  document.getElementById("dt-owned").classList.toggle("active", m === "owned");
  document.getElementById("dt-all").classList.toggle("active", m === "all");
  var pm = document.getElementById("modal-picker");
  if (pm && !pm.classList.contains("hidden")) renderPickerMain();
}

/**
 * updateDeckDisplay()
 * デッキ作成モーダルの表示を最新に状態に更新する関数
 */
function updateDeckDisplay() {
  var bladeTxt = "";
  if (DS.bladeLine === "bx" || DS.bladeLine === "ux") {
    bladeTxt = DS.blade || "";
  } else if (DS.bladeLine === "cx") {
    if (DS.cxPat === 3)
      bladeTxt = [DS.lock, DS.main, DS.assist].filter(Boolean).join(" + ");
    else
      bladeTxt = [DS.lock4, DS.metal, DS.over, DS.assist4]
        .filter(Boolean)
        .join(" + ");
  }
  setSelDisplay("blade", bladeTxt);

  setSelDisplay("combo", DS.combo || "");
  var hasCombo = !!DS.combo;
  document.getElementById("ratchet-sel-area").style.display = hasCombo
    ? "none"
    : "block";
  document.getElementById("bit-sel-area").style.display = hasCombo
    ? "none"
    : "block";
  if (!hasCombo) {
    setSelDisplay("ratchet", DS.ratchet || "");
    setSelDisplay("bit", DS.bit || "");
  }
  checkDeckWarn();
  updateAutoName();
}

function setSelDisplay(key, value) {
  var el = document.getElementById(key + "-sel-text");
  if (!el) return;
  if (value) {
    el.textContent = value;
    el.className = "part-sel-value";
    // Check unowned
    var names = value.split(" + ");
    var anyUnowned = names.some(function (n) {
      var p = parts.find(function (x) {
        return x.name === n;
      });
      return !p || p.qty === 0;
    });
    if (anyUnowned) el.className = "part-sel-value unowned-tag";
  } else {
    var placeholders = {
      blade: "タップして選択",
      combo: "タップして選択（任意）",
      ratchet: "タップして選択",
      bit: "タップして選択",
    };
    el.textContent = placeholders[key] || "タップして選択";
    el.className = "part-sel-placeholder";
  }
}

function checkDeckWarn() {
  var allNames = getAllDSNames();
  var hasUnowned = allNames.some(function (n) {
    var p = parts.find(function (x) {
      return x.name === n;
    });
    return !p || p.qty === 0;
  });
  document.getElementById("missing-warn").style.display = hasUnowned
    ? "flex"
    : "none";

  // O型 check
  var bp = DS.blade
    ? parts.find(function (p) {
        return p.name === DS.blade && p.cat === "blade";
      })
    : null;
  var rp = DS.ratchet
    ? parts.find(function (p) {
        return p.name === DS.ratchet && p.cat === "ratchet";
      })
    : null;
  var bad = bp && bp.otype && rp && rp.rtype === "normal";
  document.getElementById("otype-warn").style.display = bad ? "flex" : "none";
}



function updateAutoName() {
  if (userEditedName) return;
  var bp = "";
  if (DS.bladeLine === "cx") {
    if (DS.cxPat === 3)
      bp = (DS.lock || "") + (DS.main || "") + (DS.assist || "");
    else
      bp =
        (DS.lock4 || "") +
        (DS.metal || "") +
        (DS.over || "") +
        (DS.assist4 || "");
  } else {
    bp = DS.blade || "";
  }
  var rp = DS.combo || DS.ratchet || "";
  var bitp = DS.combo ? "" : DS.bit || "";
  var auto = bp + rp + bitp;
  var hint = document.getElementById("deck-name-hint");
  var inp = document.getElementById("deck-name-inp");
  if (auto) {
    hint.textContent = "自動: " + auto;
    inp.placeholder = auto;
  } else {
    hint.textContent = "";
    inp.placeholder = "自動生成されます";
  }
}

// ============================================================
// PICKER
// ============================================================
function onPickerSearch(val) {
  pickerSearchQuery = val;
  var wrap = document.getElementById("picker-search-wrap");
  if (wrap) wrap.classList.toggle("has-query", !!val);
  updatePickerList();
}
function updatePickerList() {
  var listHtml = "";
  if (pickerTarget === "blade") {
    if (pickerBladeLine === "bx" || pickerBladeLine === "ux") {
      var items = getPickerParts("blade", pickerBladeLine, null);
      listHtml =
        '<div class="picker-section">' +
        '<div class="picker-section-label">' +
        LINE[pickerBladeLine] +
        " ブレード一覧</div>" +
        '<div class="radio-list">' +
        makeRadioList(items, "blade", DS.blade, false) +
        "</div>" +
        "</div>";
    } else if (pickerBladeLine === "cx") {
      if (pickerCxPat === 3) {
        var lockItems = getPickerParts("blade", "cx", "lock");
        var mainItems = getPickerParts("blade", "cx", "main");
        var assistItems = getPickerParts("blade", "cx", "assist");
        listHtml =
          '<div class="picker-section"><div class="picker-section-label">ロックチップ</div>' +
          '<div class="radio-list">' +
          makeRadioList(lockItems, "lock", null, false) +
          "</div></div>" +
          '<div class="picker-section"><div class="picker-section-label">メインブレード</div>' +
          '<div class="radio-list">' +
          makeRadioList(mainItems, "main", null, false) +
          "</div></div>" +
          '<div class="picker-section"><div class="picker-section-label">アシストブレード</div>' +
          '<div class="radio-list">' +
          makeRadioList(assistItems, "assist", null, false) +
          "</div></div>";
      } else {
        var lockItems = getPickerParts("blade", "cx", "lock");
        var metalItems = getPickerParts("blade", "cx", "metal");
        var overItems = getPickerParts("blade", "cx", "over");
        var assistItems = getPickerParts("blade", "cx", "assist");
        listHtml =
          '<div class="picker-section"><div class="picker-section-label">ロックチップ</div>' +
          '<div class="radio-list">' +
          makeRadioList(lockItems, "lock4", null, false) +
          "</div></div>" +
          '<div class="picker-section"><div class="picker-section-label">メタルブレード</div>' +
          '<div class="radio-list">' +
          makeRadioList(metalItems, "metal", null, false) +
          "</div></div>" +
          '<div class="picker-section"><div class="picker-section-label">オーバーブレード</div>' +
          '<div class="radio-list">' +
          makeRadioList(overItems, "over", null, false) +
          "</div></div>" +
          '<div class="picker-section"><div class="picker-section-label">アシストブレード</div>' +
          '<div class="radio-list">' +
          makeRadioList(assistItems, "assist4", null, false) +
          "</div></div>";
      }
      listHtml +=
        '<div class="picker-incomplete" id="picker-incomplete-msg"><i class="ti ti-alert-triangle"></i>全パーツを選択してください</div>';
    }
  } else if (pickerTarget === "ratchet") {
    var bp = DS.blade
      ? parts.find(function (p) {
          return p.name === DS.blade && p.cat === "blade";
        })
      : null;
    var oOnly = bp && bp.otype;
    var items = getPickerParts("ratchet", null, null).filter(function (p) {
      return !(oOnly && p.rtype === "normal");
    });
    listHtml =
      '<div class="radio-list">' +
      makeRadioList(items, "ratchet", DS.ratchet, false) +
      "</div>";
  } else if (pickerTarget === "bit") {
    var items = getPickerParts("bit", null, null);
    listHtml =
      '<div class="radio-list">' +
      makeRadioList(items, "bit", DS.bit, false) +
      "</div>";
  } else if (pickerTarget === "combo") {
    var items = getPickerParts("combo", null, null);
    listHtml =
      '<div style="font-size:11px;color:var(--text2);margin-bottom:8px;">選択するとラチェット+ビットを兼用。解除するには再度タップ。</div>' +
      '<div class="radio-list">' +
      makeRadioList(items, "combo", DS.combo, false) +
      "</div>";
  }
  var container = document.getElementById("picker-list-container");
  if (container) container.innerHTML = listHtml;
  updatePickerDoneBtn();
}
function clearPickerSearch() {
  pickerSearchQuery = "";
  var inp = document.getElementById("picker-search-inp");
  if (inp) inp.value = "";
  var wrap = document.getElementById("picker-search-wrap");
  if (wrap) wrap.classList.remove("has-query");
  renderPickerMain();
}

function openPartPicker(target) {
  pickerTarget = target;
  pickerTemp = {};
  pickerBladeLine = "bx";
  pickerCxPat = DS.cxPat || 3;
  pickerSearchQuery = "";
  pickerMode = deckMode; // deckModeを直接引き継ぐ（最も確実）

  // Pre-fill with current selections
  if (target === "blade") {
    pickerBladeLine = DS.bladeLine || "bx";
    pickerCxPat = DS.cxPat || 3;
    pickerTemp = {
      blade: DS.blade,
      lock: DS.lock,
      main: DS.main,
      assist: DS.assist,
      lock4: DS.lock4,
      metal: DS.metal,
      over: DS.over,
      assist4: DS.assist4,
    };
  } else if (target === "ratchet") {
    pickerTemp = { ratchet: DS.ratchet };
  } else if (target === "bit") {
    pickerTemp = { bit: DS.bit };
  } else if (target === "combo") {
    pickerTemp = { combo: DS.combo };
  }

  document.getElementById("picker-title").textContent =
    target === "blade"
      ? "ブレードを選択"
      : target === "ratchet"
      ? "ラチェットを選択"
      : target === "bit"
      ? "ビットを選択"
      : "一体型ビットを選択";

  var bladeLineArea = document.getElementById("picker-blade-line");
  var cxPatArea = document.getElementById("picker-cx-pattern");
  bladeLineArea.style.display = target === "blade" ? "block" : "none";
  cxPatArea.style.display =
    target === "blade" && pickerBladeLine === "cx" ? "block" : "none";

  if (target === "blade") {
    renderPickerBladeLineChips();
    renderPickerMain();
  } else {
    renderPickerMain();
  }

  document.getElementById("modal-picker").classList.remove("hidden");
}

function renderPickerBladeLineChips() {
  ["bx", "ux", "cx"].forEach(function (l) {
    var el = document.getElementById("pbl-" + l);
    if (el) el.classList.toggle("active", pickerBladeLine === l);
  });
}

function setPickerBladeLine(l) {
  pickerBladeLine = l;
  pickerTemp = {};
  pickerSearchQuery = "";
  pickerMode = deckMode;
  renderPickerBladeLineChips();
  document.getElementById("picker-cx-pattern").style.display =
    l === "cx" ? "block" : "none";
  renderPickerMain();
}

function setPickerCxPat(n) {
  pickerCxPat = n;
  pickerTemp = {};
  pickerMode = deckMode;
  document.getElementById("pcxp-3").classList.toggle("active", n === 3);
  document.getElementById("pcxp-4").classList.toggle("active", n === 4);
  renderPickerMain();
}

function getPickerParts(cat, line, cxType) {
  var useAll = pickerMode !== "owned";
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
  parts
    .filter(function (p) {
      return p.cat === cat;
    })
    .forEach(function (p) {
      ownedNames[p.name] = true;
    });
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
  if (!items.length)
    return '<div style="font-size:11px;color:var(--text3);padding:8px;">パーツなし</div>';
  var html = '<div class="part-grid">';
  items.forEach(function (p) {
    var name = p.name;
    var sel = pickerTemp[selKey] === name;
    var unowned = p._unowned || p.qty === 0;
    var disabled = isOtypeFilter && p.rtype === "normal";
    if (disabled) return;
    var safeName = name.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    var thumb = p.img
      ? '<img src="' + p.img + '">'
      : '<span style="font-size:24px;">' + (EMOJI[p.cat] || "❓") + "</span>";
    html +=
      '<div class="grid-item ' +
      (sel ? "selected " : "") +
      (unowned ? "unowned" : "") +
      '" ' +
      'data-key="' +
      selKey +
      '" data-name="' +
      safeName +
      '" onclick="handleRadioClick(this)">' +
      '<div class="grid-thumb">' +
      thumb +
      "</div>" +
      '<div class="grid-name">' +
      name +
      "</div>" +
      (unowned
        ? '<div class="grid-unowned-badge">未所持</div>'
        : '<div class="grid-unowned-badge" style="color:var(--text3);">×' +
          p.qty +
          "</div>") +
      '<div class="grid-check"><i class="ti ti-check"></i></div>' +
      "</div>";
  });
  html += "</div>";
  return html;
}

function handleRadioClick(el) {
  var key = el.getAttribute("data-key");
  var name = el
    .getAttribute("data-name")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');
  selectRadio(key, name);
}

var pickerSearchQuery = "";

function renderPickerMain() {
  var area = document.getElementById("picker-main-area");
  var searchHtml =
    '<div class="search-wrap" id="picker-search-wrap" style="padding:0 0 10px;">' +
    '<i class="ti ti-search search-icon" style="left:12px;"></i>' +
    '<input class="search-input" id="picker-search-inp" placeholder="パーツ名で検索..." ' +
    'value="' +
    pickerSearchQuery +
    '" oninput="onPickerSearch(this.value)" autocomplete="off">' +
    '<i class="ti ti-x search-clear" onclick="clearPickerSearch()" style="right:12px;"></i>' +
    "</div>";
  var listHtml = "";

  if (pickerTarget === "blade") {
    if (pickerBladeLine === "bx" || pickerBladeLine === "ux") {
      var items = getPickerParts("blade", pickerBladeLine, null);
      listHtml =
        '<div class="picker-section">' +
        '<div class="picker-section-label">' +
        LINE[pickerBladeLine] +
        " ブレード一覧</div>" +
        '<div class="radio-list">' +
        makeRadioList(items, "blade", DS.blade, false) +
        "</div>" +
        "</div>";
    } else if (pickerBladeLine === "cx") {
      if (pickerCxPat === 3) {
        var lockItems = getPickerParts("blade", "cx", "lock");
        var mainItems = getPickerParts("blade", "cx", "main");
        var assistItems = getPickerParts("blade", "cx", "assist");
        listHtml =
          '<div class="picker-section"><div class="picker-section-label">ロックチップ</div>' +
          '<div class="radio-list">' +
          makeRadioList(lockItems, "lock", null, false) +
          "</div></div>" +
          '<div class="picker-section"><div class="picker-section-label">メインブレード</div>' +
          '<div class="radio-list">' +
          makeRadioList(mainItems, "main", null, false) +
          "</div></div>" +
          '<div class="picker-section"><div class="picker-section-label">アシストブレード</div>' +
          '<div class="radio-list">' +
          makeRadioList(assistItems, "assist", null, false) +
          "</div></div>";
      } else {
        var lockItems = getPickerParts("blade", "cx", "lock");
        var metalItems = getPickerParts("blade", "cx", "metal");
        var overItems = getPickerParts("blade", "cx", "over");
        var assistItems = getPickerParts("blade", "cx", "assist");
        listHtml =
          '<div class="picker-section"><div class="picker-section-label">ロックチップ</div>' +
          '<div class="radio-list">' +
          makeRadioList(lockItems, "lock4", null, false) +
          "</div></div>" +
          '<div class="picker-section"><div class="picker-section-label">メタルブレード</div>' +
          '<div class="radio-list">' +
          makeRadioList(metalItems, "metal", null, false) +
          "</div></div>" +
          '<div class="picker-section"><div class="picker-section-label">オーバーブレード</div>' +
          '<div class="radio-list">' +
          makeRadioList(overItems, "over", null, false) +
          "</div></div>" +
          '<div class="picker-section"><div class="picker-section-label">アシストブレード</div>' +
          '<div class="radio-list">' +
          makeRadioList(assistItems, "assist4", null, false) +
          "</div></div>";
      }
    }
    listHtml +=
      '<div class="picker-incomplete" id="picker-incomplete-msg"><i class="ti ti-alert-triangle"></i>全パーツを選択してください</div>';
  } else if (pickerTarget === "ratchet") {
    var bp = DS.blade
      ? parts.find(function (p) {
          return p.name === DS.blade && p.cat === "blade";
        })
      : null;
    var oOnly = bp && bp.otype;
    var items = getPickerParts("ratchet", null, null).filter(function (p) {
      return !(oOnly && p.rtype === "normal");
    });
    listHtml =
      '<div class="radio-list">' +
      makeRadioList(items, "ratchet", DS.ratchet, false) +
      "</div>";
  } else if (pickerTarget === "bit") {
    var items = getPickerParts("bit", null, null);
    listHtml =
      '<div class="radio-list">' +
      makeRadioList(items, "bit", DS.bit, false) +
      "</div>";
  } else if (pickerTarget === "combo") {
    var items = getPickerParts("combo", null, null);
    listHtml =
      '<div style="font-size:11px;color:var(--text2);margin-bottom:8px;">選択するとラチェット+ビットを兼用。解除するには再度タップ。</div>' +
      '<div class="radio-list">' +
      makeRadioList(items, "combo", DS.combo, false) +
      "</div>";
  }

  var existingSearch = document.getElementById("picker-search-wrap");
  if (existingSearch) {
    var listContainer = document.getElementById("picker-list-container");
    if (listContainer) listContainer.innerHTML = listHtml;
    else
      area.innerHTML =
        searchHtml + '<div id="picker-list-container">' + listHtml + "</div>";
  } else {
    area.innerHTML =
      searchHtml + '<div id="picker-list-container">' + listHtml + "</div>";
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
  var btn = document.getElementById("picker-done-btn");
  var incomplete = document.getElementById("picker-incomplete-msg");
  var ok = false;

  if (pickerTarget === "blade") {
    if (pickerBladeLine === "bx" || pickerBladeLine === "ux") {
      ok = !!pickerTemp.blade;
    } else if (pickerBladeLine === "cx") {
      if (pickerCxPat === 3)
        ok = !!(pickerTemp.lock && pickerTemp.main && pickerTemp.assist);
      else
        ok = !!(
          pickerTemp.lock4 &&
          pickerTemp.metal &&
          pickerTemp.over &&
          pickerTemp.assist4
        );
    }
    if (incomplete)
      incomplete.classList.toggle(
        "show",
        !ok && Object.values(pickerTemp).some(Boolean)
      );
  } else if (pickerTarget === "ratchet") ok = !!pickerTemp.ratchet;
  else if (pickerTarget === "bit") ok = !!pickerTemp.bit;
  else if (pickerTarget === "combo") ok = true; // always ok (can deselect)

  if (btn) btn.disabled = !ok;
}

function pickerDone() {
  if (pickerTarget === "blade") {
    DS.bladeLine = pickerBladeLine;
    DS.cxPat = pickerCxPat;
    if (pickerBladeLine === "bx" || pickerBladeLine === "ux") {
      DS.blade = pickerTemp.blade;
      DS.lock = null;
      DS.main = null;
      DS.assist = null;
      DS.lock4 = null;
      DS.metal = null;
      DS.over = null;
      DS.assist4 = null;
    } else {
      DS.blade = null;
      if (pickerCxPat === 3) {
        DS.lock = pickerTemp.lock;
        DS.main = pickerTemp.main;
        DS.assist = pickerTemp.assist;
        DS.lock4 = null;
        DS.metal = null;
        DS.over = null;
        DS.assist4 = null;
      } else {
        DS.lock4 = pickerTemp.lock4;
        DS.metal = pickerTemp.metal;
        DS.over = pickerTemp.over;
        DS.assist4 = pickerTemp.assist4;
        DS.lock = null;
        DS.main = null;
        DS.assist = null;
      }
    }
  } else if (pickerTarget === "ratchet") {
    DS.ratchet = pickerTemp.ratchet;
  } else if (pickerTarget === "bit") {
    DS.bit = pickerTemp.bit;
  } else if (pickerTarget === "combo") {
    DS.combo = pickerTemp.combo || null;
    if (DS.combo) {
      DS.ratchet = null;
      DS.bit = null;
    }
  }

  closeModal("modal-picker");
  updateDeckDisplay();
}

function saveDeck() {
  var isCX = DS.bladeLine === "cx";
  if (!DS.bladeLine) {
    showToast("ブレードを選択してください");
    return;
  }
  if (!isCX && !DS.blade) {
    showToast("ブレードを選択してください");
    return;
  }
  if (isCX && DS.cxPat === 3 && !(DS.lock && DS.main && DS.assist)) {
    showToast("CXパーツをすべて選択してください");
    return;
  }
  if (
    isCX &&
    DS.cxPat === 4 &&
    !(DS.lock4 && DS.metal && DS.over && DS.assist4)
  ) {
    showToast("CXパーツをすべて選択してください");
    return;
  }
  if (!DS.combo && !DS.ratchet) {
    showToast("ラチェット（または一体型ビット）を選択してください");
    return;
  }
  if (!DS.combo && !DS.bit) {
    showToast("ビット（または一体型ビット）を選択してください");
    return;
  }

  // O型 check
  if (!isCX && DS.blade && DS.ratchet) {
    var bp = parts.find(function (p) {
      return p.name === DS.blade && p.cat === "blade";
    });
    var rp = parts.find(function (p) {
      return p.name === DS.ratchet && p.cat === "ratchet";
    });
    if (bp && bp.otype && rp && rp.rtype === "normal") {
      showToast("O型専用ブレードに通常ラチェットは使用不可です");
      return;
    }
  }

  var bp = "";
  if (isCX) {
    if (DS.cxPat === 3)
      bp = (DS.lock || "") + (DS.main || "") + (DS.assist || "");
    else
      bp =
        (DS.lock4 || "") +
        (DS.metal || "") +
        (DS.over || "") +
        (DS.assist4 || "");
  } else bp = DS.blade || "";
  var auto =
    bp + (DS.combo || DS.ratchet || "") + (DS.combo ? "" : DS.bit || "");
  var inputName = document.getElementById("deck-name-inp").value.trim();
  var finalName = inputName || auto || "新しいデッキ";

  decks.push({
    id: nextDeckId++,
    name: finalName,
    battle: false,
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
  closeModal("modal-deck");
  renderDecks();
}

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

/*プレイヤーカード関連*/



function parseDeckName(str) {
  var result = {
    blade: null,
    ratchet: null,
    bit: null,
    combo: null,
  };

  var sorted = ALL_DB.slice().sort(function (a, b) {
    return b.name.length - a.name.length;
  });

  // マッチした範囲を記録して二重マッチを防ぐ
  var usedRanges = [];

  function isOverlapping(start, end) {
    return usedRanges.some(function (r) {
      return start < r.end && end > r.start;
    });
  }

  //TODO:検索欄にコピペでパーツが選択されるようにしたいが、うまくいかないのでロジックがおかしいと思う
  sorted.forEach(function (p) {
    var idx = str.indexOf(p.name);
    var matched = false;
    var matchStart = -1,
      matchEnd = -1;

    // 正式名での照合
    if (idx >= 0 && !isOverlapping(idx, idx + p.name.length)) {
      matched = true;
      matchStart = idx;
      matchEnd = idx + p.name.length;
    }

    // 短縮名での照合
    if (!matched) {
      var shortName = p.name.replace(/（.*?）/g, "").trim();
      if (shortName.length >= 1) {
        var sidx = str.indexOf(shortName);
        if (sidx >= 0 && !isOverlapping(sidx, sidx + shortName.length)) {
          // 後ろの文字が英数字でないことを確認（誤マッチ防止）
          var nextChar = str[sidx + shortName.length];
          var isPartOfLonger = nextChar && /[a-zA-ZA-Za-z]/.test(nextChar);
          if (!isPartOfLonger) {
            matched = true;
            matchStart = sidx;
            matchEnd = sidx + shortName.length;
          }
        }
      }
    }

    if (matched) {
      usedRanges.push({ start: matchStart, end: matchEnd });
      if (p.cat === "blade" && !result.blade) result.blade = p.name;
      if (p.cat === "ratchet" && !result.ratchet) result.ratchet = p.name;
      if (p.cat === "bit" && !result.bit) result.bit = p.name;
      if (p.cat === "combo" && !result.combo) result.combo = p.name;
    }
  });

  return result;
}

function onDeckNameInput(val) {
  userEditedName = true;

  // 入力が空になったらDSをリセット
  if (!val.trim()) {
    DS.bladeLine = null;
    DS.blade = null;
    DS.ratchet = null;
    DS.bit = null;
    DS.combo = null;
    updateDeckDisplay();
    return;
  }

  // 毎回DSをリセットしてから再解析
  DS.bladeLine = null;
  DS.blade = null;
  DS.ratchet = null;
  DS.bit = null;
  DS.combo = null;

  var parsed = parseDeckName(val);

  if (parsed.blade) {
    var bladeItem = ALL_DB.find(function (p) {
      return p.name === parsed.blade && p.cat === "blade";
    });
    if (bladeItem) DS.bladeLine = bladeItem.line;
    DS.blade = parsed.blade;
  }
  if (parsed.ratchet) DS.ratchet = parsed.ratchet;
  if (parsed.bit) DS.bit = parsed.bit;
  if (parsed.combo) DS.combo = parsed.combo;

  updateDeckDisplay();
}
