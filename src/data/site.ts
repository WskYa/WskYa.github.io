// 站点信息 — 主页「关于我」和「技能」都从这里读取，想改直接编辑这里
export const site = {
  author: 'ALL0VEPH4U',
  tagline: '学生 · 安全渗透 · 代码折腾爱好者',
  intro:
    '一名普通大学生，喜欢安全渗透和动手做东西。这个博客记录我的学习笔记、竞赛经历和生活随想——持续学习，保持好奇。',
  github: 'https://github.com/WskYa',
  avatar: 'https://github.com/WskYa.png', // GitHub 头像，换了会自动同步
  launchDate: '2026-08-14', // 建站日期（用于统计「建站 X 天」）
};

export interface SkillGroup {
  category: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    category: '安全',
    items: ['Web 渗透测试', 'CTF', 'Burp Suite', 'Linux'],
  },
  {
    category: '开发',
    items: ['Python', 'JavaScript', '微信小程序', 'Git / GitHub'],
  },
  {
    category: 'AI 应用',
    items: ['大模型应用', '提示词工程', '自动化工作流'],
  },
];
