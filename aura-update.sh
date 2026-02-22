#!/bin/bash

echo "🚀 AURA.Z — AGGIORNAMENTO TOTALE IN CORSO..."
echo "--------------------------------------------"

# 1) CHECK FILES
echo "📁 Controllo struttura AURA.Z..."
REQUIRED_FILES=(
  "index.html"
  "organismo.html"
  "dashboard.html"
  "campagne.html"
  "style.css"
  "script.js"
  "data/organism.json"
  "data/dashboard.json"
  "data/campaigns.json"
)

for f in "${REQUIRED_FILES[@]}"; do
  if [ -f "$f" ]; then
    echo "✔ $f OK"
  else
    echo "❌ MANCANTE: $f"
  fi
done

# 2) SYNC xCLOUD → AURA.Z
echo ""
echo "🔄 Sincronizzazione xCLOUD → AURA.Z..."
cd xCLOUD-by-zdos
npm run aura:sync
cd ..

# 3) PUSH SU GITHUB
echo ""
echo "⬆️  Aggiornamento GitHub Pages..."
git add .
git commit -m "AURA.Z — aggiornamento totale automatico"
git push

# 4) AVVIO BOT DISCORD
echo ""
echo "🤖 Avvio bot Discord..."
cd xCLOUD-by-zdos
npm run aura:bot &
cd ..

# 5) NOTIFICA DISCORD (se configurata)
if [ ! -z "$DISCORD_NOTIFY_CHANNEL" ]; then
  echo ""
  echo "📡 Invio notifica Discord..."
  curl -H "Content-Type: application/json" \
       -X POST \
       -d "{\"content\": \"✔ AURA.Z aggiornato al 100%\"}" \
       "https://discord.com/api/v10/channels/$DISCORD_NOTIFY_CHANNEL/messages" \
       -H "Authorization: Bot $DISCORD_TOKEN"
fi

echo ""
echo "🏁 COMPLETATO — AURA.Z È ORA AL 100% OPERATIVO"
