---
title: 给 DeepSeek Harness 换皮肤：把第三方透明 UI 插件的青绿背景改成灰白
description: 在 MIT 开源插件 DSH-Transparent-UI（Aqua）的基础上做的一次小手术——从像素分析定位 teal 色源，到把饱和度写死的流体背景改造成灰白，全程记录。
pubDate: 2026-08-16
---

DeepSeek Harness 的 Web UI 默认界面是深空蓝灰风格。为了让界面更"通透"，我安装了一款第三方玻璃拟态主题插件 **DSH-Transparent-UI**（作者 [WYH66666666](https://github.com/WYH66666666)，MIT 协议，包名 `@deepseek-ai/dsh-client-ui-aqua`）。

效果确实惊艳：毛玻璃卡片、流体动态背景、粒子鲸鱼……但有一个问题——**默认背景是青绿色的（teal）**，看久了很累。我想把它换成灰白。

打开设置面板一看，插件确实提供了"流体颜色"色相滑杆，但怎么拖都调不出灰白。于是决定自己动手。这篇文章记录完整的排查与修改过程。

## 问题：为什么设置里调不出灰白？

插件的背景是一块"活流体"（fluid board），颜色由三个 HSL 色值混合而成。查看源码 `src/client/fluid-tones.ts` 后发现关键：

```ts
export function fluidToneColors(dark: boolean, hue: number, depth: number): FluidToneColors {
  const h = (((hue + HUE_BASE) % 360) + 360) % 360
  // ...
  return {
    color1: hsl(h, 1, ramp(0.27, 0.45, 0.90)),   // ← 饱和度 100%，写死的
    color2: hsl(h, 0.55, 0.86),
    color3: hsl(h, 0.25, 0.955),
  }
}
```

**饱和度是硬编码的**（浅色模式 100% / 55% / 25%，深色模式 85% / 90% / 50%），色相滑杆只能改变 `hue`，改不了饱和度。默认 `fluidHue: 320` 配合 `HUE_BASE: 217` 换算后落在 `h=177`——正好是青蓝（cyan），这就是 teal 的来源。所以无论把色相拖到哪，得到的都是"带色的背景"，永远不是灰白。

## 排查：从一张截图开始

修改前我先做了像素级取证，确认"绿色"到底从哪来：

```python
# 对页面截图做主色统计
rgb(119,200,196)   8.0%   ← 深青绿
rgb(165,221,219)   5.7%   ← 浅青绿
...
平均色: (191, 226, 226)   ← 整体 teal
```

然后顺着浏览器 DOM 一路排查：

1. **页面计算样式**：body 背景是 `rgb(244,248,253)`（蓝白），CSS 渐变也是蓝灰——**都不是绿**；
2. **最终定位**：页面上有两个 `<canvas>`，青色来自 **WebGL/2D 绘制的流体动画层**，CSS 里根本看不到；
3. **顺藤摸瓜**：canvas 代码不在主 bundle，而在插件包 `dsh-client-ui-aqua` 的 `client.js` 里，最终指向 `fluid-tones.ts` 和 `theme-layer.ts` 两个文件。

排查结论：颜色全部由 `fluidToneColors()` 生成，改这一个函数就能全局生效。

## 修改：饱和度归零，灰白落地

既然用户要的是"灰白"，而饱和度写死是唯一障碍，方案就是**把三档颜色的饱和度压到接近 0**：

```ts
// 修改前（浅色模式）
color1: hsl(h, 1,   ramp(0.27, 0.45, 0.90)),
color2: hsl(h, 0.55, 0.86),
color3: hsl(h, 0.25, 0.955),

// 修改后（浅色模式）
color1: hsl(h, 0.04, ramp(0.27, 0.45, 0.90)),  // 100% → 4%
color2: hsl(h, 0.03, 0.86),                    // 55%  → 3%
color3: hsl(h, 0.02, 0.955),                   // 25%  → 2%

// 深色模式同理：85%→5%、90%→4%、50%→3%
```

光晕（`theme-layer.ts` 里的光标 `--dsh-aqua-spot-color`）也是同色相 90% 饱和度，会留下一团青色光斑，一并处理：

```ts
// 修改前                       修改后
hsla(${glowHue}, 90%, 45%, 0.16)  →  hsla(${glowHue}, 6%, 45%, 0.16)   // 浅色
hsla(${glowHue}, 90%, 62%, 0.17)  →  hsla(${glowHue}, 8%, 62%, 0.17)   // 深色
```

操作上直接改构建产物 `lib/client.js`（服务器实际加载的文件），同时把 `src/` 源码同步改掉，保证以后重新构建不会丢改动。

## 效果对比

修改后用同样的像素统计验证：

| 指标 | 修改前 | 修改后 |
| --- | --- | --- |
| 主色 | (119,200,196) 深青绿、(165,221,219) 浅青绿 | (196,198,200)、(213,215,217) 中性灰 |
| 页面平均色 | **(191, 226, 226) 青绿** | **(200, 203, 205) 灰白** |
| 偏绿像素 | 大面积 | 0 |

毛玻璃效果、模糊、粒子鲸鱼全部保留，只是从"深海"变成了"雾灰"，观感干净很多。

## 几个小经验

- **插件 rev 自动更新**：服务器按文件内容计算 rev（`?rev=c83911be42f9`），改完 `client.js` 刷新浏览器即可生效，**不需要重启服务**；
- **改两份**：安装目录（`~/.dsh/profiles/node_modules/@deepseek-ai/dsh-client-ui-aqua/`）和源码副本都要改，否则重装或重新构建会覆盖；
- **重装会丢改动**：插件的 `install.ps1` 会重新拉取 release，升级后需要重新打补丁——这也是我写这篇文章的原因之一，方便下次照着改。

## 相关链接

- 原插件：https://github.com/WYH66666666/DSH-Transparent-UI-Plugin（MIT，© 2026 John Wu）
- DeepSeek Harness：https://github.com/deepseek-ai/deepseek-harness
- 修改涉及的文件：`fluid-tones.ts`、`theme-layer.ts`（src 与 lib 同步）
