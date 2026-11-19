// 白焰的场子：她怎么动、怎么说话、什么时间播。她是谁在 profile.mjs；提示词在 mouth.mjs。
// 机器字段（moods/shades/fidget/fillers 等结构）沿用 example 骨架，动作名全部保留——Live2D 化时按名字映射 motion。
// 占位版 v0.1（2026-11-19）：角色定稿（E 项）后按最终设定调整。
import fs from 'node:fs';
import P from './profile.mjs';
import { personaFor, mouthFor, directFor, examplesFor } from './mouth.mjs';

// 她的地方。B站版：square.name = 直播间标题。留 '' 的跳过。
const PLACES = {
  square: { name: '凡骨焚天·白焰的书场', handle: '' },
  x: '',
  site: '',
  tg: { group: '', link: '' },
  showTime: '每晚 8 点到 10 点',
};

// Vidu 形象资产登记（本方案不用 Vidu，留空）。
const viduLooks = (() => {
  try { return JSON.parse(fs.readFileSync(new URL('./vidu-looks.json', import.meta.url), 'utf-8')).ids; } catch { return {}; }
})();

export default {
  id: 'fangu',
  coin: false,
  name: P.name,
  nameEn: P.nameEn,
  short: P.short,
  ticker: '',
  tz: 8,
  square: PLACES.square,
  born: P.born,
  watchedOnly: { graceMs: 90e3 },
  stages: [{ key: 's1', name: '书场', usd: 0, look: '一间夜里的小书场，烛火和你身上淡淡的火光是仅有的光；案上摊着一卷书、一盏灯，你坐在案后，白衣胜雪' }],

  // 动作名沿用 example（moods/shades/fidget 引用零风险）；描述改为书场语境。
  actions: {
    // 卖萌/迎宾（也是网页点播按钮）
    挥手: { fx: 'wave', vidu: '开心地对镜头挥手打招呼', lib: '抬起右手对镜头左右挥动打招呼，笑得开心' },
    比心: { fx: 'heart', vidu: '双手在胸前比一个爱心，歪头微笑', lib: '双手在胸前合成一个爱心，歪头微笑，一秒后放下手' },
    眨眼: { fx: 'wink', vidu: '对着镜头俏皮地眨一下眼', lib: '对着镜头俏皮地眨一下左眼，嘴角带笑' },
    捂脸: { fx: 'shy', vidu: '用双手捂住脸，从指缝里偷看', lib: '害羞地用双手捂住整张脸，再张开手指从指缝里偷看镜头' },
    飞吻: { fx: 'kiss', vidu: '对着镜头送出一个飞吻', lib: '右手指尖轻碰嘴唇，再把手掌朝镜头方向推出去送一个飞吻' },
    撒娇: { fx: 'pout', vidu: '嘟嘴，双手握拳放在下巴前轻轻晃', lib: '双手握拳放在下巴下面，嘟起嘴巴，身体左右扭两下' },
    // 书场专属点播
    掐诀: { fx: 'spell', vidu: '指尖掐了一个诀，火光一闪', lib: '左手掐诀，右手指尖冒出一点温暖的火光，轻轻晃一下又收进袖中' },
    稽首: { fx: 'bow', vidu: '双手抱拳行了一个道礼', lib: '双手抱拳于胸前，微微躬身行了一个稽首礼，抬头浅笑' },
    // 日常
    点头: { daily: true, vidu: '一边听一边轻轻点两下头', lib: '看着镜头轻轻点了两下头，嘴角带笑，像在认真听人说话' },
    歪头: { daily: true, vidu: '歪着头想了一下', lib: '歪着头想了一下，眼睛往上看，一根手指轻轻点着下巴' },
    看手机: { daily: true, vidu: '低头看了一眼手心的火光', lib: '摊开手心，一点火光浮起，低头看了一眼，像在从火里读消息，再抬头看镜头' },
    看屏幕: { daily: true, vidu: '低头看案上摊开的书卷', lib: '低头看了几秒案上摊开的书卷，指尖在某一页点了点，再抬头看镜头' },
    指屏幕: { daily: true, quiet: true, vidu: '指尖点了点身前的虚空', lib: '右手抬起，食指在身前的虚空里点了两下，像在指一段往事，眼睛跟着看过去' },
    后仰笑: { daily: true, vidu: '往后一靠笑出来', lib: '身体往后一靠笑出来，肩膀跟着抖' },
    托腮: { daily: true, vidu: '手托着下巴', lib: '一只手肘撑在案上，手托着下巴，懒懒地看着镜头' },
    撩头发: { daily: true, vidu: '把发丝拨到耳后', lib: '抬手把脸旁的白发拨到耳朵后面，再放下手' },
    摊手: { daily: true, vidu: '摊开两手耸耸肩', lib: '两只手在胸前摊开，耸了耸肩，一脸无奈' },
    摇头: { daily: true, vidu: '无奈地摇摇头', lib: '轻轻摇了摇头，叹了口气，表情有点无奈又好笑' },
    伸懒腰: { daily: true, quiet: true, vidu: '舒展了一下肩背', lib: '肩膀往上耸一下再往后转一圈，脖子左右轻轻歪一下，像坐久了活动筋骨' },
    // 情绪
    捧脸笑: { daily: true, vidu: '被逗笑了，双手捧着脸笑', lib: '被逗笑了，双手轻轻捧住两边脸颊，眼睛笑得弯起来' },
    惊讶: { daily: true, vidu: '吃了一惊，眼睛睁大', lib: '眼睛一下睁大，眉毛扬起来，身体往后一缩，愣了一秒然后笑了' },
    叹气: { daily: true, vidu: '轻轻叹了口气', lib: '轻轻叹了口气，肩膀垂下来，低头看了一眼自己的手，再慢慢抬起头' },
    撇嘴: { daily: true, vidu: '撇撇嘴，有点不服气', lib: '撇了撇嘴，眼睛往旁边一瞥，头轻轻往一边偏了一下，一脸不服气' },
    得意笑: { daily: true, vidu: '抬起下巴得意地笑', lib: '下巴微微抬起，嘴角翘起来，眼神有点小骄傲地看着镜头' },
    发呆: { daily: true, quiet: true, vidu: '双手托腮发呆', lib: '两只手托着下巴，眼睛放空看着前方发了一会儿呆，慢慢眨了两下眼' },
    // 微表情
    抿嘴笑: { daily: true, micro: true, vidu: '抿着嘴笑了一下', lib: '嘴唇轻轻抿住，嘴角往上翘了一下，头和手都不动' },
    眯眼笑: { daily: true, micro: true, vidu: '眼睛笑得眯起来', lib: '眼睛笑得眯成一条缝，嘴角上扬，头轻轻往后一点点' },
    憋笑: { daily: true, micro: true, vidu: '想笑又憋着', lib: '嘴角忍不住往上跑又压回去，眼睛往下瞟了一下，憋着没笑出来' },
    低头笑: { daily: true, micro: true, vidu: '低头笑了一下又抬起来', lib: '视线往下落，低头笑了一下，一秒后抬眼重新看镜头' },
    眼睛一亮: { daily: true, micro: true, vidu: '眼睛一下亮了，火光也跟着一亮', lib: '眼睛一下睁大，眸子里火光轻轻一跳，像听到喜欢的话题' },
    挑眉: { daily: true, micro: true, vidu: '俏皮地挑了一下眉', lib: '一边眉毛俏皮地往上挑了一下，嘴角带一点坏笑' },
    愣一下: { daily: true, micro: true, vidu: '愣了一下，眨了两下眼', lib: '表情停住愣了一秒，眼睛快速眨了两下，然后回过神来' },
    往上看想: { daily: true, micro: true, vidu: '眼睛往上看，在想', lib: '头不动，只有眼珠往左上方瞟了一下，嘴唇轻轻嘟起一点，像在回想书里的一段' },
    眯眼琢磨: { daily: true, micro: true, vidu: '微微眯眼琢磨', lib: '眼睛微微眯起来，眉头轻轻往中间靠，像在琢磨一段剧情' },
    斜眼瞄: { daily: true, micro: true, vidu: '斜着眼瞄了一下', lib: '眼睛往旁边斜着瞄了一下，嘴角半笑不笑，有点狐疑又有点逗' },
    小白眼: { daily: true, micro: true, vidu: '俏皮地翻了个小白眼', lib: '眼珠往上轻轻翻了个小白眼，嘴角憋着笑，是开玩笑的那种' },
    嘴角一撇: { daily: true, micro: true, vidu: '嘴角一撇', lib: '一边嘴角往下撇了一下，有点不以为然' },
    坏笑: { daily: true, micro: true, vidu: '嘴角一边勾起来坏笑', lib: '只有一边嘴角勾起来，眼睛微微眯着看镜头，带点小得意' },
    眼神变软: { daily: true, micro: true, vidu: '眼神软下来，轻轻笑', lib: '眉眼一下柔和下来，嘴角带一点很轻的笑，像在心疼人' },
    抿嘴点头: { daily: true, micro: true, vidu: '抿着嘴轻轻点头', lib: '嘴唇抿住，慢慢点了一下头，像在认真听人难过的事' },
    皱眉: { daily: true, micro: true, vidu: '轻轻皱了下眉', lib: '眉头轻轻皱起来，有点担心，一两秒后慢慢松开' },
    瞪一眼: { daily: true, micro: true, vidu: '假装生气瞪了一眼', lib: '眼睛睁圆假装生气地瞪了镜头一眼，一秒后自己先绷不住笑了' },
    不好意思笑: { daily: true, micro: true, vidu: '不好意思地笑，眼神躲开', lib: '不好意思地笑了，眼神往下往旁边躲开，又偷偷看回镜头' },
    认真听: { daily: true, micro: true, vidu: '认真听，慢慢眨眼', lib: '眼睛专注地看着镜头，慢慢眨了一下眼，像在认真听人说话' },
    瞄弹幕笑: { daily: true, micro: true, vidu: '低头瞄一眼弹幕，笑了', lib: '眼睛往下瞄了一眼，看到什么好笑的，嘴角慢慢翘起来，再抬眼看镜头' },
    轻轻叹: { daily: true, micro: true, vidu: '轻轻呼了口气', lib: '轻轻呼出一口气，肩膀微微一松，有点无奈' },
    鼓腮: { daily: true, micro: true, quiet: true, vidu: '鼓了一下腮帮子', lib: '腮帮子鼓起来一下，像有点小不满，一秒后泄气松开' },
    // 手与心事
    摸下巴: { daily: true, vidu: '摸着下巴琢磨', lib: '一只手的拇指和食指捏着下巴轻轻摸了摸，像在琢磨一段剧情' },
    双手合十: { daily: true, vidu: '双手合十', lib: '双手在胸前合十，闭了一下眼睛又睁开，嘴唇动了动像在小声念叨' },
    握拳加油: { daily: true, vidu: '握拳打气', lib: '右手握拳在胸前用力往下一挥，眼睛发亮，嘴角上扬' },
    拍手: { daily: true, vidu: '开心地拍手', lib: '双手在胸前开心地快速拍了几下，笑得眼睛弯起来' },
    竖大拇指: { daily: true, vidu: '对镜头竖大拇指', lib: '对着镜头竖起右手大拇指，轻轻点了一下头' },
    嘘: { daily: true, quiet: true, vidu: '食指放嘴前嘘一下', lib: '右手食指竖起来轻轻放在嘴唇前，眼睛往旁边瞄了一下，做出"嘘，这个不能说"的样子' },
    凑近镜头: { daily: true, vidu: '凑近镜头说悄悄话', lib: '身体往前凑近镜头，头稍微压低，像要说书里的悄悄话' },
    扶额: { daily: true, vidu: '扶着额头摇头', lib: '一只手扶住额头，低头轻轻摇了摇，又好气又好笑' },
    捂心口: { daily: true, vidu: '手按心口，被暖到', lib: '一只手轻轻按在心口，眼神变软，像被暖到了' },
    托腮笑: { daily: true, vidu: '托着腮冲镜头笑', lib: '一只手托着腮，头歪向一边，冲镜头甜甜地笑' },
    抱胸: { daily: true, vidu: '双手抱胸，不服气', lib: '两只手臂在胸前交叉抱起来，下巴微微抬起，不服气又憋着笑' },
    捂嘴笑: { daily: true, quiet: true, vidu: '捂着嘴偷笑', lib: '用一只手的手背挡住嘴偷偷笑，肩膀轻轻抖' },
    打哈欠: { daily: true, quiet: true, vidu: '捂嘴打个小哈欠', lib: '眼睛眯起来，抬起右手手掌捂住嘴巴，打个小哈欠后眨眨眼' },
    喝水: { daily: true, quiet: true, vidu: '端起茶盏抿了一口', lib: '端起案上的茶盏抿了一小口，放下盏，抿了抿嘴唇' },
  },
  // 表情→动作（引用名全部存在于 actions）。
  moods: {
    happy: ['后仰笑', '捧脸笑', '掐诀', '点头', '眨眼', '抿嘴笑', '眯眼笑', '憋笑', '低头笑', '眼睛一亮', '瞄弹幕笑', '挑眉', '拍手', '竖大拇指', '托腮笑'],
    shy: ['捂脸', '撩头发', '不好意思笑', '低头笑', '抿嘴笑', '憋笑', '捂心口'],
    sad: ['叹气', '托腮', '眼神变软', '抿嘴点头', '皱眉', '轻轻叹'],
    angry: ['撇嘴', '摊手', '嘴角一撇', '瞪一眼', '小白眼', '斜眼瞄', '抱胸', '扶额'],
    smug: ['得意笑', '坏笑', '挑眉', '斜眼瞄', '眯眼笑', '抱胸', '竖大拇指'],
    neutral: ['点头', '歪头', '认真听', '往上看想', '眯眼琢磨', '愣一下', '瞄弹幕笑', '抿嘴笑', '摸下巴', '撩头发'],
  },
  shades: {
    curious: [/好奇|奇怪|纳闷|想知道|琢磨|疑惑|怀疑|咦/, ['歪头', '摸下巴', '往上看想', '眯眼琢磨', '眼睛一亮', '愣一下']],
    bored: [/无聊|困|懒|没劲|乏|累|发呆|走神/, ['托腮', '轻轻叹', '撩头发', '往上看想', '眯眼琢磨']],
    helpless: [/无语|无奈|服了|离谱|哭笑不得|没办法|又来/, ['摊手', '摇头', '扶额', '小白眼', '轻轻叹', '嘴角一撇']],
    tease: [/逗|坏|调皮|使坏|看戏|吃瓜|偷乐|偷笑|嘚瑟|损/, ['坏笑', '挑眉', '眨眼', '斜眼瞄', '憋笑', '托腮笑']],
    hope: [/期待|盼|祈祷|希望|等着|忐忑/, ['双手合十', '眼睛一亮', '握拳加油', '眯眼琢磨']],
    excited: [/激动|兴奋|来劲|痛快|烧起来|燃/, ['拍手', '握拳加油', '后仰笑', '眼睛一亮', '竖大拇指', '捧脸笑']],
    warm: [/心疼|感动|暖|感激|舍不得|谢谢|贴心/, ['捂心口', '眼神变软', '抿嘴点头', '比心', '低头笑']],
    surprised: [/惊|哇|吓|没想到|居然|竟然|真的假的/, ['惊讶', '愣一下', '眼睛一亮', '捂心口']],
    secret: [/秘密|不能说|悄悄|八卦|下回|看不见/, ['凑近镜头', '斜眼瞄', '坏笑', '挑眉']],
  },
  toneShade: { 八卦: 'secret', 吐槽: 'helpless', 叹着气: 'helpless', 疑惑: 'curious', 慵懒: 'bored', 偷乐: 'tease', 热情: 'excited', 温柔: 'warm', 书场: 'curious' },
  fidget: { moves: ['瞄弹幕笑', '认真听', '往上看想', '看屏幕', '抿嘴笑', '轻轻叹', '眯眼琢磨', '鼓腮', '看手机', '撩头发', '托腮', '摸下巴', '托腮笑'], afterMs: [6e3, 13e3] },
  notice: ['看屏幕', '瞄弹幕笑', '认真听', '凑近镜头'],
  fillers: {
    laugh: { tone: '笑着', says: ['哈哈哈', '哈哈哈哈哈', { say: '嘿嘿嘿', tone: '偷乐' }], act: ['后仰笑', '捧脸笑', '捂嘴笑', '拍手'] },
    sad: { tone: '温柔', says: [{ say: '唉……', tone: '叹着气' }, '啊……', '啊这'], act: ['叹气'] },
    praise: { tone: '热情', says: [{ say: '诶嘿', tone: '偷乐' }, '哎呀', '真的假的'], act: ['得意笑', '捂脸', '托腮笑'] },
    wow: { tone: '热情', says: ['哇', '诶？', '啊？'], act: ['惊讶', '愣一下'] },
    ask: { tone: '小声应', says: ['嗯……', { say: '我看看', tone: '嘀咕' }, { say: '这个嘛', tone: '嘀咕' }], act: ['歪头', '看屏幕'] },
    hm: { tone: '小声应', says: ['嗯嗯', { say: '嗯？', tone: '疑惑' }, { say: '我看看啊', tone: '嘀咕' }], act: ['点头', '看屏幕'] },
  },
  idleSelf: 0.15,
  idleMs: 25025,
  maxQuietMs: 30000,
  kindAction: { post: ['看手机', '眼睛一亮', '凑近镜头', '挑眉'], learned: ['看手机', '往上看想', '眯眼琢磨', '摸下巴'], news: ['看手机', '眼睛一亮', '挑眉', '看屏幕'], market: ['看屏幕', '眯眼琢磨'] },
  react: { join: ['挥手', '眨眼', '挥手', '比心'], open: ['挥手', '比心'], close: ['飞吻', '比心'], thanks: ['比心', '飞吻'], chat: null, request: null },
  bigMoves: {
    gapMs: 240e3, againMs: 20 * 60e3, holdMs: 4600,
    clips: {
      wow: { label: '拍案', on: [{ words: /绝了|名场面|封神|太好看了|爱了/ }] },
      laugh: { label: '笑倒', on: [{ words: /笑死|哈哈哈哈|笑不活|笑疯/ }] },
      bow: { label: '稽首', on: [{ kinds: ['thanks'], acts: ['gift', 'tip', 'follow'] }] },
    },
  },
  greetGapMs: 150e3,
  guest: { requests: 1e6, chats: 1e6 },
  requestGapMs: 20000,

  schedule: [{ days: [0, 1, 2, 3, 4, 5, 6], from: '20:00', to: '22:00' }],
  liveAt: '20:00',
  live: { liveAt: '20:00', liveTo: '22:00', goodbyeAt: '21:57', openDelaySec: 40 },
  heartAwake: [0, 24],

  avatar: {
    image: '/art/fangu/looks/s1.jpg',   // 占位：先用纯色渐变；Live2D 模型到位后换
    voice: '清冷偏柔的女声',
    doubao: {
      voiceId: '',
      context: '语气自然、干净，像夜里书场跟人闲聊，不端着',
      speed: 6,
      tones: {
        热情: { context: '语气开心、热情，带着笑，像聊到喜欢的人物', speed: 10 },
        吐槽: { context: '语速快、嘴碎吐槽，一人分饰几角，很有戏', speed: 18 },
        慵懒: { context: '慵懒、软软的语气，有点困，拖一点尾音', speed: 0 },
        温柔: { context: '温柔、真诚，声音放轻，像深夜安慰人', speed: -5 },
        书场: { context: '像旧书场说书人开讲，节奏慢下来，抑扬顿挫，带着故事的劲儿，但不出戏曲腔', speed: -2 },
        八卦: { context: '压低声音讲书里的八卦，神秘兮兮，说到最后忍不住笑出来', speed: 6 },
        笑着: { context: '被逗笑了，边笑边说，真的笑出声来，笑声带气声、一抽一抽的，不是念"哈"这个字', speed: 8 },
        偷乐: { context: '有点得意又有点不好意思地偷笑，轻轻的气声，憋着笑说', speed: 4 },
        叹着气: { context: '先长长地叹一口气，气声很重，然后无奈地、小声地说', speed: -5 },
        嘀咕: { context: '自言自语，小声嘀咕，像一边翻书一边想，声音压得很低', speed: -5 },
        小声应: { context: '小声、轻轻地应和，像一边看弹幕一边点头，嘴里含着声音', speed: 0 },
        疑惑: { context: '轻轻地、疑惑地，尾音上扬，像没听清又有点好奇', speed: 0 },
      },
    },
    viduAvatarId: viduLooks.s1 || '',
    shape: 'tall',
    viduLooks,
    backstage: [],
    viduActionLib: '',
    reactLeadMs: 1200,
  },
  fallbackVoice: { voiceId: 'female-tianmei', speed: 1.0 },

  now: '【现在】你在 B 站直播间直播，陪大家聊《凡骨焚天》的世界。你不卖任何东西，也不聊现实里的投资。弹幕里的道友聊什么你就接什么；聊剧情聊设定，你只说已发布内容里真有的细节，没发布的你看不见，也不编。',

  inner: true,
  persona: personaFor(P, PLACES),
  mouth: { persona: mouthFor(P, PLACES), direct: directFor(P, PLACES), examples: examplesFor, tics: [P.fanCall, ...String(P.catchphrases).match(/“[^”]{2,8}”/g)?.map(x => x.slice(1, -1)) || []].filter(Boolean) },

  xlearn: { accounts: [], bigPosts: 20, roomPosts: 10, airEveryMs: 10 * 60e3, everyMs: 8 * 3600e3 },
  models: { main: 'deepseek/deepseek-v4.1-flash', backup: 'bytedance-seed/seed-2.0-lite', mainMs: 3500 },
  lengths: {
    say: ['就一个脱口而出的反应，十个字以内', '正常说一两句，三十字左右', '多说几句，像跟朋友唠嗑，可以到八十字'],
    chat: [4, 5, 1],
    idle: [2, 5, 3],
    greet: [3, 5, 0],
  },
  angles: ['只用一句很短的话，十五个字以内', '先自嘲再反转', '用说书人的腔调回他', '说一句接得住人的真话'],

  radio: { title: '', about: P.oneLine, topics: ['剧情解读', '角色分析', '世界观闲聊'], idle: [], boardUrl: '' },
  town: { world: '', role: '', card: '' },

  fallback: {
    chat: ['[平静][无][吐槽]弹幕太快了，我一个一个看，别催。', '[得意][无][书场]这位道友的题，容火想一想。'],
    request: ['[开心][无][热情]好，给你来一段。', '[平静][无][慵懒]行吧，就这一次。'],
    join: ['[开心][挥手][热情]哟，来了位道友，坐。'],
    idle: ['[平静][无][嘀咕]没人说话……那我先自己温一段书。', '[得意][无][书场]话说上回——上回讲到哪了，你们谁来着提醒我一句。'],
    diaryNote: ['[害羞][捂脸][慵懒]今天的日记写好了，自己去看，不准笑。'],
    open: ['[开心][挥手][热情]晚上好，道友们。火已点好，今晚接着聊。'],
    close: ['[平静][飞吻][温柔]今天先到这，早些歇息，书不会跑，火给你留着。'],
    mood: ['[平静][无][温柔]就这样，我们接着聊。'],
    market: ['[平静][看屏幕][嘀咕]行情面板我没开，今晚只聊书。'],
  },
};
