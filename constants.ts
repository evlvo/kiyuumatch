import { Profile } from './types';

/**
 * リポジトリ内に配置した動画ファイルを参照します。
 * index.htmlと同じ場所に 'video.mp4' を置いてください。
 */
export const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'あみ',
    age: 21,
    bio: 'ビデオで遊ぼ💛 お手伝いしてあげる💜 寂しい夜は一緒に過ごそう？今すぐ通話していいよ！',
    videoUrl: './video.mp4',
    location: '',
    tags: []
  },
  {
    id: '2',
    name: 'りな',
    age: 23,
    bio: '内緒の話、しよ？🤫 誰にも言えない秘密を共有できる関係が理想です✨ 準備はいい？今ならすぐ出れるよ！',
    videoUrl: './video.mp4',
    location: '',
    tags: []
  },
  {
    id: '3',
    name: 'もか',
    age: 20,
    bio: '甘えん坊な女の子です🎀 ギュッてしてほしいな。あなたのタイプを教えて？画面越しにイチャイチャしたいな。',
    videoUrl: './video.mp4',
    location: '',
    tags: []
  }
];