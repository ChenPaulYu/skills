# research 泛化 — paper 是文件的一種,不是特殊元件

> **TL;DR**:Paul 拍板(2026-07-14):research 家的孤立源於物件定義錯誤——「論文」應降格為「論證型文件」的例子之一。修法 A2+留名:家不拆、不改名,identity 重寫為「對論證型文件的嚴謹審讀」,四個 description 去論文中心化;同 ADR 一併接三條下游縫。不搬 frame(協定形狀不合:frame=in-chat 無檔,這四個=產檔 campaign)。

## 一句話原則

**research 審讀的是「承載論證的文件」——論文、RFC、設計提案、ADR、白皮書皆是;paper 只是最常見的實例,不是家的定義。**

## 裁決鏈(elicit 殘留)

1. 「research 太獨立」的根因候選:缺下游(B)vs 物件定義錯(A)——Paul 拍 A,原則:paper 是世界上文件的一種。
2. A 的兩種實作:拆散進 frame/nav(A1)vs 就地泛化(A2)——A1 被協定形狀法則否決(frame 三家規:in-chat/不落檔/單一認知動作,critique/untangle/provenance 全是產檔 campaign 動詞);採 **A2**。
3. 家名:改名(namespace 全換,最重操作)vs 留名重定義(research 本義即「嚴謹查考」,不專屬學界)——採**留名**。
4. 縫照接(與 A2 互補,不是替代):untangle 的 positioning view → 明文餵 `shape:position`/`shape:elicit`;critique↔`frame:dialectic` 邊界已有、補反向指路;`shape:survey` 大洞 offer → deep-research(已存在,ADR 記錄即可)。

## 實施要點

- **plugins/research/CLAUDE.md**:identity 段重寫(物件=argument documents;paper 為實例);四動詞 roster 行同步。
- **四個 SKILL.md**:description 與內文去論文中心化——範例混入 RFC/設計提案/ADR;引擎不動。既有文字已半承認(dissect 早就列 blog posts/RFCs/design proposals),是敘事收斂,不是行為新增。
- **下游縫**:untangle 的 Output/Companion 補「positioning view 是 position/elicit 的輸入」;critique 的 Companion 補 probe(它審既有證據,缺的證據 → probe 生產)。
- **驗收**:路由探針重點測「非論文的論證文件」——「幫我 dissect 這份 RFC」「untangle 這五份設計提案的 contested ground」「provenance 我的 ADR 引用」要 fire;同時測不搶 nav:compose(寫 vs 讀)、frame:dialectic(自己的主張 vs 外部文件)。
- ADR-080;research 0.5.0 → 0.6.0。
