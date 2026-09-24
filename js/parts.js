/**
 * parts.js
 * パーツ関連の変数・関数
 */

//==============================================================
//変数
//==============================================================

/* 追加ピッカー用変数 */
var addPickerCat = null;
var addPickerBladeLine = "bx";
var addPickerCxPat = 3;
var addPickerTemp = {}; // {blade, lock, main, assist, lock4, metal, over, assist4, ratchet, bit, combo}
var addPickerSearchQuery = "";

//==============================================================
//関数
//==============================================================

/* パーツ統計表示描画 */
function renderStats() {
  var c = { blade: 0, ratchet: 0, bit: 0, combo: 0 };
  parts.forEach(function (p) {
    c[p.cat] = (c[p.cat] || 0) + p.qty;
  });
  document.getElementById("stats-row").innerHTML = [
    "blade",
    "ratchet",
    "bit",
    "combo",
  ]
    .map(function (k) {
      return (
        '<div class="stat ' +
        k +
        '"><div class="stat-num">' +
        (c[k] || 0) +
        '</div><div class="stat-label">' +
        (k === "combo" ? "一体型" : CATLBL[k]) +
        "</div></div>"
      );
    })
    .join("");
}

/* メインタブの描画 */
function renderMainTabs() {
  document.getElementById("main-tabs").innerHTML = [
    "all",
    "blade",
    "ratchet",
    "bit",
    "combo",
  ]
    .map(function (t) {
      return (
        '<span class="tab-chip ' +
        (mainTab === t ? "active" : "") +
        '" onclick="setMainTab(\'' +
        t +
        "')\">" +
        (t === "all" ? "すべて" : t === "combo" ? "一体型ビット" : CATLBL[t]) +
        "</span>"
      );
    })
    .join("");
}

/* サブタブの描画 */
function renderSubTabs() {
  var area = document.getElementById("sub-tabs-area");
  if (mainTab !== "blade") {
    area.innerHTML = "";
    return;
  }
  var h = '<div class="sub-tabs">';
  ["all", "bx", "ux", "cx"].forEach(function (l) {
    h +=
      '<span class="sub-tab ' +
      (bladeSubTab === l ? "active" : "") +
      '" onclick="setBladeSubTab(\'' +
      l +
      "')\">" +
      (l === "all" ? "すべて" : LINE[l]) +
      "</span>";
  });
  h += "</div>";
  if (bladeSubTab === "cx") {
    h += '<div class="cx-tabs">';
    ["lock", "main", "assist", "metal", "over"].forEach(function (c) {
      h +=
        '<span class="cx-tab ' +
        (cxSubTab === c ? "active" : "") +
        '" onclick="setCxSubTab(\'' +
        c +
        "')\">" +
        CXLBL[c] +
        "</span>";
    });
    h += "</div>";
  }
  area.innerHTML = h;
}
var partsSearchQuery = "";

/* フィルタリングされたパーツの取得 */
function getFiltered() {
  var q = normalizeStr(partsSearchQuery.trim());
  return parts.filter(function (p) {
    if (mainTab !== "all" && mainTab !== p.cat) return false;
    if (mainTab === "blade") {
      if (bladeSubTab !== "all" && bladeSubTab !== p.line) return false;
      if (bladeSubTab === "cx" && p.cxType !== cxSubTab) return false;
    }
    if (q && normalizeStr(p.name).indexOf(q) < 0) return false;
    return true;
  });
}

/* 検索入力時の処理 */
function onPartsSearch(val) {
  partsSearchQuery = val;
  var wrap = document.getElementById("parts-search-wrap");
  if (wrap) wrap.classList.toggle("has-query", !!val);
  updatePartsDatalist(val);
  // パーツリストだけ更新（検索窓は再描画しない）
  var list = document.getElementById("parts-list");
  var filtered = getFiltered();
  if (!filtered.length) {
    list.innerHTML =
      '<div class="empty">「' + val + "」に一致するパーツがありません</div>";
    return;
  }
  // renderPartsのリスト部分だけ実行
  renderStats();
  list.innerHTML = filtered
    .map(function (p) {
      var th = p.img
        ? '<img src="' + p.img + '" alt="' + p.name + '">'
        : '<span class="part-thumb-placeholder">' + EMOJI[p.cat] + "</span>";
      var statsOpen = p._statsOpen ? "open" : "";
      var memoOpen = p._memoOpen ? "open" : "";
      return (
        '<div class="part-card" id="pcard-' +
        p.id +
        '">' +
        '<div class="part-del-btn" onclick="askDelPart(' +
        p.id +
        ')" title="削除"><i class="ti ti-minus"></i></div>' +
        '<div class="part-card-inner">' +
        '<div class="part-thumb-col">' +
        '<div class="part-thumb">' +
        th +
        "</div>" +
        '<div class="part-qty-row">' +
        '<button class="qty-btn" onclick="chgQty(' +
        p.id +
        ',-1)" style="width:24px;height:24px;font-size:14px;">−</button>' +
        '<span class="qty-num" id="qty-' +
        p.id +
        '" style="font-size:14px;min-width:18px;">' +
        p.qty +
        "</span>" +
        '<button class="qty-btn" onclick="chgQty(' +
        p.id +
        ',1)" style="width:24px;height:24px;font-size:14px;">＋</button>' +
        "</div>" +
        "</div>" +
        '<div class="part-info">' +
        '<div class="part-name">' +
        p.name +
        "</div>" +
        '<div class="part-badges">' +
        getBadges(p) +
        "</div>" +
        (p.memo && memoOpen
          ? '<div class="part-memo-full open" id="pmemo-' +
            p.id +
            '">' +
            p.memo +
            "</div>"
          : '<div class="part-memo-full" id="pmemo-' +
            p.id +
            '">' +
            p.memo +
            "</div>") +
        '<div class="part-actions">' +
        '<button class="btn-sm" onclick="openEditPart(' +
        p.id +
        ')" style="font-size:10px;padding:3px 10px;"><i class="ti ti-pencil"></i> 編集</button>' +
        '<button class="btn-sm" onclick="toggleMemo(' +
        p.id +
        ')" style="font-size:10px;padding:3px 10px;" id="pmemo-btn-' +
        p.id +
        '">' +
        (p._memoOpen
          ? '<i class="ti ti-chevron-up"></i> 閉じる'
          : '<i class="ti ti-notes"></i> 詳細') +
        "</button>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="part-stats-area ' +
        statsOpen +
        '" id="pstats-' +
        p.id +
        '">' +
        getPartStatsHtml(p) +
        "</div>" +
        "</div>"
      );
    })
    .join("");
}

/* 検索窓クリア */
function clearPartsSearch() {
  partsSearchQuery = "";
  var inp = document.getElementById("parts-search-inp");
  if (inp) inp.value = "";
  var wrap = document.getElementById("parts-search-wrap");
  if (wrap) wrap.classList.remove("has-query");
  renderParts();
}

/* サジェスト更新 */
function updatePartsDatalist(q) {
  var dl = document.getElementById("parts-search-list");
  if (!dl) return;
  var nq = normalizeStr(q || "");
  // 現在のタブ内パーツ候補
  var candidates = parts
    .filter(function (p) {
      if (mainTab !== "all" && mainTab !== p.cat) return false;
      if (mainTab === "blade") {
        if (bladeSubTab !== "all" && bladeSubTab !== p.line) return false;
        if (bladeSubTab === "cx" && p.cxType !== cxSubTab) return false;
      }
      if (nq && normalizeStr(p.name).indexOf(nq) < 0) return false;
      return true;
    })
    .slice(0, 10);
  dl.innerHTML = candidates
    .map(function (p) {
      return '<option value="' + p.name + '">';
    })
    .join("");
}

/* パーツ一覧描画 */
function renderParts() {
  renderStats();
  renderMainTabs();
  renderSubTabs();
  var list = document.getElementById("parts-list");
  var filtered = getFiltered();
  if (!filtered.length) {
    list.innerHTML =
      '<div class="empty">パーツがありません<br>「追加」から登録してください</div>';
    return;
  }
  list.innerHTML = filtered
    .map(function (p) {
      var th = p.img
        ? '<img src="' + p.img + '" alt="' + p.name + '">'
        : '<span class="part-thumb-placeholder">' + EMOJI[p.cat] + "</span>";
      var statsOpen = p._statsOpen ? "open" : "";
      var memoOpen = p._memoOpen ? "open" : "";
      return (
        '<div class="part-card" id="pcard-' +
        p.id +
        '">' +
        // 削除ボタン（右上赤丸）
        '<div class="part-del-btn" onclick="askDelPart(' +
        p.id +
        ')" title="削除"><i class="ti ti-minus"></i></div>' +
        '<div class="part-card-inner">' +
        // サムネイル + 所持数ボタン（縦並び）
        '<div class="part-thumb-col">' +
        '<div class="part-thumb">' +
        th +
        "</div>" +
        '<div class="part-qty-row">' +
        '<button class="qty-btn" onclick="chgQty(' +
        p.id +
        ',-1)" style="width:24px;height:24px;font-size:14px;">−</button>' +
        '<span class="qty-num" id="qty-' +
        p.id +
        '" style="font-size:14px;min-width:18px;">' +
        p.qty +
        "</span>" +
        '<button class="qty-btn" onclick="chgQty(' +
        p.id +
        ',1)" style="width:24px;height:24px;font-size:14px;">＋</button>' +
        "</div>" +
        "</div>" +
        // パーツ情報
        '<div class="part-info">' +
        '<div class="part-name">' +
        p.name +
        "</div>" +
        '<div class="part-badges">' +
        getBadges(p) +
        "</div>" +
        (p.memo && memoOpen
          ? '<div class="part-memo-full open" id="pmemo-' +
            p.id +
            '">' +
            p.memo +
            "</div>"
          : '<div class="part-memo-full" id="pmemo-' +
            p.id +
            '">' +
            p.memo +
            "</div>") +
        // アクションボタン横並び
        '<div class="part-actions">' +
        '<button class="btn-sm" onclick="openEditPart(' +
        p.id +
        ')" style="font-size:10px;padding:3px 10px;"><i class="ti ti-pencil"></i> 編集</button>' +
        '<button class="btn-sm" onclick="toggleMemo(' +
        p.id +
        ')" style="font-size:10px;padding:3px 10px;" id="pmemo-btn-' +
        p.id +
        '">' +
        (p._memoOpen
          ? '<i class="ti ti-chevron-up"></i> 閉じる'
          : '<i class="ti ti-notes"></i> 詳細') +
        "</button>" +
        "</div>" +
        "</div>" +
        "</div>" +
        // 詳細エリア（統計）
        '<div class="part-stats-area ' +
        statsOpen +
        '" id="pstats-' +
        p.id +
        '">' +
        getPartStatsHtml(p) +
        "</div>" +
        "</div>"
      );
    })
    .join("");
}

/* メモの表示/非表示を切り替える */
function toggleMemo(id) {
  var p = parts.find(function (x) {
    return x.id === id;
  });
  if (!p) return;
  p._memoOpen = !p._memoOpen;
  p._statsOpen = p._memoOpen; // 詳細エリアも連動
  var memoEl = document.getElementById("pmemo-" + id);
  var statsEl = document.getElementById("pstats-" + id);
  var btn = document.getElementById("pmemo-btn-" + id);
  if (memoEl) memoEl.classList.toggle("open", p._memoOpen);
  if (statsEl) {
    statsEl.classList.toggle("open", p._memoOpen);
    if (p._memoOpen) statsEl.innerHTML = getPartStatsHtml(p);
  }
  if (btn)
    btn.innerHTML = p._memoOpen
      ? '<i class="ti ti-chevron-up"></i> 閉じる'
      : '<i class="ti ti-notes"></i> 詳細';
}

// ============================================================
// パーツ統計計算
// ============================================================

/* バースト負けの回数 */
function getBurstLossCount(partName, records) {
  var burstCount = 0;
  for (var i = 0; i < records.length; i++) {
    var record = records[i];
    for (var j = 0; j < record.battles.length; j++) {
      var battle = record.battles[j];
      if (battle.winner === "opp" && battle.finish === "bf") {
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

/* パーツ統計HTMLの生成 */
function getPartStatsHtml(p) {
  // このパーツを含む試合記録を抽出
  var records = getPartRecords(p.name);
  if (!records.length) {
    return '<div class="no-record">対戦記録無し</div>';
  }

  var wins = records.filter(function (r) {
    return r.result === "win";
  }).length;
  var total = records.length;
  var rate = Math.round((wins / total) * 100);

  var html = "";
  // 勝敗サマリー
  html += '<div class="part-stats-title">📊 このパーツの戦績</div>';
  html +=
    '<div class="part-win-rate-row">' +
    '<div class="part-win-rate-num">' +
    rate +
    "%</div>" +
    '<div class="part-win-rate-detail">' +
    wins +
    "勝 " +
    (total - wins) +
    "敗<br>" +
    total +
    "試合" +
    "</div>" +
    "</div>";

  // ベストコンボパーツ（カテゴリ別）
  html += getBestComboHtml(p, records);

  //バースト回数の表示
  var burstCount = getBurstLossCount(p.name, records);
  if (burstCount > 0) {
    html +=
      '<div class="part-stats-title">💥 バースト負け回数<span style="font-size:22px;font-weight:700;color:var(--danger);">' +
      burstCount +
      "</span>" +
      '<span style="font-size:12px;color:var(--text2);"> 回</span>' +
      "</div>";
  }

  return html;
}

/* 指定されたパーツ名を使用した試合記録を取得 */
function getPartRecords(partName) {
  // battleRecordsからこのパーツを使用した試合を抽出
  return battleRecords.filter(function (r) {
    var myDecks = r.myDecks || [];
    return myDecks.some(function (d) {
      if (!d.parts) return false;
      var dp = d.parts;
      var allNames = [
        dp.blade,
        dp.lock,
        dp.main,
        dp.assist,
        dp.lock4,
        dp.metal,
        dp.over,
        dp.assist4,
        dp.ratchet,
        dp.bit,
        dp.combo,
      ].filter(Boolean);
      return allNames.indexOf(partName) >= 0;
    });
  });
}

/* ベストコンボパーツのHTMLを生成 */
function getBestComboHtml(p, records) {
  // このパーツと一緒に使われた他カテゴリのパーツごとに勝率集計
  // ブレード系なら「ラチェット」「ビット/一体型」でランキング
  // ラチェットなら「ブレード」「ビット」でランキング
  // ビットなら「ブレード」「ラチェット」でランキング

  var cat = p.cat;
  var partName = p.name;
  var targetCats = [];
  if (cat === "blade") targetCats = ["ratchet", "bit"];
  else if (cat === "ratchet") targetCats = ["blade", "bit"];
  else if (cat === "bit" || cat === "combo") targetCats = ["blade", "ratchet"];

  if (!targetCats.length) return "";

  var html = '<div class="best-combo-section">';
  html +=
    '<div class="part-stats-title" style="margin-top:10px;">⭐ ベストコンボパーツ</div>';

  targetCats.forEach(function (tCat) {
    // このパーツと一緒に使われた tCat のパーツごとに勝率集計
    var comboMap = {};
    records.forEach(function (r) {
      var myDecks = r.myDecks || [];
      myDecks.forEach(function (d) {
        if (!d.parts) return;
        var dp = d.parts;
        var allNames = [
          dp.blade,
          dp.lock,
          dp.main,
          dp.assist,
          dp.lock4,
          dp.metal,
          dp.over,
          dp.assist4,
          dp.ratchet,
          dp.bit,
          dp.combo,
        ].filter(Boolean);
        if (allNames.indexOf(partName) < 0) return;
        // tCatのパーツを探す
        var comboNames = [];
        if (tCat === "blade")
          comboNames = [
            dp.blade,
            dp.lock,
            dp.main,
            dp.assist,
            dp.lock4,
            dp.metal,
            dp.over,
            dp.assist4,
          ].filter(Boolean);
        else if (tCat === "ratchet") comboNames = [dp.ratchet].filter(Boolean);
        else if (tCat === "bit")
          comboNames = [dp.bit, dp.combo].filter(Boolean);
        comboNames.forEach(function (cn) {
          if (!comboMap[cn]) comboMap[cn] = { wins: 0, total: 0 };
          comboMap[cn].total++;
          if (r.result === "win") comboMap[cn].wins++;
        });
      });
    });

    // 勝率順にソート（2試合以上のみ）
    var ranked = Object.keys(comboMap)
      .filter(function (k) {
        return comboMap[k].total >= 1;
      })
      .map(function (k) {
        return {
          name: k,
          wins: comboMap[k].wins,
          total: comboMap[k].total,
          rate: Math.round((comboMap[k].wins / comboMap[k].total) * 100),
        };
      })
      .sort(function (a, b) {
        return b.rate - a.rate || b.total - a.total;
      })
      .slice(0, 3);

    var catLabel =
      { blade: "ブレード", ratchet: "ラチェット", bit: "ビット/一体型" }[
        tCat
      ] || tCat;
    html += '<div class="best-combo-title">' + catLabel + "</div>";
    if (!ranked.length) {
      html +=
        '<div style="font-size:10px;color:var(--text3);padding:4px 0 6px;">データ不足(ビット一体型使用の場合ビットでカウントされてます)</div>';
    } else {
      html += '<div class="best-combo-list">';
      ranked.forEach(function (item, i) {
        var medal = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
        html +=
          '<div class="best-combo-item">' +
          '<span class="best-combo-rank">' +
          medal +
          "</span>" +
          '<span class="best-combo-name">' +
          item.name +
          "：勝率" +
          "</span>" +
          '<span class="best-combo-rate">' +
          item.rate +
          "% (" +
          item.wins +
          "勝/" +
          item.total +
          "戦中)</span>" +
          "</div>";
      });
      html += "</div>";
    }
  });

  html += "</div>";
  return html;
}

/* パーツ削除確認 */
var delPartTargetId = null;
function askDelPart(id) {
  var p = parts.find(function (x) {
    return x.id === id;
  });
  if (!p) return;
  delPartTargetId = id;
  document.getElementById("del-part-msg").textContent =
    "「" + p.name + "」を削除しますか？";
  document.getElementById("modal-del-part").classList.remove("hidden");
}

/* パーツ削除実行 */
function confirmDelPart() {
  parts = parts.filter(function (x) {
    return x.id !== delPartTargetId;
  });
  closeModal("modal-del-part");
  saveParts();
  renderParts();
}

/* パーツのバッジHTMLを生成 */
function getBadges(p) {
  var b = '<span class="badge ' + p.cat + '">' + CATLBL[p.cat] + "</span>";
  if (p.cat === "blade") {
    b += '<span class="badge ' + p.line + '">' + LINE[p.line] + "</span>";
    if (p.line === "cx" && p.cxType) {
      var cls =
        {
          lock: "lock",
          main: "main-b",
          assist: "assist",
          metal: "metal",
          over: "over",
        }[p.cxType] || "lock";
      b += '<span class="badge ' + cls + '">' + CXLBL[p.cxType] + "</span>";
    }
    if (p.otype) b += '<span class="badge otype-only">O型専用</span>';
  }
  if (p.cat === "ratchet" && p.rtype)
    b +=
      '<span class="badge ' +
      (p.rtype === "otype" ? "otype-r" : "normal-r") +
      '">' +
      RTLBL[p.rtype] +
      "</span>";
  if (p.cat === "combo" && p.combotype)
    b += '<span class="badge otype-r">' + p.combotype + "</span>";
  return b;
}

/* メインタブ設定 */
function setMainTab(t) {
  mainTab = t;
  if (t !== "blade") bladeSubTab = "all";
  renderParts();
}

/* ブレード系サブタブ設定 */
function setBladeSubTab(t) {
  bladeSubTab = t;
  if (t !== "cx") cxSubTab = "lock";
  renderParts();
}

/* CX系サブタブ設定 */
function setCxSubTab(t) {
  cxSubTab = t;
  renderParts();
}

/* 所持数変更 */
function chgQty(id, d) {
  var p = parts.find(function (x) {
    return x.id === id;
  });
  if (!p) return;
  p.qty = Math.max(0, p.qty + d);
  document.getElementById("qty-" + id).textContent = p.qty;
  renderStats();
  saveParts();
}
var editPartId = null;
var editThumbData = null;

/* パーツ編集モーダルを開く */
function openEditPart(id) {
  var p = parts.find(function (x) {
    return x.id === id;
  });
  if (!p) return;
  editPartId = id;
  editThumbData = p.img || null;

  document.getElementById("edit-part-name").textContent = p.name;
  document.getElementById("edit-part-badges").innerHTML = getBadges(p);
  document.getElementById("edit-memo-inp").value = p.memo || "";
  document.getElementById("edit-memo-count").textContent =
    (p.memo || "").length + " / 500";

  var prev = document.getElementById("edit-thumb-preview");
  if (p.img) {
    prev.innerHTML =
      '<img src="' +
      p.img +
      '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">';
    document.getElementById("edit-del-img-btn").style.display = "inline-flex";
  } else {
    prev.innerHTML =
      '<i class="ti ti-camera" style="font-size:22px;"></i><span>画像</span>';
    document.getElementById("edit-del-img-btn").style.display = "none";
  }

  var memoInp = document.getElementById("edit-memo-inp");
  memoInp.oninput = function () {
    document.getElementById("edit-memo-count").textContent =
      memoInp.value.length + " / 500";
  };

  document.getElementById("modal-edit-part").classList.remove("hidden");
}

/* パーツ編集モーダルのサムネイル変更 */
function handleEditThumb(e) {
  var f = e.target.files[0];
  if (!f) return;
  var r = new FileReader();
  r.onload = function (ev) {
    editThumbData = ev.target.result;
    var prev = document.getElementById("edit-thumb-preview");
    prev.innerHTML =
      '<img src="' +
      editThumbData +
      '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">';
    document.getElementById("edit-del-img-btn").style.display = "inline-flex";
  };
  r.readAsDataURL(f);
  e.target.value = "";
}

/* パーツ編集モーダルのサムネイル削除 */
function deleteEditThumb() {
  editThumbData = null;
  var prev = document.getElementById("edit-thumb-preview");
  prev.innerHTML =
    '<i class="ti ti-camera" style="font-size:22px;"></i><span>画像</span>';
  document.getElementById("edit-del-img-btn").style.display = "none";
}

/* パーツ編集モーダルの保存 */
function saveEditPart() {
  var p = parts.find(function (x) {
    return x.id === editPartId;
  });
  if (!p) return;
  p.img = editThumbData;
  p.memo = document.getElementById("edit-memo-inp").value.trim();
  saveParts();
  showToast("保存完了！", "ok");
  closeModal("modal-edit-part");
  renderParts();
}

/* パーツ削除 */
function delPart(id) {
  parts = parts.filter(function (x) {
    return x.id !== id;
  });
  saveParts();
  renderParts();
}

/* ブレード（BX/UX）追加フォームの行HTMLを生成 */
function mkBxuxRow(i) {
  return (
    '<div class="add-row" id="bxux-row-' +
    i +
    '">' +
    '<div class="thumb-sm" id="bxux-t-' +
    i +
    "\" onclick=\"trigThumb('bxux'," +
    i +
    ')"><i class="ti ti-camera" style="font-size:16px;"></i><span>画像</span></div>' +
    '<div style="flex:1;display:flex;flex-direction:column;gap:6px;">' +
    '<input class="form-input" placeholder="パーツ名" data-field="name" oninput="checkAddBtn()">' +
    '<div style="display:flex;gap:6px;">' +
    '<select class="form-input" data-field="line" style="flex:1;"><option value="bx">BX</option><option value="ux">UX</option></select>' +
    '<select class="form-input" data-field="otype" style="flex:1;"><option value="0">通常対応</option><option value="1">O型専用</option></select>' +
    "</div>" +
    '<div style="display:flex;gap:6px;">' +
    '<input class="form-input" type="number" min="0" value="1" data-field="qty" style="width:80px;" placeholder="所持数">' +
    '<input class="form-input" placeholder="メモ" data-field="memo" style="flex:1;">' +
    "</div>" +
    "</div>" +
    (i > 0
      ? '<button class="del-btn" onclick="removeRow(\'bxux-row-' +
        i +
        '\')" style="position:static;margin-top:4px;"><i class="ti ti-x"></i></button>'
      : "") +
    "</div>"
  );
}

/* ラチェット追加フォームの行HTMLを生成 */
function mkRatchetRow(i) {
  return (
    '<div class="add-row" id="ratchet-row-' +
    i +
    '">' +
    '<div class="thumb-sm" id="ratchet-t-' +
    i +
    "\" onclick=\"trigThumb('ratchet'," +
    i +
    ')"><i class="ti ti-camera" style="font-size:16px;"></i><span>画像</span></div>' +
    '<div style="flex:1;display:flex;flex-direction:column;gap:6px;">' +
    '<input class="form-input" placeholder="パーツ名（例：3-60）" data-field="name" oninput="checkAddBtn()">' +
    '<div style="display:flex;gap:6px;">' +
    '<select class="form-input" data-field="rtype" style="flex:1;"><option value="normal">通常ラチェット</option><option value="otype">O型ラチェット</option></select>' +
    '<input class="form-input" type="number" min="0" value="1" data-field="qty" style="width:80px;" placeholder="所持数">' +
    "</div>" +
    '<input class="form-input" placeholder="メモ" data-field="memo">' +
    "</div>" +
    (i > 0
      ? '<button class="del-btn" onclick="removeRow(\'ratchet-row-' +
        i +
        '\')" style="position:static;margin-top:4px;"><i class="ti ti-x"></i></button>'
      : "") +
    "</div>"
  );
}

/* ビット/一体型追加フォームの行HTMLを生成 */
function mkBitRow(i) {
  return (
    '<div class="add-row" id="bit-row-' +
    i +
    '">' +
    '<div class="thumb-sm" id="bit-t-' +
    i +
    "\" onclick=\"trigThumb('bit'," +
    i +
    ')"><i class="ti ti-camera" style="font-size:16px;"></i><span>画像</span></div>' +
    '<div style="flex:1;display:flex;flex-direction:column;gap:6px;">' +
    '<input class="form-input" placeholder="パーツ名（例：Flat）" data-field="name" oninput="checkAddBtn()">' +
    '<div style="display:flex;gap:6px;">' +
    '<input class="form-input" type="number" min="0" value="1" data-field="qty" style="width:80px;" placeholder="所持数">' +
    '<input class="form-input" placeholder="メモ" data-field="memo" style="flex:1;">' +
    "</div>" +
    "</div>" +
    (i > 0
      ? '<button class="del-btn" onclick="removeRow(\'bit-row-' +
        i +
        '\')" style="position:static;margin-top:4px;"><i class="ti ti-x"></i></button>'
      : "") +
    "</div>"
  );
}

/* コンボパーツ追加フォームの行HTMLを生成 */
function mkComboRow(i) {
  return (
    '<div class="add-row" id="combo-row-' +
    i +
    '">' +
    '<div class="thumb-sm" id="combo-t-' +
    i +
    "\" onclick=\"trigThumb('combo'," +
    i +
    ')"><i class="ti ti-camera" style="font-size:16px;"></i><span>画像</span></div>' +
    '<div style="flex:1;display:flex;flex-direction:column;gap:6px;">' +
    '<input class="form-input" placeholder="パーツ名（例：3-60Tr）" data-field="name" oninput="checkAddBtn()">' +
    '<div style="display:flex;gap:6px;">' +
    '<select class="form-input" data-field="combotype" style="flex:1;"><option value="Tr">Tr（ターボ）</option><option value="Op">Op（オペレート）</option></select>' +
    '<input class="form-input" type="number" min="0" value="1" data-field="qty" style="width:80px;" placeholder="所持数">' +
    "</div>" +
    '<input class="form-input" placeholder="メモ" data-field="memo">' +
    "</div>" +
    (i > 0
      ? '<button class="del-btn" onclick="removeRow(\'combo-row-' +
        i +
        '\')" style="position:static;margin-top:4px;"><i class="ti ti-x"></i></button>'
      : "") +
    "</div>"
  );
}

/* パーツ追加モーダルを開く */
function openAddPart() {
  document.getElementById("modal-part").classList.remove("hidden");
}

/* パーツ追加モーダルの検索処理 */
function onAddPickerSearch(val) {
  addPickerSearchQuery = val;
  var wrap = document.getElementById("add-picker-search-wrap");
  if (wrap) wrap.classList.toggle("has-query", !!val);
  // リストだけ再生成（検索窓は再描画しない）
  updateAddPickerList();
}

/* パーツ追加モーダルのリスト更新 */
function updateAddPickerList() {
  var listHtml = "";
  if (addPickerCat === "blade") {
    if (addPickerBladeLine === "bx" || addPickerBladeLine === "ux") {
      var items = getAddPickerItems("blade", addPickerBladeLine, null);
      listHtml =
        '<div class="picker-section">' +
        '<div class="picker-section-label">' +
        LINE[addPickerBladeLine] +
        " ブレード一覧（複数選択可）</div>" +
        '<div class="radio-list">' +
        makeAddCheckList(items, "blade") +
        "</div>" +
        "</div>";
      listHtml +=
        '<div style="display:flex;align-items:center;gap:8px;margin-top:10px;padding:10px;background:var(--bg3);border-radius:8px;">' +
        '<input type="checkbox" id="add-otype-check" style="width:16px;height:16px;">' +
        '<label for="add-otype-check" style="font-size:12px;color:var(--text2);">O型専用ブレード</label>' +
        "</div>";
    } else if (addPickerBladeLine === "cx") {
      var cxFields =
        addPickerCxPat === 3
          ? ["lock", "main", "assist"]
          : ["lock", "metal", "over", "assist"];
      listHtml = cxFields
        .map(function (f) {
          var items = getAddPickerItems("blade", "cx", f);
          return (
            '<div class="picker-section">' +
            '<div class="picker-section-label">' +
            CXLBL[f] +
            "（複数選択可・単体登録可）</div>" +
            '<div class="radio-list">' +
            makeAddCheckList(items, f) +
            "</div>" +
            "</div>"
          );
        })
        .join("");
    }
  } else if (addPickerCat === "ratchet") {
    var items = getAddPickerItems("ratchet", null, null);
    listHtml =
      '<div class="picker-section">' +
      '<div class="picker-section-label">通常ラチェット（複数選択可）</div>' +
      '<div class="radio-list">' +
      makeAddCheckList(
        items.filter(function (p) {
          return p.rtype === "normal" || !p.rtype;
        }),
        "ratchet_n"
      ) +
      "</div>" +
      "</div>" +
      '<div class="picker-section" style="margin-top:8px;">' +
      '<div class="picker-section-label">O型ラチェット（複数選択可）</div>' +
      '<div class="radio-list">' +
      makeAddCheckList(
        items.filter(function (p) {
          return p.rtype === "otype";
        }),
        "ratchet_o"
      ) +
      "</div>" +
      "</div>";
  } else if (addPickerCat === "bit") {
    var items = getAddPickerItems("bit", null, null);
    listHtml =
      '<div class="radio-list">' + makeAddCheckList(items, "bit") + "</div>";
  } else if (addPickerCat === "combo") {
    var items = getAddPickerItems("combo", null, null);
    listHtml =
      '<div class="radio-list">' + makeAddCheckList(items, "combo") + "</div>";
  }
  var container = document.getElementById("add-picker-list-container");
  if (container) container.innerHTML = listHtml;
  updateAddPickerDoneBtn();
}

/* パーツ追加モーダルの検索窓クリア */
function clearAddPickerSearch() {
  addPickerSearchQuery = "";
  var inp = document.getElementById("add-picker-search-inp");
  if (inp) inp.value = "";
  var wrap = document.getElementById("add-picker-search-wrap");
  if (wrap) wrap.classList.remove("has-query");
  renderAddPickerMain();
}

/* パーツ追加ピッカーを開く（カテゴリ指定） */
function openAddPicker(cat) {
  addPickerCat = cat;
  addPickerBladeLine = "bx";
  addPickerCxPat = 3;
  addPickerTemp = {};
  addPickerSearchQuery = "";

  document.getElementById("add-picker-title").textContent =
    cat === "blade"
      ? "ブレードを追加"
      : cat === "ratchet"
      ? "ラチェットを追加"
      : cat === "bit"
      ? "ビットを追加"
      : "一体型ビットを追加";

  var bladeLineArea = document.getElementById("add-picker-blade-line");
  bladeLineArea.style.display = cat === "blade" ? "block" : "none";
  document.getElementById("add-picker-cx-pattern").style.display = "none";
  document.getElementById("add-picker-detail").style.display = "none";
  document.getElementById("add-picker-qty").value = 1;
  document.getElementById("add-picker-memo").value = "";

  if (cat === "blade") {
    setAddPickerBladeLine("bx");
  } else {
    renderAddPickerMain();
  }
  document.getElementById("modal-add-picker").classList.remove("hidden");
}

/* ブレード追加フォームのライン切替 */
function setAddPickerBladeLine(l) {
  addPickerBladeLine = l;
  addPickerTemp = {};
  ["bx", "ux", "cx"].forEach(function (x) {
    var el = document.getElementById("apbl-" + x);
    if (el) el.classList.toggle("active", x === l);
  });
  document.getElementById("add-picker-cx-pattern").style.display =
    l === "cx" ? "block" : "none";
  document.getElementById("apcxp-3").classList.add("active");
  document.getElementById("apcxp-4").classList.remove("active");
  addPickerCxPat = 3;
  renderAddPickerMain();
}

/* ブレード追加フォームのCXパターン切替 */
function setAddPickerCxPat(n) {
  addPickerCxPat = n;
  addPickerTemp = {};
  document.getElementById("apcxp-3").classList.toggle("active", n === 3);
  document.getElementById("apcxp-4").classList.toggle("active", n === 4);
  renderAddPickerMain();
}

/* パーツ追加ピッカーのメインエリアを描画 */
function renderAddPickerMain() {
  var area = document.getElementById("add-picker-main-area");
  var searchHtml =
    '<div class="search-wrap" id="add-picker-search-wrap" style="padding:0 0 10px;">' +
    '<i class="ti ti-search search-icon" style="left:12px;"></i>' +
    '<input class="search-input" id="add-picker-search-inp" placeholder="パーツ名で検索..." ' +
    'value="' +
    addPickerSearchQuery +
    '" oninput="onAddPickerSearch(this.value)" autocomplete="off" list="add-picker-datalist">' +
    '<datalist id="add-picker-datalist"></datalist>' +
    '<i class="ti ti-x search-clear" onclick="clearAddPickerSearch()" style="right:12px;"></i>' +
    "</div>";
  var listHtml = "";

  if (addPickerCat === "blade") {
    if (addPickerBladeLine === "bx" || addPickerBladeLine === "ux") {
      var items = getAddPickerItems("blade", addPickerBladeLine, null);
      listHtml =
        '<div class="picker-section">' +
        '<div class="picker-section-label">' +
        LINE[addPickerBladeLine] +
        " ブレード一覧（複数選択可）</div>" +
        '<div class="radio-list">' +
        makeAddCheckList(items, "blade") +
        "</div>" +
        "</div>";
      listHtml +=
        '<div style="display:flex;align-items:center;gap:8px;margin-top:10px;padding:10px;background:var(--bg3);border-radius:8px;">' +
        '<input type="checkbox" id="add-otype-check" style="width:16px;height:16px;">' +
        '<label for="add-otype-check" style="font-size:12px;color:var(--text2);">O型専用ブレード</label>' +
        "</div>";
    } else if (addPickerBladeLine === "cx") {
      var cxFields =
        addPickerCxPat === 3
          ? ["lock", "main", "assist"]
          : ["lock", "metal", "over", "assist"];
      listHtml = cxFields
        .map(function (f) {
          var items = getAddPickerItems("blade", "cx", f);
          return (
            '<div class="picker-section">' +
            '<div class="picker-section-label">' +
            CXLBL[f] +
            "（複数選択可・単体登録可）</div>" +
            '<div class="radio-list">' +
            makeAddCheckList(items, f) +
            "</div>" +
            "</div>"
          );
        })
        .join("");
    }
  } else if (addPickerCat === "ratchet") {
    var items = getAddPickerItems("ratchet", null, null);
    listHtml =
      '<div class="picker-section">' +
      '<div class="picker-section-label">通常ラチェット（複数選択可）</div>' +
      '<div class="radio-list">' +
      makeAddCheckList(
        items.filter(function (p) {
          return p.rtype === "normal" || !p.rtype;
        }),
        "ratchet_n"
      ) +
      "</div>" +
      "</div>" +
      '<div class="picker-section" style="margin-top:8px;">' +
      '<div class="picker-section-label">O型ラチェット（複数選択可）</div>' +
      '<div class="radio-list">' +
      makeAddCheckList(
        items.filter(function (p) {
          return p.rtype === "otype";
        }),
        "ratchet_o"
      ) +
      "</div>" +
      "</div>";
  } else if (addPickerCat === "bit") {
    var items = getAddPickerItems("bit", null, null);
    listHtml =
      '<div class="radio-list">' + makeAddCheckList(items, "bit") + "</div>";
  } else if (addPickerCat === "combo") {
    var items = getAddPickerItems("combo", null, null);
    listHtml =
      '<div class="radio-list">' + makeAddCheckList(items, "combo") + "</div>";
  }

  // 初回描画か確認（検索窓が既にあればリストだけ更新）
  var existingSearch = document.getElementById("add-picker-search-wrap");
  if (existingSearch) {
    // 検索窓は維持、リストコンテナだけ更新
    var listContainer = document.getElementById("add-picker-list-container");
    if (listContainer) listContainer.innerHTML = listHtml;
    else
      area.innerHTML =
        searchHtml +
        '<div id="add-picker-list-container">' +
        listHtml +
        "</div>";
  } else {
    area.innerHTML =
      searchHtml + '<div id="add-picker-list-container">' + listHtml + "</div>";
  }
  updateAddPickerDoneBtn();
}

/* パーツ追加ピッカーの検索結果を取得 */
function getAddPickerItems(cat, line, cxType) {
  var regNames = {};
  parts
    .filter(function (p) {
      return p.cat === cat;
    })
    .forEach(function (p) {
      regNames[p.name] = true;
    });
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

/* パーツ追加ピッカーのチェックリストHTMLを生成 */
function makeAddCheckList(items, selKey) {
  if (!items.length)
    return '<div style="font-size:11px;color:var(--text3);padding:8px;">パーツなし</div>';
  var html = '<div class="part-grid">';
  items.forEach(function (p) {
    var name = p.name;
    var sel = !!(addPickerTemp[selKey] && addPickerTemp[selKey][name]);
    var already = p._already;
    var safeName = name.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    var thumb = p.img
      ? '<img src="' + p.img + '">'
      : '<span style="font-size:24px;">' + (EMOJI[p.cat] || "❓") + "</span>";
    html +=
      '<div class="grid-item ' +
      (sel ? "selected " : "") +
      (already ? "registered" : "") +
      '" ' +
      'data-akey="' +
      selKey +
      '" data-aname="' +
      safeName +
      '" ' +
      (already ? "" : 'onclick="handleAddCheck(this)"') +
      ">" +
      (already ? '<div class="grid-owned-badge">登録済</div>' : "") +
      '<div class="grid-thumb">' +
      thumb +
      "</div>" +
      '<div class="grid-name">' +
      name +
      "</div>" +
      '<div class="grid-check"><i class="ti ti-check"></i></div>' +
      "</div>";
  });
  html += "</div>";
  return html;
}

/* パーツ追加ピッカーのチェックリストのチェック処理 */
function handleAddCheck(el) {
  var key = el.getAttribute("data-akey");
  var name = el
    .getAttribute("data-aname")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');
  if (!addPickerTemp[key]) addPickerTemp[key] = {};
  if (addPickerTemp[key][name]) {
    delete addPickerTemp[key][name];
  } else {
    addPickerTemp[key][name] = true;
  }
  el.classList.toggle("selected", !!addPickerTemp[key][name]);
  updateAddPickerDoneBtn();
  updateAddPickerDetail();
}

/* パーツ追加ピッカーの「登録」ボタンの有効/無効を更新 */
function updateAddPickerDoneBtn() {
  var btn = document.getElementById("add-picker-done-btn");
  var hasAny = false;
  Object.keys(addPickerTemp).forEach(function (k) {
    if (Object.keys(addPickerTemp[k]).length > 0) hasAny = true;
  });
  if (btn) btn.disabled = !hasAny;
  updateAddPickerDetail();
}

/* パーツ追加ピッカーの選択済みパーツ表示を更新 */
function updateAddPickerDetail() {
  var detail = document.getElementById("add-picker-detail");
  var namesEl = document.getElementById("add-picker-selected-names");
  var allNames = [];
  Object.keys(addPickerTemp).forEach(function (k) {
    Object.keys(addPickerTemp[k]).forEach(function (n) {
      allNames.push(n);
    });
  });
  if (allNames.length > 0) {
    detail.style.display = "block";
    namesEl.textContent = allNames.join("、");
  } else {
    detail.style.display = "none";
  }
}

/* パーツ追加ピッカーの登録処理 */
function addPickerDone() {
  var qty = parseInt(document.getElementById("add-picker-qty").value) || 1;
  var memo = document.getElementById("add-picker-memo").value.trim();
  var added = [];

  if (addPickerCat === "blade") {
    var otype = false;
    var otypeEl = document.getElementById("add-otype-check");
    if (otypeEl) otype = otypeEl.checked;

    if (addPickerBladeLine === "bx" || addPickerBladeLine === "ux") {
      var names = Object.keys(addPickerTemp["blade"] || {});
      names.forEach(function (name) {
        added.push({
          id: nextId++,
          name: name,
          cat: "blade",
          line: addPickerBladeLine,
          cxType: null,
          otype: otype,
          qty: qty,
          memo: memo,
          img: null,
        });
      });
    } else {
      // CX系はパターンによって登録するフィールドが変わる
      var cxFields =
        addPickerCxPat === 3
          ? ["lock", "main", "assist"]
          : ["lock", "metal", "over", "assist"];
      cxFields.forEach(function (f) {
        var names = Object.keys(addPickerTemp[f] || {});
        names.forEach(function (name) {
          added.push({
            id: nextId++,
            name: name,
            cat: "blade",
            line: "cx",
            cxType: f,
            otype: false,
            qty: qty,
            memo: memo,
            img: null,
          });
        });
      });
    }
  } else if (addPickerCat === "ratchet") {
    var nNames = Object.keys(addPickerTemp["ratchet_n"] || {});
    var oNames = Object.keys(addPickerTemp["ratchet_o"] || {});
    nNames.forEach(function (name) {
      added.push({
        id: nextId++,
        name: name,
        cat: "ratchet",
        rtype: "normal",
        qty: qty,
        memo: memo,
        img: null,
      });
    });
    oNames.forEach(function (name) {
      added.push({
        id: nextId++,
        name: name,
        cat: "ratchet",
        rtype: "otype",
        qty: qty,
        memo: memo,
        img: null,
      });
    });
  } else if (addPickerCat === "bit") {
    var names = Object.keys(addPickerTemp["bit"] || {});
    names.forEach(function (name) {
      added.push({
        id: nextId++,
        name: name,
        cat: "bit",
        qty: qty,
        memo: memo,
        img: null,
      });
    });
  } else if (addPickerCat === "combo") {
    var names = Object.keys(addPickerTemp["combo"] || {});
    names.forEach(function (name) {
      var dbItem = ALL_DB.find(function (p) {
        return p.name === name;
      });
      var combotype = dbItem && dbItem.combotype ? dbItem.combotype : "Tr";
      added.push({
        id: nextId++,
        name: name,
        cat: "combo",
        combotype: combotype,
        qty: qty,
        memo: memo,
        img: null,
      });
    });
  }

  if (!added.length) {
    showToast("パーツを選択してください");
    return;
  }
  parts.push.apply(parts, added);
  saveParts();
  closeModal("modal-add-picker");
  showToast(added.length + "件登録しました", "ok");
  renderParts();
}
