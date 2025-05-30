# Link to Title Share

Spotify リンクをタイトルと URL の形式で他のアプリに共有する PWA（Progressive Web App）です。

## 🎯 概要

Spotify アプリから他の SNS に共有する際、URL のみしか共有されず、楽曲のタイトルやアーティスト名が表示されない問題を解決します。このアプリを使用することで、以下のワークフローが可能になります：

1. **URL を共有** - Spotify アプリからこの PWA にリンクを共有
2. **タイトル取得** - ページにアクセスして楽曲のタイトルとアーティスト名を自動取得
3. **他アプリに共有** - タイトル+URL の形式で他のアプリに再共有

## ✨ 特徴

- 🎵 Spotify 楽曲の自動タイトル・アーティスト取得
- 📱 PWA 対応（ホーム画面に追加可能）
- 🔗 Share Target API 対応（他アプリからの共有を受信）
- 📋 ワンクリックコピー機能
- 🌐 GitHub Pages でホスト
- 📱 レスポンシブデザイン

## 🚀 技術スタック

- **TypeScript** - 型安全な JavaScript
- **Vite** - 高速なビルドツール
- **PWA** - Service Worker、Web App Manifest
- **Spotify oEmbed API** - 認証不要でタイトル取得
- **Web Share API** - ネイティブ共有機能

## 💻 開発環境

### 前提条件

- Node.js 16 以上
- npm または yarn

### セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/username/link-to-title-share.git
cd link-to-title-share

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### ビルドとデプロイ

```bash
# プロダクションビルド
npm run build

# GitHub Pagesにデプロイ
npm run deploy
```

## 📱 使用方法

### 基本的な使い方

1. ブラウザでアプリにアクセス
2. Spotify のリンクを URL 入力欄にペースト
3. 「タイトルを取得」ボタンをクリック
4. 取得されたタイトル・アーティスト名を確認
5. 「他のアプリで共有」またはコピーボタンを使用

### PWA としての使用

1. ブラウザでアプリにアクセス
2. 「ホーム画面に追加」で PWA としてインストール
3. Spotify アプリの共有メニューからこのアプリを選択
4. 自動的にタイトルが取得され、他アプリへの共有が可能

## 🏗️ プロジェクト構造

```
link-to-title-share/
├── src/                  # ソースコード
│   ├── index.html       # メインHTML
│   ├── main.ts          # メインTypeScriptファイル
│   ├── spotify.ts       # Spotify関連の処理
│   └── css/
│       └── style.css    # スタイルシート
├── public/              # 静的ファイル
│   ├── manifest.json    # PWAマニフェスト
│   ├── sw.js           # Service Worker
│   └── assets/
│       └── icons/       # アプリアイコン
├── dist/               # ビルド出力
├── docs/               # GitHub Pages用
├── package.json
├── tsconfig.json
└── vite.config.ts      # Vite設定
```

## 🛠️ API

### Spotify URL 解析

Spotify の URL 形式を解析し、楽曲情報を取得：

- トラック: `https://open.spotify.com/track/{id}`
- アルバム: `https://open.spotify.com/album/{id}`
- プレイリスト: `https://open.spotify.com/playlist/{id}`

### データ取得方式

1. **Spotify oEmbed API** - 認証不要、安定
2. **HTML スクレイピング** - フォールバック用（CORS 制限あり）

## 🌐 デプロイ

このアプリは GitHub Pages でホストされます：

- **本番 URL**: `https://username.github.io/link-to-title-share/`
- **自動デプロイ**: `npm run deploy`コマンドで`docs/`フォルダに出力

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは ISC ライセンスのもとで公開されています。

## 🙏 謝辞

- Spotify oEmbed API
- Vite 開発チーム
- PWA 技術コミュニティ/link-to-title-share/README.md

# Link to Title Share

This project is a Progressive Web App (PWA) that allows users to share URLs and page titles from the Spotify app to other social media platforms. The application combines the URL and the page title to facilitate easy sharing.

## Project Structure

- **public/**

  - `index.html`: Main HTML file defining the basic structure of the PWA, including title, metadata, scripts, and styles.
  - `manifest.json`: PWA manifest file containing app name, icons, theme color, and display mode settings.
  - `sw.js`: Service worker script file implementing offline functionality and cache management.

- **src/**

  - **js/**
    - `app.js`: Entry point of the application, initializing the app and setting up event listeners.
    - `share.js`: Implements the sharing functionality, combining URL and page title for sharing to other apps.
    - `spotify.js`: Handles URLs from the Spotify app, parsing specific URL formats to extract necessary information.
  - **css/**
    - `style.css`: CSS file defining the styles for the application.
  - **assets/**
    - **icons/**
      - `icon-192x192.png`: Application icon (192x192 pixels).
      - `icon-512x512.png`: Application icon (512x512 pixels).

- **docs/**

  - `index.html`: HTML file for project documentation.

- `package.json`: npm configuration file containing dependencies and scripts.

## Libraries Used

- **Workbox**: Simplifies the management of service workers for PWA implementation.
- **Fetch API**: Used for retrieving URLs and titles.
- **Web Share API**: Utilized for sharing functionality across different applications.

## Implementation Steps

1. Build the basic UI in `index.html` and load necessary scripts and styles.
2. Initialize the app in `app.js` and set up event listeners to retrieve URLs.
3. Parse Spotify URLs in `spotify.js` to extract required information.
4. Implement sharing functionality in `share.js` to combine titles and URLs for sharing.
5. Configure `manifest.json` and `sw.js` to add PWA capabilities.

## Getting Started

To get started with the project, clone the repository and open the `index.html` file in your browser. Ensure you have a local server running to test PWA features.

## License

This project is licensed under the ISC License.
