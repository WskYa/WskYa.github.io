// 音乐播放器歌单 — 网易云外链（已逐首验证可免费播放）
// 想换歌：去网易云音乐网页版打开歌曲 → 分享 → 复制链接，链接里的 id= 后面的数字就是歌曲 ID
// 例如 https://music.163.com/#/song?id=3349667991 → id 是 3349667991
export interface Song {
  title: string;
  artist: string;
  id: number; // 网易云歌曲 ID
}

export const songs: Song[] = [
  { title: '当真爱降临', artist: 'Yn1Jasper', id: 3349667991 },
  { title: 'midnight smoke', artist: 'MRZ', id: 2119677254 },
  { title: 'Accept Me', artist: 'Jeston', id: 2107688272 },
  { title: '爱在西元后（周杰伦 x rnb Type Beat）', artist: 'Zephyr7', id: 2757038838 },
  // { title: '歌名', artist: '歌手', id: 123456 }, // 照这个格式加歌
];
