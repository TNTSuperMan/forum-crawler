# scratch-bbdb
非公式でScratchチームとは何も関係ありませんよ。

## なんこれ
ディスカッションフォーラムのクローラーで、これやったら検索できる

## スタック(?)
Bun+SQLite+Zod+JSDOM

## 使い方
クロール
```bash
$ bun src/crawl [トピック番号]
```
検索
```bash
$ bun src/find [キーワード] [トピック番号(任意)]
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
