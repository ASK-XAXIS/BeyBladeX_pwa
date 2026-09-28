# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

BX Manager — ベイブレード X のパーツ管理・デッキ構築・対戦記録・持久力計測を行う PWA。フレームワーク・ビルドツール・パッケージマネージャ・テストは一切なし（Vanilla JS / HTML / CSS）。Cloudflare Pages / Workers でホスティング（公開 URL: https://beybladex-pwa.ryo06040123-df6.workers.dev/）。

## ローカル実行

```bash
npx http-server .
```

ビルド・lint・テストのコマンドは存在しない。動作確認はブラウザで行う。

## アーキテクチャ

### スクリプト構成（グローバルスコープ共有）

ES Modules は使っておらず、`index.html` 末尾の `<script>` タグで以下の順に読み込まれ、**すべての変数・関数がグローバル**で共有される。読み込み順に依存しているため、新しいファイルを追加する場合は `index.html` の順序に注意する。

1. `js/globals.js` — グローバル状態・パーツマスタ `ALL_DB`・定数（`LINE` / `CXLBL` / `CATLBL` など）・`save*()` 保存関数・ユーティリティ（`showToast`, `closeModal`, `fmtTime*`, `dsInit` など）
2. `js/ui.js` — 画面切替 `showScreen(name)`、タブ移動時の未保存確認（`checkNavSwitch` / `checkNavReturn`）、テーマ、ホーム画面描画
3. `js/timer.js` — 計測モード（`timerState` による状態遷移: home → select → standby → running → result）
4. `js/player-card.js` — プレイヤーカード・QR 読取（`jsQR.js`）/ 生成（CDN の `qrcode`）・ライバル登録
5. `js/parts.js` — パーツ管理・パーツ追加ピッカー（`addPicker*`）・ベストコンボ表示
6. `js/decks.js` — デッキビルダー・パーツ選択ピッカー（`picker*`）・互換性チェック・重複チェック
7. `js/battle.js` — 対戦モード（状態 `BS`、フィニッシュ得点 `FINISH_PT`）
8. `app.js` — 起動処理のみ（`renderHome()` → `showScreen("home")` → SW 登録）

HTML 側の `onclick="..."` からグローバル関数を直接呼んでいるため、関数名を変更するときは `index.html` と各 JS 内の HTML 文字列も検索すること。

### 画面・描画

- 画面は `index.html` 内の `#screen-<name>` 要素で、`showScreen(name)` が `.active` を付け替え、対応する `render*()`（`renderHome` / `renderParts` / `renderDecks` / `renderBattleHome` / `renderTimerHome`）を呼ぶ。
- 各 `render*()` は HTML 文字列を組み立てて `innerHTML` に入れる方式。状態変更後は該当の `render*()` を呼び直して再描画する。
- モーダルは `.hidden` クラスの付け外しで表示制御（`closeModal(id)`）。

### デッキ構造（DS）

作成中のデッキは `DS` オブジェクトで管理する。ブレードは 3 ライン（`bx` / `ux` / `cx`）があり、CX は 3 パーツ型（`lock` / `main` / `assist`）と 4 パーツ型（`lock4` / `metal` / `over` / `assist4`）がある（`cxPat`）。ビットは `ratchet` + `bit`、または一体型の `combo`。

- `DS` にフィールドを追加するときは `dsInit()` と `checkNavSwitch()` のフィールド列挙も更新する。
- 計測モードは `decks.js` のピッカーを流用し、`window._timerPickerHook` フラグで完了後に `renderTimerDeckBuilder()` を呼ぶ。

### パーツマスタ

`ALL_DB`（`globals.js`）が全パーツの定義。新パーツ追加はここに追記する。属性: `cat`（blade/ratchet/bit/combo）、`line`、`cxType`、`rtype`（normal/otype）、`otype: true`（O 型専用ブレード、通常ラチェット使用不可）、`combotype`。

### データ永続化

サーバーや DB はなく、すべて `localStorage`（キーは `bx_` 接頭辞）。起動時に `globals.js` で読み込み、変更後は対応する `save*()` を呼ぶ。

| キー | 内容 |
|---|---|
| `bx_parts` / `bx_nextId` | 所持パーツ（画像は Data URL で保存するため容量に注意） |
| `bx_decks` / `bx_nextDeckId` | デッキ |
| `bx_battleRecords` | 対戦記録 |
| `bx_measureRecords` | 計測記録（デッキ ID をキーとするオブジェクト） |
| `bx_rivals` | ライバルカード |
| `bx_myRule` / `bx_winCountMode` / `bx_playerName` / `bx_theme` | 設定 |

保存済みデータとの互換性を壊さないよう、データ構造を変更する場合は既存データの読み込みにも配慮する。

## Service Worker とデプロイ

- `sw.js` は `/` と `/index.html` をネットワークファースト、**それ以外（`js/*.js`, `style.css` など）をキャッシュファースト**で配信する。
- そのため JS / CSS を変更したら **`sw.js` の `CACHE_NAME`（例: `bx-manager-v4.4.7`）のバージョンを上げる**必要がある。上げないとユーザー側で古いファイルが使われ続ける。
- `_headers` / `_redirects` は Cloudflare Pages 用の設定。`sw.js` と `manifest.json` はキャッシュ無効化ヘッダー付き。
