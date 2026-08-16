# PLAN — Fix lentitud opencode/OpenChamber (16/08/2026)

## Contexto
- 6+ procesos opencode compartiendo opencode.db 3.93GB (event 67K/1.47GB, message 122K, part 408K) → stalls DB, /session cuelga.
- Boot managed ~2.5-3min: warmup serial multi-directorio; app instalada (asar 14/08 22:35) SIN los fixes del fork (77d51d207: WARMUP_CONCURRENCY=2, filtro worktrees, timeout 5s; dd02d2e16: session merge paralelo).
- Duplicación MCP 4x via self-connections /event; tormenta proxy 'socket hang up' en main.log.
- Config CLI: 20 MCP + SessionStart hook a script inexistente.

## Fases
1. [DONE] Wave0: auditoría (procesos, DB, logs, fork, proxy).
2. [DONE] Wave2: poda backups (11.5+1.6+1.7GB) + magic-context 131MB + session_diff >20MB (238MB) + prune events (67K→49K, 3.93→3.69GB). Script prune reparado (bloque duplicado, línea truncada).
3. [DONE] Wave4: rebuild main.mjs + repack app.asar (--unpack node_modules, 2.5MB) + sync packages/web -> @openchamber/web (warmup paralelo, session-merge, health tolerance, scoped-config). Backups: app.asar.bak-20260816-pre-sync + unpacked.bak.
4. [DONE] Wave3: OpenChamber relanzado 12:20. PushWatcher connected en 1s (antes 2.5min). Gate /session 200 OK 3-90ms (28KB). 0 proxy errors. Health flapping (contention DB con 2 TUIs + managed) -> restart ciclico rapido OK.
5. [DONE] Wave5: hook SessionStart roto eliminado de opencode.jsonc.
6. [DONE] QA: gate estable 3x, 0 proxy errors, boot 1s. Pendiente: ver UI en vivo.

## Nota previa (sesión 15/08 23:45)
- 11 AppHangB1 de OpenChamber.exe (20:31-23:39): el main de Electron se cuelga → proxy deja de procesar → socket hang up → UI congelada → se recupera → repite.

