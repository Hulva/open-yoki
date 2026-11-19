// Free Microsoft Edge TTS as a local-test voice (VOICE_PROVIDER=edge): same contract as doubaoVoice in
// voice.mjs — say(text, face, id, tone) -> { url: '/audio/<id>.mp3', durationMs } | null, plus the
// provider/used/dailyChars/usd/voiceId fields /api/health reads. Synthesizes with the edge-tts CLI
// (Python) and reads the real duration back with ffprobe. No key, no billing — the daily character
// cap (TTS_DAILY_CHARS) still applies so text budgets stay honest.
// Not for production: the endpoint is unofficial. Swap in Doubao (VOLC_API_KEY + DOUBAO_VOICE_ID)
// when she goes on air for real.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const run = (bin, args) => new Promise((res, rej) => {
  const p = spawn(bin, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  let err = '';
  p.stderr.on('data', d => { err += String(d); });
  p.on('error', rej);
  p.on('exit', c => (c === 0 ? res() : rej(new Error(`edge-tts ${c} ${err.slice(0, 120)}`))));
});

export function edgeVoice({ dir, dailyChars = 60000, voiceId = 'zh-CN-XiaoxiaoNeural', rate = '+0%',
  status, bin = 'edge-tts', ffprobe = 'ffprobe', now = () => Date.now(), keepFiles = 300 }) {
  fs.mkdirSync(dir, { recursive: true });
  let day = '', used = 0;
  const today = () => new Date(now() + 8 * 3600e3).toISOString().slice(0, 10);
  const room = text => { if (today() !== day) { day = today(); used = 0; } return used + text.length <= dailyChars; };
  const durationMs = file => new Promise(res => {
    const p = spawn(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { stdio: ['ignore', 'pipe', 'ignore'] });
    let out = '';
    p.stdout.on('data', d => { out += String(d); });
    p.on('error', () => res(null));
    p.on('exit', () => { const s = parseFloat(out.trim()); res(Number.isFinite(s) ? Math.round(s * 1000) : null); });
  });
  function prune() {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp3')).map(f => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs })).sort((a, b) => b.t - a.t);
    for (const { f } of files.slice(keepFiles)) fs.rmSync(path.join(dir, f), { force: true });
  }
  return {
    provider: 'edge',
    get used() { return used; },
    dailyChars, usd: 0, voiceId,
    async say(text, face, id, tone) {
      if (!room(text)) { status?.('voice', false, 'daily cap reached'); return null; }
      const file = `${id}.mp3`, full = path.join(dir, file);
      for (let attempt = 1; ; attempt++) {
        try {
          await run(bin, ['--voice', voiceId, '--rate', rate, '--text', text, '--write-media', full]);
          used += text.length; status?.('voice', true);
          break;
        } catch (err) {
          if (attempt >= 2) { status?.('voice', false, String(err.message || err).slice(0, 120)); return null; }
        }
      }
      prune();
      const ms = (await durationMs(full)) ?? Math.max(1500, text.length * 200);
      return { url: `/audio/${file}`, durationMs: ms };
    },
    async warm() {},
    async pcm() { return null; },
  };
}
