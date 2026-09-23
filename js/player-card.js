/**
 * player-card.js
 * プレイヤーカード機能関連の変数・関数
 */

/*プレイヤーカードホーム画面描画*/
function renderPlayerCardHome() {
  document.getElementById("battle-screen-title").textContent =
    "プレーヤーカード";
  var html = '<div style="padding:0 0 80px;">';

  //戻るボタン
  html +=
    '<div style="padding:12px 16px 4px;">' +
    '<button class="btn-sm" onclick="renderBattleHome()" ' +
    'style="padding:6px 12px;">' +
    '<i class="ti ti-arrow-left"></i> 戻る</button>' +
    "</div>";

  html +=
    '<div style="padding:12px 16px 4px;font-size:11px;color:var(--text2);">カードを選択</div>';

  //自分のカードボタン
  html +=
    '<div class="battle-mode-card" onclick="renderMyPlayerCard()">' +
    '<div class="battle-mode-icon" style="background:rgba(124,111,255,0.15);">🌌</div>' +
    '<div class="battle-mode-info"><h3>マイカード</h3>' +
    "<p>自分のプレイヤーカード、自分のQRコードを確認できます</p></div>" +
    '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>' +
    "</div>";
  //ライバルカード一覧ボタン
  html +=
    '<div class="battle-mode-card" onclick="renderRivalList()">' +
    '<div class="battle-mode-icon" style="background:rgba(124,111,255,0.15);">👥</div>' +
    '<div class="battle-mode-info"><h3>ライバルカード</h3>' +
    "<p>ライバルのプレイヤーカードを確認できます</p></div>" +
    '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>' +
    "</div>";
  //QRコードを読み取る（カメラ起動）ボタン
  html +=
    '<div class="battle-mode-card" onclick="renderQRReader()">' +
    '<div class="battle-mode-icon" style="background:rgba(124,111,255,0.15);">📸</div>' +
    '<div class="battle-mode-info"><h3>QRコード読み取り</h3>' +
    "<p>ライバルのプレイヤーカードのQRコードを読み取ります</p></div>" +
    '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>' +
    "</div>";
  html += "</div>";
  document.getElementById("battle-content").innerHTML = html;
}

/*マイプレイヤーカード画面描画*/
function renderMyPlayerCard() {
  var wins = battleRecords.filter(function (r) {
    return r.result === "win";
  }).length;
  var total = battleRecords.length;
  var battleDecks = decks.filter(function (d) {
    return d.battle;
  });
  var rate = total > 0 ? Math.round((wins / total) * 100) : 0;

  //QRコードに含むデータ
  var qrData = JSON.stringify({
    v: 1,
    n: myPlayerName,
    w: wins,
    t: total,
    d: battleDecks.map(function (d) {
      var bladeStr = "";
      if (d.bladeLine === "cx") {
        // 3ピースのフィールドに値があれば3ピース、なければ4ピース
        var is3piece = !!(d.lock || d.main || d.assist);
        if (is3piece) {
          bladeStr = [d.lock, d.main, d.assist].filter(Boolean).join("+");
        } else {
          bladeStr = [d.lock4, d.metal, d.over, d.assist4]
            .filter(Boolean)
            .join("+");
        }
      } else {
        bladeStr = d.blade || "";
      }
      return {
        b: bladeStr,
        r: d.ratchet || "",
        bt: d.bit || "",
        c: d.combo || "",
      };
    }),
  });
  console.log("内容:", qrData);
  console.log("文字数:", qrData.length);
  console.log("バイト数:", encodeURIComponent(qrData).length);

  var html = '<div style="padding:0 0 80px;">';

  //戻るボタン
  html +=
    '<div style="padding:12px 16px 4px;">' +
    '<button class="btn-sm" onclick="renderPlayerCardHome()" ' +
    'style="padding:6px 12px;">' +
    '<i class="ti ti-arrow-left"></i> 戻る</button>' +
    "</div>";

  //プレイヤーカード表示
  html += '<div class="player-card">';
  html +=
    '<div class="player-card-name" style="display:flex;align-items:center;gap:8px;">' +
    '<span id="player-name-display" style="font-size:20px;font-weight:700;color:var(--text);">' +
    myPlayerName +
    "</span>" +
    '<button class="btn-sm" onclick="togglePlayerNameEdit()" style="font-size:10px;padding:3px 8px;">✏️</button>' +
    "</div>" +
    '<div id="player-name-edit" style="display:none;margin-top:8px;">' +
    '<input id="player-name-inp-card" class="battle-name-input" value="' +
    myPlayerName +
    '" style="width:100%;">' +
    '<div style="display:flex;gap:6px;margin-top:6px;">' +
    '<button class="btn-save" onclick="savePlayerNameFromCard()" style="flex:1;padding:8px;border:none;border-radius:8px;font-size:12px;cursor:pointer;">保存</button>' +
    '<button class="btn-sm" onclick="togglePlayerNameEdit()" style="flex:1;padding:8px;text-align:center;">キャンセル</button>' +
    "</div>" +
    "</div>" +
    '<div class ="player-card-stats">' +
    "勝率 " +
    rate +
    "%(" +
    wins +
    "勝 / " +
    total +
    "試合)" +
    "</div>";

  //試合用デッキ一覧
  if (battleDecks.length) {
    battleDecks.forEach(function (d) {
      html +=
        '<div class ="player-card-deck">' +
        '<div class ="player-card-deck-name">' +
        d.name +
        "</div>" +
        "<div>" +
        getAllNames(d).join(" / ") +
        "</div>" +
        "</div>";
    });
  } else {
    html +=
      '<div style="font-size:12px;color:var(--text3);">試合用デッキ未登録</div>';
  }

  html += "</div>";

  // HTMLにQRコード表示用のdiv
  html +=
    '<div id="qr-code-area" style="display:flex;justify-content:center;padding:16px;"></div>';

  html += "</div>";
  document.getElementById("battle-content").innerHTML = html;

  // QRコード生成（HTML描画後に実行）
  setTimeout(function () {
    var qrArea = document.getElementById("qr-code-area");
    if (!qrArea) return;
    var canvas = document.createElement("canvas");
    qrArea.appendChild(canvas);
    QRCode.toCanvas(
      canvas,
      qrData,
      {
        width: 300,
        errorCorrectionLevel: "L",
      },
      function (error) {
        if (error) console.log("QRエラー:", error);
      }
    );
  }, 300);
}

/*プレイヤーネーム編集トグル*/
function togglePlayerNameEdit() {
  var display = document.getElementById("player-name-display");
  var editArea = document.getElementById("player-name-edit");
  if (!display || !editArea) return;
  var isEditing = editArea.style.display !== "none";
  editArea.style.display = isEditing ? "none" : "block";
}

/*カード側から名前保存*/
function savePlayerNameFromCard() {
  var inp = document.getElementById("player-name-inp-card");
  if (!inp) return;
  var newName = inp.value.trim();
  if (!newName) {
    showToast("名前を入力してください");
    return;
  }
  savePlayerName(newName);
  var display = document.getElementById("player-name-display");
  if (display) display.textContent = newName;
  togglePlayerNameEdit();
}

/*ライバル一覧画面描画*/
function renderRivalList() {
  var html = '<div style="padding:0 0 80px;">';

  //戻るボタン
  html +=
    '<div style="padding:12px 16px 4px;">' +
    '<button class="btn-sm" onclick="renderPlayerCardHome()" ' +
    'style="padding:6px 12px;">' +
    '<i class="ti ti-arrow-left"></i> 戻る</button>' +
    "</div>";

  if (rivals.length === 0) {
    html +=
      '<div style="padding:16px;text-align:center;color:var(--text3);">ライバルが登録されていません</div>';
  } else {
    rivals.forEach(function (rival) {
      html +=
        '<div class="battle-mode-card" onclick="renderRivalDetail(' +
        rival.id +
        ')">' +
        '<div class="battle-mode-icon" style="background:rgba(124,111,255,0.15);">👤</div>' +
        '<div class="battle-mode-info"><h3>' +
        rival.playerName +
        "</h3>" +
        "<p>勝率 " +
        (rival.total > 0 ? Math.round((rival.wins / rival.total) * 100) : 0) +
        "% (" +
        rival.wins +
        "勝 / " +
        rival.total +
        "試合)</p></div>" +
        '<i class="ti ti-chevron-right" style="color:var(--text3);margin-left:auto;"></i>' +
        "</div>";
    });
  }
  html += "</div>";
  document.getElementById("battle-content").innerHTML = html;
}

/*ライバルカード詳細表示*/
function renderRivalDetail(rivalId) {
  var rival = rivals.find(function (r) {
    return r.id === rivalId;
  });
  if (!rival) return;

  var html = '<div style="padding:0 0 80px;">';

  //戻るボタン
  html +=
    '<div style="padding:12px 16px 4px;">' +
    '<button class="btn-sm" onclick="renderRivalList()" ' +
    'style="padding:6px 12px;">' +
    '<i class="ti ti-arrow-left"></i> 戻る</button>' +
    "</div>";

  html +=
    '<div class = "player-card">' +
    '<div class = "player-card-name" style="display:flex;align-items:center;gap:8px;">' +
    '<span id="player-name-display" style="font-size:20px;font-weight:700;color:var(--text);">' +
    rival.playerName +
    "</span>" +
    "</div>" +
    '<div class ="player-card-stats">' +
    "勝率 " +
    (rival.total > 0 ? Math.round((rival.wins / rival.total) * 100) : 0) +
    "%(" +
    rival.wins +
    "勝 / " +
    rival.total +
    "試合)" +
    "</div>";
  rival.decks.forEach(function (d) {
    var parts = [d.b, d.r, d.bt, d.c].filter(Boolean).join(" / ");
    html +=
      '<div class="player-card-deck">' +
      '<div class="player-card-deck-name">' +
      (d.name || "デッキ") +
      "</div>" +
      "<div>" +
      parts +
      "</div>" +
      "</div>";
  });
  html += "</div>";
  //削除ボタン
  html +=
    '<div style="padding:0 16px;margin-top:16px;">' +
    '<button class="btn-sm danger" onclick="deleteRival(' +
    rival.id +
    ')" ' +
    'style="width:100%;padding:11px;text-align:center;">ライバルのプレイヤーカードを削除</button>' +
    "</div>";

  html += "</div>";
  document.getElementById("battle-content").innerHTML = html;
}

/*ライバルカード削除*/
function deleteRival(rivalId) {
  rivals = rivals.filter(function (r) {
    return r.id !== rivalId;
  });
  saveRivals();
  showToast("ライバルのプレイヤーカードを削除しました");
  renderRivalList();
}

/*QRコード読み取りカメラ起動画面の描画*/
function renderQRReader() {
  document.getElementById("battle-screen-title").textContent =
    "QRコード読み取り";
  var html = '<div style="padding:0 0 80px;">';

  // 戻るボタン
  html +=
    '<div style="padding:12px 16px 4px;">' +
    '<button class="btn-sm" onclick="stopQRCamera();renderPlayerCardHome()" ' +
    'style="padding:6px 12px;">' +
    '<i class="ti ti-arrow-left"></i> 戻る</button>' +
    "</div>";

  // カメラエリア
  html +=
    '<div class="camera-area">' +
    '<video id="qr-video" playsinline autoplay muted style="width:100%;height:100%;object-fit:cover;"></video>' +
    '<div class="camera-overlay"><div class="camera-frame"></div></div>' +
    "</div>";

  // 状態テキスト
  html +=
    '<div id="qr-status" style="text-align:center;font-size:13px;color:var(--text2);padding:8px 16px;">' +
    "カメラを起動中...</div>";

  html += "</div>";
  document.getElementById("battle-content").innerHTML = html;

  // カメラ起動
  startQRCamera();
}

/*カメラ開始関数*/
function startQRCamera() {
  var video = document.getElementById("qr-video");
  var status = document.getElementById("qr-status");
  if (!video) return;

  navigator.mediaDevices
    .getUserMedia({
      video: { facingMode: "environment" }, // 背面カメラ優先
    })
    .then(function (stream) {
      qrStream = stream;
      video.srcObject = stream;
      video.play();
      if (status) status.textContent = "QRコードを映してください";
      scanQRCode();
    })
    .catch(function (err) {
      console.log("カメラエラー:", err);
      if (status)
        status.textContent = "カメラの起動に失敗しました：" + err.message;
    });
}

/*カメラ停止関数*/
function stopQRCamera() {
  if (qrAnimFrame) {
    cancelAnimationFrame(qrAnimFrame);
    qrAnimFrame = null;
  }
  if (qrStream) {
    qrStream.getTracks().forEach(function (track) {
      track.stop();
    });
    qrStream = null;
  }
}

/*QRスキャン*/
function scanQRCode() {
  var video = document.getElementById("qr-video");
  if (!video || !qrStream) return;

  // canvasを使ってvideoの映像を解析
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  if (canvas.width === 0 || canvas.height === 0) {
    // まだ映像が準備できていない場合は少し待つ
    qrAnimFrame = requestAnimationFrame(scanQRCode);
    return;
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  var code = jsQR(imageData.data, imageData.width, imageData.height);

  console.log("スキャン中... code:", code ? "QR検出！" : "なし");

  if (code) {
    // QRコード検出
    onQRDetected(code.data);
  } else {
    // 未検出：次のフレームで再試行
    qrAnimFrame = requestAnimationFrame(scanQRCode);
  }
}

/*QR検出時処理*/
function onQRDetected(data) {
  stopQRCamera();

  // JSONパース
  var parsed;
  try {
    parsed = JSON.parse(data);
  } catch (e) {
    showToast("QRコードを読み取れませんでした");
    renderPlayerCardHome();
    return;
  }

  // バージョン確認
  if (!parsed.v || parsed.v !== 1) {
    showToast("対応していないQRコードです");
    renderPlayerCardHome();
    return;
  }

  // すでに追加済みか確認
  var existing = rivals.find(function (r) {
    return r.playerName === parsed.n;
  });
  if (existing) {
    showToast("すでに追加されているライバルです");
    renderPlayerCardHome();
    return;
  }

  // プレビュー表示
  pendingRivalData = parsed;
  renderRivalPreview(parsed);
}

/*読み込んだライバルカードの追加前プレビュー*/
function renderRivalPreview(data) {
  document.getElementById("battle-screen-title").textContent = "ライバル確認";
  var html = '<div style="padding:0 0 80px;">';

  html +=
    '<div style="padding:12px 16px 8px;font-size:13px;color:var(--text2);">読み取ったプレイヤーカード</div>';

  // プレイヤーカード表示
  html +=
    '<div class="player-card">' +
    '<div class="player-card-name">' +
    data.n +
    "</div>" +
    '<div class="player-card-stats">勝率 ' +
    (data.t > 0 ? Math.round((data.w / data.t) * 100) : 0) +
    "% (" +
    data.w +
    "勝 / " +
    data.t +
    "試合)</div>";

  // デッキ一覧
  if (data.d && data.d.length) {
    data.d.forEach(function (d) {
      var parts = [d.b, d.r, d.bt, d.c].filter(Boolean).join(" / ");
      html +=
        '<div class="player-card-deck">' +
        '<div class="player-card-deck-name">' +
        (d.name || "デッキ") +
        "</div>" +
        "<div>" +
        parts +
        "</div>" +
        "</div>";
    });
  }

  html += "</div>"; // player-card閉じ

  // 追加ボタン
  html +=
    '<div style="padding:0 16px;margin-top:16px;display:flex;gap:8px;">' +
    '<button class="btn-save" onclick="addRival()" ' +
    'style="flex:1;padding:12px;border:none;border-radius:10px;font-size:13px;cursor:pointer;">追加する</button>' +
    '<button class="btn-sm" onclick="renderPlayerCardHome()" ' +
    'style="flex:1;padding:12px;text-align:center;">キャンセル</button>' +
    "</div>";

  html += "</div>";
  document.getElementById("battle-content").innerHTML = html;
}

/*ライバル追加関数*/
// addRivalはpendingRivalDataを使う
function addRival() {
  if (!pendingRivalData) return;
  rivals.push({
    id: Date.now(),
    playerName: pendingRivalData.n,
    wins: pendingRivalData.w,
    total: pendingRivalData.t,
    decks: pendingRivalData.d,
    addedAt: new Date().toISOString(),
  });
  saveRivals();
  pendingRivalData = null;
  showToast("ライバルのプレイヤーカードを追加しました", "ok");
  renderRivalList();
}