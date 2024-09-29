# Web
[README](./web/README.md)


# 用紙テンプレートの追加方法

### 定義ファイル追加
1. /common/ 以下に定義ファイルを作成
2. /web/public/template-icons 以下にアイコン画像を配置

# Chrome Extension

## セットアップ

### コマンド
```
nodenv install
yarn
yarn dev
```

### Chrome拡張のインストール
参考：https://note.com/cute_echium873/n/n997dcf40b3a1

1. Chromeのアドレスバー右にある拡張アイコンから拡張機能の管理を選択
2. 画面右上の「デベロッパーモード」をOnに
3. 画面左上の「パッケージ化されていない拡張機能を読み込む」を選択
4. distフォルダを選択

# Common
Chrome拡張からもWebからも参照する共通の用紙データ

# _test-data
テスト用のXアカウントリストなど