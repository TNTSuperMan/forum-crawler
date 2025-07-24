# forum-crawler

## 注意
- 非公式でScratchとは何も関係ありませんよ
- Scratchにアクセスするからそれの利用規約の確認してね
- くれぐれもScratchへの攻撃に使おうなんて考えないでくださいね

## なんこれ
Scratchのディスカッションフォーラムのクローラーで、これやったら検索できる

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
