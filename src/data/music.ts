// 音乐播放器歌单 — 网易云外链（已逐首验证可免费播放）
// 想换歌：去网易云音乐网页版打开歌曲 → 分享 → 复制链接，链接里的 id= 后面的数字就是歌曲 ID
// 例如 https://music.163.com/#/song?id=31445772 → id 是 31445772
export interface Song {
  title: string;
  artist: string;
  id: number; // 网易云歌曲 ID
}

export const songs: Song[] = [
  { title: '理想三旬', artist: '陈鸿宇', id: 31445772 },
  { title: '南山南', artist: '马頔', id: 29436904 },
  { title: '消愁', artist: '毛不易', id: 569200213 },
  { title: '像我这样的人', artist: '毛不易', id: 569213220 },
  { title: '杀死那个石家庄人', artist: '万能青年旅店', id: 386844 },
  // { title: '歌名', artist: '歌手', id: 123456 }, // 照这个格式加歌
];
