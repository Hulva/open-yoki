#!/usr/bin/env bash
# open-yoki 本机联调启动器 (MODE=test)
# 密钥运行时从 Hermes config 读取, 不落盘; 嘴=智谱 glm-5.3-flash, 心=同通道, 声=edge-tts(免费)
cd "$(dirname "$0")/app" || exit 1

ZHIPU_KEY=$(python3 -c "import yaml;print(yaml.safe_load(open('/home/luva/.hermes/config.yaml'))['providers']['zhipu-coding']['api_key'])" 2>/dev/null)
[ -z "$ZHIPU_KEY" ] && { echo "no zhipu key from hermes config"; exit 1; }

export IDOL=${IDOL:-example} AVATAR=${AVATAR:-mock} MODE=test
export LIVE2D_MODEL=${LIVE2D_MODEL:-/live2d/hiyori/Hiyori.model3.json}
export MARKET_OFF=${MARKET_OFF:-1} NEWS_OFF=${NEWS_OFF:-1}
# 智谱 flash 首包慢, 放宽嘴的超时(默认12s/30s)
export MOUTH_TIMEOUT_MS=${MOUTH_TIMEOUT_MS:-45000}
export MOUTH_TIMEOUT_LONG_MS=${MOUTH_TIMEOUT_LONG_MS:-90000}
# 嘴: DeepSeek 兼容直连 -> 智谱
export HEART_KEY_DS="$ZHIPU_KEY"
export MOUTH_DS=glm-5.3-flash
export MOUTH_DS_BASE=https://open.bigmodel.cn/api/coding/paas/v4
# 心: 同通道 (web 工具关闭, 联调不等上网)
export HEART_DS_BASE=https://open.bigmodel.cn/api/coding/paas/v4
export HEART_DS_LIVE=glm-5.3-flash
export HEART_DS_DAY=glm-5.3-flash
export HEART_WEB=0
export HEART_HOME=/home/luva/ai_video/open-yoki/data/heart
export HEART_STATE=/home/luva/ai_video/open-yoki/data/heart-state
export HEART_TEMPLATE=/home/luva/ai_video/open-yoki/heart-template
# 声音: edge-tts 免费档
export VOICE_PROVIDER=edge
export EDGE_VOICE=zh-CN-XiaoxiaoNeural
export EDGE_TTS_BIN=/usr/local/lib/hermes-agent/venv/bin/edge-tts

exec node server/index.mjs
