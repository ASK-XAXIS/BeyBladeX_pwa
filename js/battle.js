/**
 * battle.js
 * バトルモード関連の変数・関数
 */

//==============================================================
//変数
//==============================================================

/*対戦セッション状態*/
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

/*ポイント定数（全ルール不変）*/
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

/*　デッキ選択対象変数　*/
var setupEditTarget = null; // {side:'my'|'opp', idx:int}

//==============================================================
//関数
//==============================================================

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
