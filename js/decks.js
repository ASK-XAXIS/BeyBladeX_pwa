/**
 * decks.js
 * デッキ関連の変数・関数
 */

//==============================================================
//変数
//==============================================================

/* パーツ選択ピッカー用変数*/
var pickerMode = "all"; // 'owned' or 'all' - picker独自のモード管理
var pickerTarget = null; // 'blade','ratchet','bit','combo'
var pickerBladeLine = "bx";
var pickerCxPat = 3;

var pickerTemp = {};
var pickerSearchQuery = "";

//==============================================================
//関数
//==============================================================

/* マイデッキ一覧描画 */
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

/*　デッキパーツ表示　*/
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

/*デッキ行HTML生成*/
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

/*未所持パーツチェック*/
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

/* 登録されている試合用デッキの登録解除 */
function toggleBattle(id) {
  var d = decks.find(function (x) {
    return x.id === id;
  });
  if (d) d.battle = false;
  saveDecks();
  renderDecks();
  renderHome();
}
/*　試合用登録　*/
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

/*デッキ削除*/
function delDeck(id) {
  decks = decks.filter(function (x) {
    return x.id !== id;
  });
  saveDecks();
  renderDecks();
  renderHome();
}

/*　名前変更モーダル　*/
function openRename(id) {
  renameDeckId = id;
  var d = decks.find(function (x) {
    return x.id === id;
  });
  if (!d) return;
  document.getElementById("rename-inp").value = d.name;
  document.getElementById("modal-rename").classList.remove("hidden");
}

/*名前変更保存*/
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

/*デッキ選択モード切替*/
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

/*選択表示更新*/
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

/*デッキ警告チェック*/
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

/*自動名前生成*/
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

/*ピッカー検索*/
function onPickerSearch(val) {
  pickerSearchQuery = val;
  var wrap = document.getElementById("picker-search-wrap");
  if (wrap) wrap.classList.toggle("has-query", !!val);
  updatePickerList();
}

/*ピッカーリスト更新*/
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

/*ピッカー検索クリア*/
function clearPickerSearch() {
  pickerSearchQuery = "";
  var inp = document.getElementById("picker-search-inp");
  if (inp) inp.value = "";
  var wrap = document.getElementById("picker-search-wrap");
  if (wrap) wrap.classList.remove("has-query");
  renderPickerMain();
}

/*パーツ選択ピッカー*/
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

/*　ブレードラインチップ　*/
function renderPickerBladeLineChips() {
  ["bx", "ux", "cx"].forEach(function (l) {
    var el = document.getElementById("pbl-" + l);
    if (el) el.classList.toggle("active", pickerBladeLine === l);
  });
}

/*ブレードライン切替*/
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

/*CXパターン切替*/
function setPickerCxPat(n) {
  pickerCxPat = n;
  pickerTemp = {};
  pickerMode = deckMode;
  document.getElementById("pcxp-3").classList.toggle("active", n === 3);
  document.getElementById("pcxp-4").classList.toggle("active", n === 4);
  renderPickerMain();
}

/*ピッカーパーツ取得*/
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

/*ラジオリストHTML*/
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

/*ラジオクリック処理*/
function handleRadioClick(el) {
  var key = el.getAttribute("data-key");
  var name = el
    .getAttribute("data-name")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');
  selectRadio(key, name);
}

/*	ピッカーメイン描画　*/
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

/*ラジオ選択*/
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

/*完了ボタン更新*/
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

/*ピッカー確定*/
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

/*デッキ保存*/
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

/*デッキ名解析*/
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

/*デッキ名入力処理*/
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

/* 新規デッキ組み立てモーダル（既存のデッキビルダーを流用）*/
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

/*一時デッキ保存*/
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

/*デッキ重複チェック*/
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

/*全デッキ重複チェック*/
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
