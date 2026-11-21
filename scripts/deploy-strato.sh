#!/usr/bin/env bash
set -euo pipefail

: "${STRATO_SFTP_HOST:?Set STRATO_SFTP_HOST in the production environment}"
: "${STRATO_SFTP_USER:?Set STRATO_SFTP_USER in the production environment}"
: "${STRATO_SFTP_KNOWN_HOSTS:?Set STRATO_SFTP_KNOWN_HOSTS in the production environment}"
: "${STRATO_SFTP_PASSWORD:?Set STRATO_SFTP_PASSWORD in the production environment}"
if [[ ! "$STRATO_SFTP_HOST" =~ ^[A-Za-z0-9][A-Za-z0-9.-]*$ ]]; then
  echo 'Use the STRATO SFTP hostname without a scheme or port.' >&2
  exit 1
fi

umask 077
scratch=$(mktemp -d)
trap 'rm -rf -- "$scratch"' EXIT
printf '%s\n' "$STRATO_SFTP_KNOWN_HOSTS" > "$scratch/known_hosts"

cat > "$scratch/askpass" <<'ASKPASS'
#!/bin/sh
printf '%s\n' "$STRATO_SFTP_PASSWORD"
ASKPASS
chmod 700 "$scratch/askpass"
export STRATO_SFTP_PASSWORD

# Stage the commands for both editions before contacting STRATO.
for edition in miauabit meowabit; do
  build="dist/$edition"
  if [[ "$edition" == miauabit ]]; then
    privacy=datenschutz.html
  else
    privacy=privacy.html
  fi
  if [[ ! -s "$build/assets/style.css" || ! -s "$build/assets/journey.js" ]]; then
    echo "Build the website before uploading $build." >&2
    exit 1
  fi

  mkdir "$scratch/$edition"
  printf -- '-mkdir "%s"\nput -R "%s/assets" "%s"\n' "$edition" "$build" "$edition" >> "$scratch/upload"
  for page in impressum.html "$privacy" index.html; do
    if [[ ! -s "$build/$page" ]]; then
      echo "Missing build output $build/$page." >&2
      exit 1
    fi
    printf 'put "%s/%s" "%s/%s"\n' "$build" "$page" "$edition" "$page" >> "$scratch/pages"
    printf 'get "%s/%s" "%s/%s/%s"\n' "$edition" "$page" "$scratch" "$edition" "$page" >> "$scratch/verify"
  done
done
cat "$scratch/pages" "$scratch/verify" >> "$scratch/upload"

# Allow askpass to supply the password while retaining SFTP's stop-on-error batch commands.
SSH_ASKPASS="$scratch/askpass" SSH_ASKPASS_REQUIRE=force \
  sftp -F /dev/null -P 22 \
    -o "User=$STRATO_SFTP_USER" -o BatchMode=no \
    -o PreferredAuthentications=password,keyboard-interactive -o NumberOfPasswordPrompts=1 \
    -o StrictHostKeyChecking=yes -o UpdateHostKeys=no \
    -o "UserKnownHostsFile=$scratch/known_hosts" -o GlobalKnownHostsFile=/dev/null \
    -o ConnectTimeout=15 -o ServerAliveInterval=15 -o ServerAliveCountMax=3 \
    -b "$scratch/upload" "$STRATO_SFTP_HOST"

for edition in miauabit meowabit; do
  for downloaded in "$scratch/$edition/"*; do
    page=${downloaded##*/}
    if ! cmp -s "dist/$edition/$page" "$downloaded"; then
      echo "The uploaded $edition/$page differs from the local build." >&2
      exit 1
    fi
  done
done
echo 'Both STRATO editions uploaded and their HTML verified over SFTP.'
