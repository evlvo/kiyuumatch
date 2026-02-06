
import { Profile } from './types';

/**
 * 指定された動画URL（https://video.twimg.com/...）を3つのプロフィールすべてに使用。
 * それぞれ異なるキャラクター性を設定し、スワイプ体験を向上させます。
 */
export const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'あみ',
    age: 21,
    bio: 'ビデオで遊ぼ💛 お手伝いしてあげる💜 寂しい夜は一緒に過ごそう？今すぐ通話していいよ！',
    videoUrl: 'https://video.twimg.com/amplify_video/1991092264043782144/vid/avc1/360x640/DCGrgfORL1NgTyI6.mp4',
    location: '',
    tags: []
  },
  {
    id: '2',
    name: 'りな',
    age: 23,
    bio: '内緒の話、しよ？🤫 誰にも言えない秘密を共有できる関係が理想です✨ 準備はいい？今ならすぐ出れるよ！',
    videoUrl: 'https://video.twimg.com/amplify_video/1991092264043782144/vid/avc1/360x640/DCGrgfORL1NgTyI6.mp4',
    location: '',
    tags: []
  },
  {
    id: '3',
    name: 'もか',
    age: 20,
    bio: '甘えん坊な女の子です🎀 ギュッてしてほしいな。あなたのタイプを教えて？画面越しにイチャイチャしたいな。',
    videoUrl: 'https://video.twimg.com/amplify_video/1991092264043782144/vid/avc1/360x640/DCGrgfORL1NgTyI6.mp4',
    location: '',
    tags: []
  }
];
