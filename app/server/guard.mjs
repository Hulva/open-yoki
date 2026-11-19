// 敏感词防火墙（#7 合规硬门槛）：
//   输入侧——弹幕/昵称/礼物名里的敏感词在她"看见"之前就被换成 █（她不会复述出去）；
//   输出侧——她的台词（含"心里"那行）在开口前扫一遍，命中同样换成 █，并记进 <DATA_DIR>/guard.jsonl 供运营复盘。
// 词表：内置起步表 + <DATA_DIR>/sensitive-words.txt（每行一个，# 开头是注释；文件 mtime 变了自动重载，运营可随时追加）。
// 设计取"遮蔽不拦断"：她照样说话，但违规词永远不出街；宁可吞字，不冒封号风险。
import fs from 'node:fs';
import path from 'node:path';

// 起步表：政治类只列最高危的一小撮（防冒充/防政治讨论），另含赌博/色情/毒品/诈骗/平台违规。
// 真正的覆盖面靠 sensitive-words.txt（可用开源词表填充，见项目 skill）。
const BUILTIN = [
  // 政治/社会高危（最小集）
  '法轮功', '六四事件', '达赖喇嘛', '台独', '藏独', '疆独',
  '赌博', '博彩', '六合彩', '买彩票漏洞', '网赌', '赌球', '开盘下注', '庄家开盘',
  '色情', '淫秽', '援交', '嫖娼', '卖淫', '裸聊', '约炮',
  '毒品', '冰毒', '海洛因', '大麻', '摇头丸', '吸毒',
  '诈骗', '洗钱', '传销', '非法集资', '高利贷', '套现', '黑产', '卡商', '接码',
  // 直播平台高危
  '刷单', '刷礼物返现', '代充', '低价代充', '卖号', '买粉', '刷粉', '引流微信', '加微信', '私聊转账', '兼职日结',
];

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function createGuard({ file = null, builtin = BUILTIN, now = () => Date.now(), log = console.log } = {}) {
  let words = [], re = null, mtime = 0, fileTried = 0;
  let maskedIn = 0, maskedOut = 0;
  const load = () => {
    const set = new Set(builtin);
    if (file) {
      try {
        const st = fs.statSync(file);
        mtime = st.mtimeMs;
        for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
          const w = line.trim();
          if (w && !w.startsWith('#')) set.add(w);
        }
      } catch { /* 没有词表文件就用内置表 */ }
    }
    words = [...set];
    // 长词优先，避免"网赌博"只命中"赌博"的一半
    const sorted = words.filter(Boolean).sort((a, b) => b.length - a.length).map(esc);
    re = sorted.length ? new RegExp(sorted.join('|'), 'g') : null;
    return words.length;
  };
  load();
  const reloadIfChanged = () => {
    if (!file) return;
    try { const st = fs.statSync(file); if (st.mtimeMs !== mtime) { const n = load(); log(`guard: 词表已重载，共 ${n} 条`); } } catch {}
  };
  const scan = text => {
    reloadIfChanged();
    const hits = new Set();
    if (re) { re.lastIndex = 0; let m; while ((m = re.exec(String(text || '')))) { hits.add(m[0]); if (hits.size >= 8) break; } }
    return { hit: hits.size > 0, words: [...hits] };
  };
  return {
    get size() { return words.length; },
    mask(text, out = false) {
      const s = String(text || '');
      const f = scan(s);
      if (!f.hit) return s;
      out ? maskedOut++ : maskedIn++;
      return s.replace(new RegExp(f.words.map(esc).sort((a, b) => b.length - a.length).join('|'), 'g'), w => '█'.repeat(w.length));
    },
    scan,
    stats: () => ({ size: words.length, maskedIn, maskedOut }),
  };
}

// 违规记录：<DATA_DIR>/guard.jsonl，一行一条（时间/来源/命中词/原文截断）。
export function guardLog(dir, o) {
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, 'guard.jsonl'), JSON.stringify({ at: Date.now(), ...o }) + '\n');
  } catch {}
}
