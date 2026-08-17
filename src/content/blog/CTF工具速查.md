---
title: CTF 工具速查：从流量分析到隐写的实用片段
description: 记录我在 CTF 里反复用到的工具片段——Wireshark 过滤、zsteg 隐写、Turbo Intruder 爆破，持续更新。
pubDate: 2026-08-16
draft: true
---

打 CTF 最怕的不是不会，而是"会但记不住命令"。这篇是我自己的工具速查，打比赛时翻出来就能用，持续更新。

## Wireshark：流量题过滤语法

```text
ip.addr == 192.168.1.1        # 按 IP 过滤
tcp.port == 80                # 按端口
http.request                  # 只看 HTTP 请求
http.host contains flag       # 请求头里找 flag
tcp.stream eq 42              # 跟第 42 条 TCP 流
dns.qry.name contains flag    # DNS 查询里找 flag
```

套路：**先搜 flag 关键字，再跟流**。

## zsteg：图片隐写

```bash
zsteg -a flag.png        # 全通道扫描
zsteg -E lsb flag.png    # 提取 LSB 通道
zsteg -b 1 -o xy x.png   # 指定位平面
```

遇到 PNG 先跑一遍 `zsteg -a`，比肉眼盯着像素强一万倍。

## Turbo Intruder：高速爆破

Burp 扩展，Python 脚本控制并发。短信轰炸重放、登录爆破这类需要速度的场景是它的主场：加载扩展 → 请求发到 Turbo Intruder → 写个循环脚本跑。

## sqlmap：SQL 注入自动化

```bash
sqlmap -u "http://target/page?id=1" --batch --dbs
sqlmap -u "..." -D dbname --tables
sqlmap -u "..." -D dbname -T tablename --dump
```

注意：自动化工具是放大器，不是替身——**手工确认注入点存在**再上 sqlmap，避免漏报误报。

---

*草稿阶段，后续补充更多工具。*
