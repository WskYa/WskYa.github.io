// 名人名言库 — 想增删名言，直接改这里
export interface Quote {
  text: string;
  author: string;
}

export const quotes: Quote[] = [
  { text: '腹有诗书气自华，读书万卷始通神。', author: '苏轼' },
  { text: '其实地上本没有路，走的人多了，也便成了路。', author: '鲁迅' },
  { text: '想象力比知识更重要。因为知识是有限的，而想象力概括着世界的一切。', author: '爱因斯坦' },
  { text: '世界上只有一种真正的英雄主义，就是认清了生活的真相后依然热爱生活。', author: '罗曼·罗兰' },
  { text: 'Stay hungry, stay foolish.（求知若饥，虚心若愚。）', author: '乔布斯' },
  { text: '生活总是让我们遍体鳞伤，但到后来，那些受伤的地方会变成我们最强壮的地方。', author: '海明威' },
  { text: '不必太纠结于当下，也不必太忧虑未来，当你经历过一些事情的时候，眼前的风景已经和从前不一样了。', author: '村上春树' },
  { text: '凡是不能杀死你的，最终都会让你更强大。', author: '尼采' },
  { text: '世界以痛吻我，我要报之以歌。', author: '泰戈尔' },
  { text: '非淡泊无以明志，非宁静无以致远。', author: '诸葛亮' },
  { text: '人的一切痛苦，本质上都是对自己无能的愤怒。', author: '王小波' },
  { text: '种一棵树最好的时间是十年前，其次是现在。', author: '佚名' },
];
