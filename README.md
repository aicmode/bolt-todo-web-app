# FlowTodo

青を基調としたダークネイビーの日本語Todoリストです。ページ遷移や再読み込みなしで軽快に操作でき、データはブラウザの `localStorage` に保存されます。PC・タブレット・スマートフォンで利用できます。

## 主な機能

- Todoの追加（Enterキー対応）、編集、完了切り替え、個別削除
- 優先度（高・中・低）と期限の設定、期限切れ表示
- すべて・未完了・完了済みフィルター
- マウス、タッチ、キーボードによるドラッグ＆ドロップ並べ替え
- 完了済みの一括削除、全件削除（確認ダイアログ付き）
- 未完了件数・全件数と空状態の表示
- 入力エラー、操作トースト、追加・削除アニメーション
- `localStorage` による自動保存

## 使用技術

- React 18 / JavaScript
- Vite 6
- 通常のCSS（レスポンシブ対応）
- dnd-kit（アクセシブルな並べ替え）
- Lucide React（必要最低限のアイコン）

外部API、データベース、APIキーは使用していません。

## 起動方法

Node.js と npm が利用できる環境で、次を実行します。

```bash
npm install
npm run dev
```

ターミナルに表示されるURL（通常は `http://localhost:5173`）をブラウザで開きます。本番用ファイルは `npm run build`、ビルド結果の確認は `npm run preview` で実行できます。

## JavaScript版で工夫した点

Reactの状態更新によりすべての操作を即時反映し、保存処理を画面から分離しました。ドラッグ操作はPointer Sensorを使い、マウスだけでなくタッチ端末でも自然に並べ替えられます。キーボード操作、フォーカス表示、動きを抑えるOS設定にも対応しています。期限比較にはローカル日付を使い、日付境界で誤判定しにくい実装にしています。

## フォルダ構成

```text
.
├── index.html
├── package.json
├── README.md
└── src
    ├── App.jsx                 # 状態管理・一覧・フィルター
    ├── main.jsx                # Reactエントリーポイント
    ├── styles.css              # UI・レスポンシブスタイル
    ├── components
    │   ├── TodoForm.jsx        # Todo入力フォーム
    │   ├── TodoItem.jsx        # Todo表示・編集・並べ替え
    │   └── Toast.jsx           # 操作通知
    └── utils
        └── storage.js          # localStorage処理
```
