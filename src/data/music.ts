// 音乐播放器歌单 — 网易云外链
// 想换歌：去网易云音乐网页版打开歌曲 → 分享 → 复制链接，链接里的 id= 后面的数字就是歌曲 ID
// 例如 https://music.163.com/#/song?id=186016 → id 是 186016
export interface Song {
  title: string;
  artist: string;
  id: number; // 网易云歌曲 ID
}

export const songs: Song[] = [
  { title: '晴天', artist: '周杰伦', id: 186016 },
  // { title: '歌名', artist: '歌手', id: 123456 }, // 照这个格式加歌
];
