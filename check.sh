#!/usr/bin/env bash
# Ember — check.sh
#
# WHY THIS EXISTS
# 2026-10-27: a patch ate a newline at PosePro app.js:292, gluing a
# box-drawing comment rule onto a closing brace. The module failed to parse,
# NO event listeners attached, and the START button looked "inactive".
#
# `node --check app.js` returned EXIT 0 on that broken file, because app.js
# contains an `import` — Node treats a bare .js as CommonJS, bails at the
# import, and never reaches the real syntax error. Every "SYNTAX OK" printed
# before that outage came from a check that could not see the bug it existed
# to catch.
#
# So: validate as ESM (.mjs), and scan for glued punctuation.

set -uo pipefail
cd "$(dirname "$0")"
fail=0

echo "== ESM syntax validation =="
for f in *.js; do
  tmp="/tmp/ember_chk_$$.mjs"
  cp "$f" "$tmp"
  if out=$(node --check "$tmp" 2>&1); then
    echo "  OK   $f"
  else
    echo "  FAIL $f"
    echo "$out" | sed 's/^/       /'
    fail=1
  fi
  rm -f "$tmp"
done

echo "== glued-brace / glued-bracket scan =="
# a closing brace or bracket immediately followed by a non-ASCII rule or a
# letter with no separator => a patch ate a newline
if grep -nP '[}\]](\x{2500}-\x{257F}|[A-Za-z])' *.js 2>/dev/null; then
  echo "  FAIL glued punctuation found above"
  fail=1
else
  echo "  OK   no glued punctuation"
fi

echo "== required files =="
for f in index.html styles.css app.js deck.js limits.js audio.js version.js sw.js manifest.json icon.svg icon-192.png icon-512.png icon-maskable-512.png apple-touch-icon.png; do
  [ -f "$f" ] && echo "  OK   $f" || { echo "  MISSING $f"; fail=1; }
done

echo "== version consistency =="
vj=$(grep -oE '"version"[[:space:]]*:[[:space:]]*"[^"]+"' version.json | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
vv=$(grep -oE "'[0-9]+\.[0-9]+\.[0-9]+'" version.js | head -1 | tr -d "'")
echo "  version.js   = $vv"
echo "  version.json = $vj"
[ "$vv" = "$vj" ] && echo "  OK   match" || { echo "  FAIL mismatch"; fail=1; }

echo "== service worker cache name =="
grep -nE "^const CACHE" sw.js | sed 's/^/  /'

echo "== no private words in tracked files =="
# ⛔ This repo is public and every file is served from the live site. This gate
# exists because the names were removed once (v1.2.1) and then REINTRODUCED by
# my own code comments in v1.3.0 — a fix without a test is a fix that regresses.
# Words live in .privatewords, which is git-ignored, so the guard never commits
# the thing it is guarding against.
if [ -f .privatewords ]; then
  privfail=0
  while IFS= read -r w; do
    [ -z "$w" ] && continue
    hits=$(grep -rniI --exclude-dir=.git --exclude=.privatewords --exclude-dir=node_modules -- "$w" . 2>/dev/null)
    if [ -n "$hits" ]; then
      echo "  FAIL private word '$w' found:"
      printf '%s\n' "$hits" | sed 's/^/       /'
      privfail=1
    fi
  done < .privatewords
  [ "$privfail" -eq 0 ] && echo "  OK   none" || fail=1
else
  echo "  SKIP no .privatewords file"
fi

echo
[ "$fail" -eq 0 ] && echo "PASS — safe to push" || echo "FAIL — do not push"
exit "$fail"
