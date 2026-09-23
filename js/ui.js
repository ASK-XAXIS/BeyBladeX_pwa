/**
 * ui.js
 * UIに関わる関数など
 */

/**
 * 戻るボタンやキャンセルボタンを押したときに入力や選択がある状態なら
 * 確認ダイアログを出す
 */
function checkNavReturn() {
  var hasInput = false;

  // 選択中のパーツ表示を確認
  var selectedItemsText = document.getElementById(
    "add-picker-selected-names"
  ).textContent;

  if (selectedItemsText.trim()) {
    hasInput = true;
  }

  if (hasInput) {
    // 確認ダイアログを表示して止まる
    pendingNavTarget = "modal-add-picker"; // 閉じるモーダルIDを保存
    document.getElementById("modal-confirm-nav").classList.remove("hidden");
  } else {
    // 入力なし → そのまま閉じる
    closeModal("modal-add-picker");
  }
}
/**
 * checkNavSwitch(name)
 * タブを切り替える前にユーザーに確認する関数
 * @param {*} name 押したタブの名前
 */
function checkNavSwitch(name) {
  //入力中のデータの有無
  var hasInput = false;

  //パーツ追加モーダルのチェック
  var addPickerModal = document.getElementById("modal-add-picker");
  if (addPickerModal && !addPickerModal.classList.contains("hidden")) {
    //モーダル内で何かが選択されているかのチェック
    var hasChecked = false;
    Object.keys(addPickerTemp).forEach(function (k) {
      if (Object.keys(addPickerTemp[k]).length > 0) hasChecked = true;
    });
    if (hasChecked) hasInput = true;
  }

  // デッキ作成モーダルのチェック
  var deckModal = document.getElementById("modal-deck");
  if (deckModal && !deckModal.classList.contains("hidden")) {
    var allNames = [
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
    ].filter(Boolean); //.filter(Boolean)はnull・undifinedを除外する
    if (allNames.length > 0) hasInput = true;

    //デッキ名入力欄に文字が入っているかを確認
    var nameInp = document.getElementById("deck-name-inp");
    if (nameInp && nameInp.value.trim()) hasInput = true;
  }

  var pickerModal = document.getElementById("modal-picker");
  if (pickerModal && !pickerModal.classList.contains("hidden")) {
    var hasP = Object.keys(pickerTemp).some(function (k) {
      return !!pickerTemp[k];
    });
    if (hasP) hasInput = true;
  }

  /**
   * チェック結果による分岐
   * hasInput = true→確認ダイアログを表示し、ユーザーに選択してもらう
   *          = false→全モーダルを閉じ選択したタブの画面に遷移
   */
  if (hasInput) {
    pendingNavTarget = name;
    document.getElementById("modal-confirm-nav").classList.remove("hidden");
  } else {
    [
      "modal-part",
      "modal-add-picker",
      "modal-deck",
      "modal-picker",
      "modal-rename",
      "modal-battle-deck",
    ].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });
    showScreen(name);
  }
}

/* 確認ダイアログでYES（はい）を選択したときの関数*/
function confirmNavYes() {
  closeModal("modal-confirm-nav");
  // pendingNavTargetがモーダルIDの場合はcloseModal
  if (pendingNavTarget && pendingNavTarget.startsWith("modal-")) {
    closeModal(pendingNavTarget);
  } else {
    // 従来通り画面遷移
    showScreen(pendingNavTarget);
  }
  pendingNavTarget = null;
}

/*確認ダイアログでNO（いいえ）を選択したときの関数*/
function confirmNavNo() {
  document.getElementById("modal-confirm-nav").classList.add("hidden");
  pendingNavTarget = null;
}

/*画面切替え用関数*/
function showScreen(name) {
  //全画面のactiveを外す
  document.querySelectorAll(".screen").forEach(function (s) {
    s.classList.remove("active");
  });

  //全ナビゲーションボタンのactiveを外す
  document.querySelectorAll(".nav-btn").forEach(function (b) {
    b.classList.remove("active");
  });

  //指定した画面だけactiveをつける
  document.getElementById("screen-" + name).classList.add("active");
  document.getElementById("nav-" + name).classList.add("active");

  //画面ごとの描画関数を呼ぶ(画面下部のタブを押すとそれぞれが呼ばれる)
  if (name === "home") renderHome();
  if (name === "parts") renderParts();
  if (name === "decks") renderDecks();
  if (name === "battle") renderBattleHome();
  if (name === "timer") renderTimerHome();
}

/* ===== テーマ管理 ===== */

/*テーマ適用*/
function applyTheme() {
  var root = document.documentElement;
  if (themeMode === "light") {
    root.setAttribute("data-theme", "light");
  } else if (themeMode === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }
}
applyTheme();

/*テーマ設定*/
function setTheme(t) {
  themeMode = t;
  localStorage.setItem("bx_theme", t);
  applyTheme();
  renderBattleHome();
}

/*テーマ選択UIのHTML生成 */
function getThemeChipsHtml() {
  var chips = [
    ["system", "自動"],
    ["dark", "🌙 ダーク"],
    ["light", "☀️ ライト"],
  ];
  var html = '<div style="display:flex;gap:5px;">';
  chips.forEach(function (c) {
    var active = themeMode === c[0] ? "active" : "";
    html +=
      '<span class="sel-chip ' +
      active +
      '" data-t="' +
      c[0] +
      '" onclick="setTheme(this.dataset.t)" style="font-size:10px;padding:4px 8px;cursor:pointer;">' +
      c[1] +
      "</span>";
  });
  html += "</div>";
  return html;
}
/*ホーム画面の描画*/
function renderHome() {
  // 所持パーツ数（qty>0）
  var ownedCount = parts.filter(function (p) {
    return p.qty > 0;
  }).length;
  document.getElementById("home-parts-count").textContent = ownedCount;
  document.getElementById("home-decks-count").textContent = decks.length;

  // 勝敗集計（winCountModeに対応）
  var src =
    winCountMode === "battle"
      ? battleRecords.reduce(function (a, r) {
          return a.concat(r.battles || []);
        }, [])
      : battleRecords;
  var wins = src.filter(function (r) {
    return r.result === "win";
  }).length;
  var losses = src.filter(function (r) {
    return r.result === "loss";
  }).length;
  var draws = src.filter(function (r) {
    return r.result === "draw";
  }).length;
  var total = wins + losses + draws;
  document.getElementById("home-wins").textContent = wins;
  document.getElementById("home-losses").textContent = losses;
  document.getElementById("home-draws").textContent = draws;
  var rateEl = document.getElementById("home-win-rate");
  if (total > 0) {
    rateEl.textContent = Math.round((wins / total) * 100) + "%";
  } else {
    rateEl.textContent = "—";
  }

  // 最近追加パーツ（最大5件）
  var recentParts = [].concat(parts).reverse().slice(0, 5);
  var rpEl = document.getElementById("home-recent-parts");
  if (rpEl) {
    if (!recentParts.length) {
      rpEl.innerHTML =
        '<div style="font-size:11px;color:var(--text3);">パーツ未登録</div>';
    } else {
      rpEl.innerHTML = recentParts
        .map(function (p) {
          var th = p.img ? '<img src="' + p.img + '">' : EMOJI[p.cat] || "❓";
          return (
            '<div class="home-recent-part">' +
            '<div class="home-recent-part-thumb">' +
            th +
            "</div>" +
            '<div class="home-recent-part-name">' +
            p.name +
            "</div>" +
            "</div>"
          );
        })
        .join("");
    }
  }

  // 最近追加デッキ（最大3件）
  var recentDecks = [].concat(decks).reverse().slice(0, 3);
  var rdEl = document.getElementById("home-recent-decks");
  if (rdEl) {
    if (!recentDecks.length) {
      rdEl.innerHTML =
        '<div style="font-size:11px;color:var(--text3);">デッキ未登録</div>';
    } else {
      rdEl.innerHTML = recentDecks
        .map(function (d) {
          return (
            '<div class="home-recent-deck">' +
            '<div class="home-recent-deck-name">' +
            d.name +
            "</div>" +
            '<div class="home-recent-deck-parts">' +
            getAllNames(d).join(" / ") +
            "</div>" +
            "</div>"
          );
        })
        .join("");
    }
  }

  // 計測最高記録
  var bestTimeEl = document.getElementById("home-best-time");
  if (bestTimeEl) {
    var bestTime = 0,
      bestDeckName = "",
      bestDate = "";
    Object.keys(measureRecords).forEach(function (deckId) {
      var recs = measureRecords[deckId] || [];
      recs.forEach(function (r) {
        if (r.time_ms > bestTime) {
          bestTime = r.time_ms;
          bestDate = r.date;
          var d = decks.find(function (x) {
            return x.id === parseInt(deckId);
          });
          bestDeckName = d ? d.name : "不明なデッキ";
        }
      });
    });
    if (bestTime > 0) {
      bestTimeEl.innerHTML =
        '<div class="home-deck-card" style="border-color:var(--accent);">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;">' +
        "<div>" +
        '<div style="font-size:10px;color:var(--text2);margin-bottom:2px;">🏆 ベストタイム</div>' +
        '<div style="font-size:10px;color:var(--text2);margin-bottom:2px;">持久力</div>' +
        '<div style="font-size:24px;font-weight:700;color:var(--accent);">' +
        fmtTimeSec(bestTime) +
        " 秒</div>" +
        '<div style="font-size:11px;color:var(--text2);margin-top:2px;">' +
        bestDeckName +
        "</div>" +
        "</div>" +
        '<div style="font-size:10px;color:var(--text3);">' +
        new Date(bestDate).toLocaleDateString("ja-JP") +
        "</div>" +
        "</div>" +
        "</div>";
    } else {
      bestTimeEl.innerHTML =
        '<div style="font-size:11px;color:var(--text3);">計測記録なし</div>';
    }
  }

  // 試合用デッキ
  var battleDecks = decks.filter(function (d) {
    return d.battle;
  });
  var el = document.getElementById("home-battle-decks");
  if (!battleDecks.length) {
    el.innerHTML =
      '<div class="home-empty">試合用デッキが登録されていません<br>マイデッキから「試合用に登録」してください</div>';
    return;
  }
  el.innerHTML = battleDecks
    .map(function (d, idx) {
      var parts_list = [];
      if (d.blade) parts_list.push({ label: "ブレード", name: d.blade });
      if (d.lock) parts_list.push({ label: "ロック", name: d.lock });
      if (d.main) parts_list.push({ label: "メイン", name: d.main });
      if (d.assist) parts_list.push({ label: "アシスト", name: d.assist });
      if (d.lock4) parts_list.push({ label: "ロック", name: d.lock4 });
      if (d.metal) parts_list.push({ label: "メタル", name: d.metal });
      if (d.over) parts_list.push({ label: "オーバー", name: d.over });
      if (d.assist4) parts_list.push({ label: "アシスト", name: d.assist4 });
      if (d.combo) parts_list.push({ label: "一体型", name: d.combo });
      else {
        if (d.ratchet)
          parts_list.push({ label: "ラチェット", name: d.ratchet });
        if (d.bit) parts_list.push({ label: "ビット", name: d.bit });
      }
      var slots = parts_list
        .map(function (p) {
          return (
            '<span class="home-deck-part"><span style="color:var(--color-text-tertiary,var(--text3));font-size:9px;">' +
            p.label +
            "</span> " +
            p.name +
            "</span>"
          );
        })
        .join("");
      return (
        '<div class="home-deck-card">' +
        '<div class="home-deck-name">' +
        '<span style="font-size:11px;background:rgba(76,175,130,0.2);color:#4caf82;padding:2px 8px;border-radius:10px;">DECK ' +
        (idx + 1) +
        "</span>" +
        d.name +
        "</div>" +
        '<div class="home-deck-slot">' +
        slots +
        "</div>" +
        "</div>"
      );
    })
    .join("");
}

/*勝敗カウント設定*/
function setWinCountMode(m) {
  winCountMode = m;
  localStorage.setItem("bx_winCountMode", m);
  renderBattleHome();
  renderHome();
}