# The repo is two layers, not one thing — skills are tools, the doctrine layer is the dojo

> **One line: skill 層全部是工具，以 fire 數審判；練功房是 doctrine 層（ADR·observations·rules·三層法），以可轉移性審判——每個優化取捨先問自己踩在哪一層。**
> Converged 2026-08-12 via a grounded grill (the first live run of the amended elicit), resolving the
> strategic review's blind-spot #1 ("what is this system FOR — no one has ruled").

## The decided forks

1. **工具 vs 練功房：不互斥**（Paul 否決了互斥前提——那是盲測勝出方 arm 開出的第一格，被否決本身就是收斂的一步）。
2. **線劃在哪：按層，不按 skill**（B over A，Paul 拍板）。
   - **Skill 層 = 工具，全體適用工具邏輯**：存在的理由是被使用；審判標準是 transcripts 裡的 fire 數；零 fire 走退役節律（ADR-109）。今天 39 → 28 的三輪瘦身就是這個邏輯，此決定追認它。
   - **Doctrine 層 = 練功房**：ADR、observations、findings、8 rules、deep-module-for-skills 三層法。存在的理由是**手藝的沉澱與轉移**——它的產出（例如「description 是執行中的程式碼」「gate 即合約」）已經被用在這個 repo 之外。它不欠 fire 數。

## What this settles

- **「146 次 fire vs 110+ 篇 ADR」不再是病徵。**那個比例只在「純工具」框架下難看；按層劃之後，ADR 量是練功房的產出量，用「這篇教了我什麼可帶走的東西」審判，不用使用率審判。
- **優化取捨得到權重規則**：動 skill 層 → 省時間優先、砍字優先、fire 數說話；動 doctrine 層 → 概念純度優先、可轉移性優先、寫透比寫短重要。
- **11 月結算日的語義**：對 skill 層照舊（零 fire → 降級）；doctrine 層不進結算。

## Boundary cases, ruled by the line itself

- `frame` 家族若三個月後仍近零 fire，它**不能**以「概念收藏品」為由豁免——它掛在 skill 層，就受工具邏輯管；想保存概念，把骨架搬進 doctrine 層或 memory（research/dissect 的先例）。
- 反向亦然：doctrine 層文件不因「沒人引用」被砍——它的退場標準是「教訓已被更好的文件承載」（supersession），不是使用率。

## Consequences (queued, not yet executed)

- 此 thought 是 `/shape:position` 未來把「repo 憲章」寫進 canon 層的輸入之一——今天不 position，讓這個劃分先跑一陣子驗手感。
- root CLAUDE.md 的維護規則已隱含此劃分（retirement rhythm 只管 model-invoked skill）；若三個月後劃分仍成立，值得在憲章裡明文化。
