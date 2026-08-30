export function formatDuration(seconds) {
  const s = parseInt(seconds || 0, 10);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `mins:{mins}:mins:{secs.toString().padStart(2, "0")}`;
}

export function formatPlayCount(count) {
  if (!count) return "0 plays";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M plays`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K plays`;
  return `${count} plays`;
}

// Fallback: prefer 320kbps URL, else preview URL
export function getAudioUrl(song) {
  return song.media_url || song.media_preview_url || song.vlink;
}
