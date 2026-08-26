#!/usr/bin/env bash
# Every gate the project has to pass, in one run, with a GO / NO GO verdict.
#
# Kept deliberately small: this is a statically built site, so the gates that
# mean anything here are the ones that catch a broken page before it ships —
# lint, types, unit tests, and the build itself. There is no API to probe.
set -uo pipefail
cd "$(dirname "$0")/../.." || exit 1

green=$'\033[32m'; red=$'\033[31m'; off=$'\033[0m'
names=(); passes=(); fails=()

run() {
  local name="$1"; shift
  local out; out=$("$@" 2>&1); local code=$?
  local pass=0 fail=0

  case "$name" in
    "Lint")        pass=$(grep -c "" <<<"$out"); pass=$(( code == 0 ? 1 : 0 )); fail=$(( 1 - pass )) ;;
    "Unit tests")  pass=$(sed -n 's/.*Tests  *\([0-9]*\) passed.*/\1/p' <<<"$out" | tail -1)
                   fail=$(sed -n 's/.*Tests  *\([0-9]*\) failed.*/\1/p' <<<"$out" | tail -1) ;;
    *)             pass=$(( code == 0 ? 1 : 0 )); fail=$(( 1 - pass )) ;;
  esac

  names+=("$name"); passes+=("${pass:-0}"); fails+=("${fail:-0}")
  [ $code -ne 0 ] && printf '%s\n' "$out" | tail -20
  return $code
}

run "Lint"        npx eslint src
run "Type check"  npx tsc --noEmit
run "Unit tests"  npx vitest run
run "Build"       npm run build

echo
echo "===================================================="
echo "        RUN-ALL-CHECKS SUMMARY"
echo "===================================================="
printf "       %-18s %-7s %-7s %s\n" "TEST" "PASS" "FAIL" "STATUS"
echo "===================================================="

ok=0
for i in "${!names[@]}"; do
  if [ "${fails[$i]}" -eq 0 ]; then status="${green}GO${off}"; ok=$(( ok + 1 ))
  else status="${red}NO GO${off}"; fi
  printf "  %d. %-18s %-7s %-7s %b\n" "$(( i + 1 ))" "${names[$i]}" "${passes[$i]}" "${fails[$i]}" "$status"
done

echo "===================================================="
echo
echo "  Passed: $ok / ${#names[@]}"
if [ "$ok" -eq "${#names[@]}" ]; then
  echo -e "  OVERALL: ${green}GO${off}"; exit 0
fi
echo -e "  OVERALL: ${red}NO GO${off}"; exit 1
