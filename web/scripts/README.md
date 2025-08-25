# 画像最適化スクリプト

## 概要
このディレクトリには、PixiJS背景アニメーションの画像データを最適化するためのスクリプトが含まれています。

## 問題点
- `src/app/bg/icons.ts`に462KB以上のbase64エンコードされた画像データが直接埋め込まれている
- これによりバンドルサイズが大きくなり、初期読み込みが遅くなる

## 解決策
1. base64画像データを外部ファイルに抽出
2. WebP形式に変換して軽量化
3. 動的読み込みで必要時のみロード

## 使用方法

### 1. 画像データの抽出
```bash
# icons.tsからbase64画像を抽出してファイルに保存
node scripts/extract-icons-to-webp.js
```

このスクリプトは以下を実行します：
- `icons.ts`からbase64データを抽出
- `public/images/icons/`にメイン画像を保存
- `public/images/qr/`にQRコード画像を保存
- `src/app/bg/icons-data.json`にメタデータを保存
- `src/app/bg/icons-new.ts`に新しいTypeScriptファイルを生成

### 2. WebP形式への変換（オプション）
```bash
# WebPをインストール（まだの場合）
brew install webp  # macOS
# または
sudo apt-get install webp  # Ubuntu/Debian

# 画像をWebP形式に変換
node scripts/convert-to-webp.js
```

このスクリプトは以下を実行します：
- JPG/PNG画像をWebP形式に変換
- `icons-data.json`のパスを更新
- 元の画像は保持（必要に応じて手動削除）

### 3. コードの更新
```bash
# 1. 新しいicons.tsを適用
mv src/app/bg/icons-new.ts src/app/bg/icons.ts

# 2. index.tsを最適化版に置き換え
cp src/app/bg/index-optimized.ts src/app/bg/index.ts

# 3. 型定義を更新（必要に応じて）
# common/_interface.tsに以下を追加：
# dataPath?: string;
# qrPath?: string;
```

### 4. 確認
```bash
# ファイルサイズの確認
du -sh public/images/icons/
du -sh public/images/qr/
du -sh src/app/bg/icons.ts  # 大幅に縮小されているはず
```

## 効果
- **バンドルサイズ**: 約460KB → 数KB（99%削減）
- **初期読み込み**: 大幅に高速化
- **画像品質**: WebP変換により20-30%のファイルサイズ削減（品質維持）

## 注意事項
- WebP形式は古いブラウザでサポートされない場合があります
- 必要に応じてフォールバック処理を実装してください
- 画像の品質を調整したい場合は`convert-to-webp.js`の`quality`パラメータを変更してください

## トラブルシューティング
- `cwebp`コマンドが見つからない場合は、WebPツールをインストールしてください
- JSONパースエラーが発生した場合は、`icons.ts`の構文を確認してください
- 画像が表示されない場合は、ブラウザのネットワークタブでパスを確認してください