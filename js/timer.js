/**
 * timer.js
 * タイマー関連の変数・関数
 */

// ============================================================
// 計測モード
// ============================================================

/*タイマー関連変数*/
var timerState = "home"; // home, select, standby, running, result
var timerDeck = null; // 選択中デッキ {name, parts, deckId}
var timerStart = 0;
var timerElapsed = 0;
var timerInterval = null;
var timerLaps = [];
var timerSelectMode = "saved"; // saved, owned, all
var timerDeckViewMode = "recent"; // 'recent','best','avg'
var countdownSteps = ["3", "2", "1", "ゴーシュート！"];
var countdownInterval = null;


//============================================================
// 関数
//============================================================  

/* 計測モードホーム画面描画*/
function renderTimerHome() {
  timerState = "home";
  timerDeck = null;
  timerLaps = [];
  timerElapsed = 0;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  document.getElementById("timer-content").innerHTML =
    '<div style="padding:0 0 80px;">' +
    '<div style="padding:12px 16px 4px;font-size:11px;color:var(--text2);">計測対象のベイを選択してください</div>' +
    '<div class="battle-mode-card" onclick="startTimerSelect(\'saved\')">' +
    '<div class="battle-mode-icon" style="background:rgba(0,204,68,0.15);">🌀</div>' +
    '<div class="battle-mode-info"><h3>マイデッキから選ぶ</h3><p>登録済みのデッキを計測対象に選択</p></div>' +
    '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>' +
    "</div>" +
    '<div class="battle-mode-card" onclick="startTimerSelect(\'owned\')">' +
    '<div class="battle-mode-icon" style="background:rgba(79,195,247,0.15);">📦</div>' +
    '<div class="battle-mode-info"><h3>所持パーツから組む</h3><p>所持パーツから計測用デッキを組む</p></div>' +
    '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>' +
    "</div>" +
    '<div class="battle-mode-card" onclick="startTimerSelect(\'all\')">' +
    '<div class="battle-mode-icon" style="background:rgba(124,111,255,0.15);">🌐</div>' +
    '<div class="battle-mode-info"><h3>全パーツから組む</h3><p>未所持を含む全パーツから組む</p></div>' +
    '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>' +
    "</div>" +
    "</div>";
}

/*計測モード：デッキ選択画面描画*/
function startTimerSelect(mode) {
  timerSelectMode = mode;
  timerState = "select";
  var html = '<div style="padding:0 0 80px;">';
  html +=
    '<div style="padding:8px 16px;"><button class="btn-sm" onclick="renderTimerHome()" style="padding:6px 12px;"><i class="ti ti-arrow-left"></i> 戻る</button></div>';

  /**
   * デッキ選択モードによって表示を切り替える
   */
  if (mode === "saved") {
    html +=
      '<div style="padding:0 16px 8px;font-size:11px;color:var(--text2);">マイデッキを選択</div>';
    if (!decks.length) {
      html += '<div class="empty">登録済みデッキがありません</div>';
    } else {
      html += decks
        .map(function (d) {
          return (
            '<div class="timer-deck-card" onclick="selectTimerDeck(' +
            d.id +
            ',\'saved\')" style="margin:0 16px 8px;">' +
            '<div style="font-size:13px;font-weight:500;margin-bottom:4px;">' +
            d.name +
            "</div>" +
            '<div style="font-size:10px;color:var(--text2);">' +
            getAllNames(d).join(" / ") +
            "</div>" +
            "</div>"
          );
        })
        .join("");
    }
  } else {
    // 所持/全パーツからデッキを組む → デッキビルダーを流用
    html +=
      '<div style="padding:0 16px 8px;font-size:11px;color:var(--text2);">計測用デッキを組んでください</div>';
    html += '<div style="padding:0 16px;">';
    html += '<div id="timer-deck-builder"></div>';
    html +=
      '<button class="btn-save" onclick="confirmTimerNewDeck()" style="width:100%;padding:12px;border:none;border-radius:10px;font-size:13px;cursor:pointer;margin-top:8px;">このデッキで計測</button>';
    html += "</div>";
  }
  html += "</div>";
  document.getElementById("timer-content").innerHTML = html;

  if (mode !== "saved") {
    // デッキビルダーを埋め込み
    deckMode = mode === "all" ? "all" : "owned";
    pickerMode = deckMode;
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
    renderTimerDeckBuilder();
  }
}

/*デッキビルダー画面描画*/
function renderTimerDeckBuilder() {
  var el = document.getElementById("timer-deck-builder");
  if (!el) return;
  var html = "";
  // 簡易デッキ選択表示
  html +=
    '<div class="part-sel-display" onclick="openTimerPartPicker(\'blade\')" style="margin-bottom:8px;">' +
    '<span style="font-size:11px;color:var(--text2);">ブレード</span>' +
    '<span id="timer-blade-val" style="font-size:12px;color:var(--accent);margin-left:auto;">' +
    (DS.blade || DS.lock ? "選択済み" : "タップして選択") +
    "</span>" +
    '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:6px;"></i>' +
    "</div>";
  html +=
    '<div class="part-sel-display" onclick="openTimerPartPicker(\'ratchet\')" style="margin-bottom:8px;">' +
    '<span style="font-size:11px;color:var(--text2);">ラチェット / 一体型</span>' +
    '<span id="timer-ratchet-val" style="font-size:12px;color:var(--accent);margin-left:auto;">' +
    (DS.ratchet || DS.combo ? "選択済み" : "タップして選択") +
    "</span>" +
    '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:6px;"></i>' +
    "</div>";
  if (!DS.combo) {
    html +=
      '<div class="part-sel-display" onclick="openTimerPartPicker(\'bit\')" style="margin-bottom:8px;">' +
      '<span style="font-size:11px;color:var(--text2);">ビット</span>' +
      '<span id="timer-bit-val" style="font-size:12px;color:var(--accent);margin-left:auto;">' +
      (DS.bit ? "選択済み" : "タップして選択") +
      "</span>" +
      '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:6px;"></i>' +
      "</div>";
  }
  el.innerHTML = html;
}

/*パーツ選択*/
function openTimerPartPicker(target) {
  // 既存のpickerを流用
  openPartPicker(target);
  // pickerDone後にrenderTimerDeckBuilderを呼ぶようフック
  window._timerPickerHook = true;
}

/*ピッカーフック*/
var _origPickerDone = null;
function pickerDoneWithTimerHook() {
  pickerDone();
  if (window._timerPickerHook) {
    window._timerPickerHook = false;
    renderTimerDeckBuilder();
  }
}

/*	デッキ確定*/
function confirmTimerNewDeck() {
  var isCX = DS.bladeLine === "cx";
  if (!DS.bladeLine) {
    showToast("ブレードを選択してください");
    return;
  }
  if (!isCX && !DS.blade) {
    showToast("ブレードを選択してください");
    return;
  }
  if (!DS.combo && !DS.ratchet) {
    showToast("ラチェットを選択してください");
    return;
  }
  if (!DS.combo && !DS.bit) {
    showToast("ビットを選択してください");
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
  var name =
    bp + (DS.combo || DS.ratchet || "") + (DS.combo ? "" : DS.bit || "");

  timerDeck = {
    name: name,
    deckId: null,
    isNew: true,
    parts: {
      bladeLine: DS.bladeLine,
      blade: DS.blade,
      lock: DS.lock,
      main: DS.main,
      assist: DS.assist,
      lock4: DS.lock4,
      metal: DS.metal,
      over: DS.over,
      assist4: DS.assist4,
      ratchet: DS.combo ? null : DS.ratchet,
      bit: DS.combo ? null : DS.bit,
      combo: DS.combo || null,
    },
  };
  renderTimerStandby();
}

/*デッキ選択*/
function selectTimerDeck(deckId, mode) {
  var d = decks.find(function (x) {
    return x.id === deckId;
  });
  if (!d) return;
  timerDeck = { name: d.name, deckId: deckId, isNew: false, parts: d };
  renderTimerStandby();
}

/*待機画面描画*/
function renderTimerStandby() {
  timerState = "standby";
  timerLaps = [];
  timerElapsed = 0;
  document.getElementById("timer-content").innerHTML =
    '<div style="padding:0 0 80px;">' +
    '<div style="padding:8px 16px;"><button class="btn-sm" onclick="renderTimerHome()" style="padding:6px 12px;"><i class="ti ti-arrow-left"></i> 戻る</button></div>' +
    '<div style="padding:12px 16px;background:var(--bg2);margin:0 16px 14px;border-radius:12px;border:0.5px solid var(--border);">' +
    '<div style="font-size:10px;color:var(--text2);margin-bottom:4px;">計測対象</div>' +
    '<div style="font-size:15px;font-weight:600;">' +
    timerDeck.name +
    "</div>" +
    '<div style="font-size:10px;color:var(--text2);margin-top:3px;">' +
    getAllNames(timerDeck.parts).join(" / ") +
    "</div>" +
    "</div>" +
    '<div class="timer-display">' +
    '<div><span class="timer-main">0:00</span><span class="timer-ms">.00</span></div>' +
    '<div class="timer-controls" style="margin-top:24px;">' +
    '<button class="timer-btn-start" onclick="startTimer()">START</button>' +
    "</div>" +
    "</div>" +
    "</div>";
}

/*タイマー開始*/
function startTimer() {
  // 計測開始前にカウントダウンを表示
  timerState = "countdown";
  renderTimerCountdown();
}

/*カウントダウンの描画*/
function renderTimerCountdown() {
  var idx = 0;
  document.getElementById("timer-content").innerHTML =
    '<div style="padding:0 0 80px;">' +
    '<div style="padding:6px 16px;font-size:11px;color:var(--text2);">計測対象: ' +
    timerDeck.name +
    "</div>" +
    '<div class="countdown-display">' +
    '<div class="countdown-num" id="countdown-num">' +
    countdownSteps[0] +
    "</div>" +
    '<div class="countdown-label">構えてください</div>' +
    "</div>" +
    "</div>";

  countdownInterval = setInterval(function () {
    idx++;
    var el = document.getElementById("countdown-num");
    var labelEl = document.querySelector(".countdown-label");
    if (idx < countdownSteps.length) {
      if (el) {
        // アニメーションリセットのため一旦クラス除去→再付与
        el.classList.remove("countdown-num", "countdown-shoot");
        if (idx === countdownSteps.length - 1) {
          el.className = "countdown-shoot";
        } else {
          el.className = "countdown-num";
        }
        // 強制リフロー
        void el.offsetWidth;
        el.classList.add(
          idx === countdownSteps.length - 1
            ? "countdown-shoot"
            : "countdown-num"
        );
        el.textContent = countdownSteps[idx];
      }
      if (labelEl)
        labelEl.textContent =
          idx === countdownSteps.length - 1 ? "計測開始！" : "構えてください";
    } else {
      clearInterval(countdownInterval);
      countdownInterval = null;
      actuallyStartTimer();
    }
  }, 700);
}

/*実際の計測開始*/
function actuallyStartTimer() {
  timerState = "running";
  timerElapsed = 0;
  timerStart = Date.now() - timerElapsed;
  timerInterval = setInterval(function () {
    timerElapsed = Date.now() - timerStart;
    updateTimerDisplay();
  }, 30);
  renderTimerRunning();
}

/*タイマー表示更新*/
function updateTimerDisplay() {
  var el = document.getElementById("timer-time-main");
  var el2 = document.getElementById("timer-time-ms");
  if (!el) return;
  var ms = timerElapsed;
  var m = Math.floor(ms / 60000);
  var s = Math.floor((ms % 60000) / 1000);
  var cs = Math.floor((ms % 1000) / 10);
  el.textContent =
    (m > 0 ? m + ":" : "") + (m > 0 ? String(s).padStart(2, "0") : s);
  el2.textContent = "." + String(cs).padStart(2, "0");
}

/*計測中画面描画*/
function renderTimerRunning() {
  document.getElementById("timer-content").innerHTML =
    '<div style="padding:0 0 80px;">' +
    '<div style="padding:6px 16px;font-size:11px;color:var(--text2);">計測中: ' +
    timerDeck.name +
    "</div>" +
    '<div class="timer-display">' +
    '<div><span class="timer-main" id="timer-time-main">0:00</span><span class="timer-ms" id="timer-time-ms">.00</span></div>' +
    '<div class="timer-controls">' +
    '<button class="timer-btn-lap" onclick="recordLap()">LAP</button>' +
    '<button class="timer-btn-stop" onclick="stopTimer()">STOP</button>' +
    '<button class="timer-btn-reset" onclick="resetTimer()">RST</button>' +
    "</div>" +
    "</div>" +
    '<div class="lap-list" id="lap-list"></div>' +
    "</div>";
}

/*ラップ記録表示*/
function recordLap() {
  var lapTime = timerElapsed;
  timerLaps.push(lapTime);
  var lapList = document.getElementById("lap-list");
  if (lapList) {
    var prev = timerLaps.length > 1 ? timerLaps[timerLaps.length - 2] : 0;
    var split = lapTime - prev;
    lapList.innerHTML =
      '<div style="font-size:10px;color:var(--text3);padding:4px 0;">ラップ</div>' +
      timerLaps
        .slice()
        .reverse()
        .map(function (t, i) {
          var idx = timerLaps.length - i;
          var pr = idx > 1 ? timerLaps[idx - 2] : 0;
          return (
            '<div class="lap-item"><span>Lap ' +
            idx +
            "</span><span>+" +
            fmtTime(t - pr) +
            '</span><span style="color:var(--accent);">' +
            fmtTime(t) +
            "</span></div>"
          );
        })
        .join("");
  }
}

/*タイマー停止*/
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerState = "result";
  renderTimerResult();
}

/*タイマーリセット*/
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  timerElapsed = 0;
  timerLaps = [];
  renderTimerStandby();
}

/*結果画面描画*/
function renderTimerResult() {
  var total = fmtTimeSec(timerElapsed); // 秒単位
  var html =
    '<div style="padding:0 0 80px;">' +
    '<div class="timer-result-card">' +
    '<div style="font-size:12px;color:var(--text2);margin-bottom:8px;">計測結果</div>' +
    '<div style="font-size:11px;color:var(--text2);margin-bottom:4px;">持久力</div>' +
    '<div class="timer-result-time">' +
    fmtTimeSec(timerElapsed) +
    " 秒</div>" +
    '<div style="font-size:12px;color:var(--text2);margin-top:6px;">' +
    timerDeck.name +
    "</div>" +
    (timerLaps.length
      ? '<div style="font-size:10px;color:var(--text3);margin-top:4px;">ラップ ' +
        timerLaps.length +
        "件</div>"
      : "") +
    "</div>";

  // マイデッキ登録済みか確認
  /**
   * timerDeck.deckId が存在する場合、decks 配列から対応するデッキを検索し、matchedDeck に格納します。
   */
  var matchedDeck = timerDeck.deckId
    ? decks.find(function (d) {
        return d.id === timerDeck.deckId;
      })
    : null;

  /**
   * matchedDeck が存在する場合、計測結果を登録するかどうかの確認メッセージとボタンを表示します。
   * matchedDeck が存在しない場合、デッキがマイデッキに登録されていないことを示すメッセージと、登録して計測結果を保存するかどうかの確認ボタンを表示します。
   */
  if (matchedDeck) {
    html +=
      '<div style="padding:0 16px;">' +
      '<p style="font-size:13px;color:var(--text);margin-bottom:12px;">この計測結果を「' +
      matchedDeck.name +
      "」に登録しますか？</p>" +
      '<div style="display:flex;gap:8px;">' +
      '<button class="btn-save" onclick="saveTimerResult(' +
      matchedDeck.id +
      ')" style="flex:1;padding:11px;border:none;border-radius:8px;font-size:13px;cursor:pointer;">登録する</button>' +
      '<button class="btn-cancel" onclick="confirmDiscardTimer()" style="flex:1;padding:11px;border-radius:8px;cursor:pointer;background:var(--bg3);border:none;color:var(--text2);">いいえ</button>' +
      "</div>" +
      "</div>";
  } else {
    html +=
      '<div style="padding:0 16px;">' +
      '<p style="font-size:13px;color:var(--text);margin-bottom:12px;">このデッキはマイデッキに登録されていません。登録して計測結果を保存しますか？</p>' +
      '<div style="display:flex;gap:8px;">' +
      '<button class="btn-save" onclick="registerAndSaveTimer()" style="flex:1;padding:11px;border:none;border-radius:8px;font-size:13px;cursor:pointer;">登録して保存</button>' +
      '<button class="btn-cancel" onclick="confirmDiscardTimer()" style="flex:1;padding:11px;border-radius:8px;cursor:pointer;background:var(--bg3);border:none;color:var(--text2);">登録しない</button>' +
      "</div>" +
      "</div>";
  }
  /**
   * 計測結果の詳細を表示するためのHTMLを生成します。ラップタイムが存在する場合、ラップタイムのリストを表示します。
   */
  html += "</div>";
  document.getElementById("timer-content").innerHTML = html;
}

/*結果保存*/
function saveTimerResult(deckId) {
  if (!measureRecords[deckId]) measureRecords[deckId] = [];
  measureRecords[deckId].push({
    time_ms: timerElapsed,
    laps: timerLaps.slice(),
    date: new Date().toISOString(),
  });
  saveMeasureRecords();
  showToast("計測結果を登録しました", "ok");
  renderTimerHome();
  renderHome();
}

/*デッキ登録＋保存*/
function registerAndSaveTimer() {
  // デッキをマイデッキに登録
  var p = timerDeck.parts;
  var newDeck = Object.assign({}, p, {
    id: nextDeckId++,
    name: timerDeck.name,
    battle: false,
  });

  decks.push(newDeck);
  saveDecks();
  timerDeck.deckId = newDeck.id;

  /*未所持パーツの抽出*/
  var deckPartNames = getAllNames(p).filter(function (name) {
    return name.trim() !== "";
  });
  var unownedNames = deckPartNames.filter(function (name) {
    return !parts.some(function (owned) {
      return owned.name === name;
    });
  });

  // 未所持パーツがあれば確認
  if (unownedNames.length > 0) {
    var msg =
      "以下のパーツが未登録です。所持パーツに追加しますか？\n\n" +
      unownedNames.join("\n");

    if (confirm(msg)) {
      // 未所持パーツをpartsに追加
      unownedNames.forEach(function (name) {
        // ALL_DBから該当パーツを探す
        var dbItem = ALL_DB.find(function (item) {
          return item.name === name;
        });
        if (dbItem) {
          parts.push(
            Object.assign({}, dbItem, {
              id: nextId++,
              qty: 1,
              memo: "",
              img: null,
            })
          );
        }
      });
      saveParts();
      showToast(unownedNames.length + "件のパーツを登録しました", "ok");
    }
  }

  saveTimerResult(newDeck.id);
  renderDecks();
}

/*	記録破棄確認　*/
function confirmDiscardTimer() {
  if (confirm("計測結果が無効になりますがよろしいですか？")) {
    renderTimerHome();
  }
}

/*　デッキ詳細開閉　*/
function toggleDeckDetail(deckId) {
  var el = document.getElementById("deck-detail-" + deckId);
  if (!el) return;
  var isOpen = el.style.display !== "none";
  el.style.display = isOpen ? "none" : "block";
  // ボタンのテキストも更新
  var btn = document.getElementById("deck-detail-btn-" + deckId);
  if (btn)
    btn.innerHTML =
      '<i class="ti ti-chart-bar"></i> ' + (isOpen ? "詳細" : "閉じる");
  if (!isOpen)
    el.innerHTML = renderDeckMeasureDetail(
      decks.find(function (d) {
        return d.id === deckId;
      })
    );
}

/*　計測詳細表示　*/
function renderDeckMeasureDetail(d) {
  if (!d) return "";
  var records = measureRecords[d.id] || [];
  var html = "<div>";

  // 表示切り替えタブ
  var viewMode = d._measViewMode || "recent";
  html +=
    '<div class="meas-record-tabs">' +
    '<span class="meas-record-tab ' +
    (viewMode === "recent" ? "active" : "") +
    '" onclick="setDeckMeasView(' +
    d.id +
    ",'recent')\">直近5件</span>" +
    '<span class="meas-record-tab ' +
    (viewMode === "best" ? "active" : "") +
    '" onclick="setDeckMeasView(' +
    d.id +
    ",'best')\">最長記録</span>" +
    '<span class="meas-record-tab ' +
    (viewMode === "avg" ? "active" : "") +
    '" onclick="setDeckMeasView(' +
    d.id +
    ",'avg')\">平均</span>" +
    "</div>";

  if (!records.length) {
    html += '<div class="no-record">未計測</div>';
  } else {
    if (viewMode === "recent") {
      var recentStart = Math.max(0, records.length - 5);
      var recent = records.slice(recentStart).reverse();
      html += recent
        .map(function (r, i) {
          var realIdx = records.length - 1 - i; // 実際のインデックス
          return (
            '<div class="meas-record-item">' +
            '<div><div class="meas-record-time">' +
            fmtTime(r.time_ms) +
            "</div>" +
            (r.laps && r.laps.length
              ? '<div style="font-size:9px;color:var(--text3);">ラップ' +
                r.laps.length +
                "件</div>"
              : "") +
            "</div>" +
            '<div style="text-align:right;">' +
            '<div class="meas-record-date">' +
            new Date(r.date).toLocaleDateString("ja-JP") +
            "</div>" +
            '<button class="btn-sm danger" onclick="deleteMeasRecord(' +
            d.id +
            "," +
            realIdx +
            ')" style="font-size:9px;padding:2px 6px;margin-top:2px;">削除</button>' +
            "</div>" +
            "</div>"
          );
        })
        .join("");
    } else if (viewMode === "best") {
      var best = records.reduce(function (a, b) {
        return b.time_ms > a.time_ms ? b : a;
      });
      html +=
        '<div class="meas-record-item">' +
        '<div><div style="font-size:10px;color:var(--text2);">🏆 最長記録</div><div class="meas-record-time">' +
        fmtTime(best.time_ms) +
        "</div></div>" +
        '<div class="meas-record-date">' +
        new Date(best.date).toLocaleDateString("ja-JP") +
        "</div>" +
        "</div>";
    } else {
      var avg = Math.round(
        records.reduce(function (s, r) {
          return s + r.time_ms;
        }, 0) / records.length
      );
      html +=
        '<div class="meas-record-item">' +
        '<div><div style="font-size:10px;color:var(--text2);">📊 平均 (全' +
        records.length +
        '回)</div><div class="meas-record-time">' +
        fmtTime(avg) +
        "</div></div>" +
        "</div>";
    }
    // 全記録削除
    html +=
      '<button class="btn-sm danger" onclick="clearMeasRecords(' +
      d.id +
      ')" style="font-size:10px;margin-top:8px;width:100%;text-align:center;">計測記録をすべて削除</button>';
  }
  html += "</div>";
  return html;
}

/*　表示切り替え　*/
function setDeckMeasView(deckId, mode) {
  var d = decks.find(function (x) {
    return x.id === deckId;
  });
  if (d) d._measViewMode = mode;
  var el = document.getElementById("deck-detail-" + deckId);
  if (el) el.innerHTML = renderDeckMeasureDetail(d);
}

/*　記録削除　*/
function deleteMeasRecord(deckId, idx) {
  if (!measureRecords[deckId]) return;
  measureRecords[deckId].splice(idx, 1);
  saveMeasureRecords();
  var d = decks.find(function (x) {
    return x.id === deckId;
  });
  var el = document.getElementById("deck-detail-" + deckId);
  if (el) el.innerHTML = renderDeckMeasureDetail(d);
  renderHome();
}

/*　全記録削除　*/
function clearMeasRecords(deckId) {
  if (!confirm("このデッキの計測記録をすべて削除しますか？")) return;
  measureRecords[deckId] = [];
  saveMeasureRecords();
  var d = decks.find(function (x) {
    return x.id === deckId;
  });
  var el = document.getElementById("deck-detail-" + deckId);
  if (el) el.innerHTML = renderDeckMeasureDetail(d);
  renderHome();
}