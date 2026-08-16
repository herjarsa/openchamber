# Graph Report - wt-jira  (2026-08-14)

## Corpus Check
- 2502 files · ~2,692,199 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1783 nodes · 2531 edges · 87 communities (82 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ef35a16d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]

## God Nodes (most connected - your core abstractions)
1. `Changelog` - 136 edges
2. `scripts` - 66 edges
3. `ChatViewProvider` - 33 edges
4. `SessionMessageLoader` - 30 edges
5. `scripts` - 22 edges
6. `handleEvent()` - 21 edges
7. `optimisticSend()` - 17 edges
8. `applyDirectoryEvent()` - 16 edges
9. `getSessionDirectory()` - 16 edges
10. `build` - 15 edges

## Surprising Connections (you probably didn't know these)
- `validateActiveRuntimeSession()` --calls--> `runtimeFetch`  [INFERRED]
  packages/ui/src/apps/mobileConnections.ts → packages/ui/src/components/chat/markdown/markdownImageAssets.test.ts
- `refreshActiveConnectionCandidates()` --calls--> `runtimeFetch`  [INFERRED]
  packages/ui/src/apps/mobileConnections.ts → packages/ui/src/components/chat/markdown/markdownImageAssets.test.ts
- `resolveWorkspaceMarkdownImageSource()` --calls--> `runtimeFetch`  [INFERRED]
  packages/ui/src/components/chat/markdown/markdownImageAssets.ts → packages/ui/src/components/chat/markdown/markdownImageAssets.test.ts
- `notifyMessageSent()` --calls--> `runtimeFetch`  [INFERRED]
  packages/ui/src/sync/session-ui-store.ts → packages/ui/src/components/chat/markdown/markdownImageAssets.test.ts
- `parse()` --calls--> `parseFileReference()`  [EXTRACTED]
  packages/ui/src/components/chat/MarkdownRendererImpl.test.ts → packages/ui/src/components/chat/fileReferenceParser.ts

## Import Cycles
- 3-file cycle: `packages/ui/src/sync/session-actions.ts -> packages/ui/src/sync/session-ui-store.ts -> packages/ui/src/sync/sync-context.tsx -> packages/ui/src/sync/session-actions.ts`

## Communities (87 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.01
Nodes (136): [1.0.1] - 2025-12-07, [1.0.2] - 2025-12-07, [1.0.3] - 2025-12-07, [1.0.4] - 2025-12-07, [1.0.5] - 2025-12-07, [1.0.6] - 2025-12-08, [1.0.7] - 2025-12-08, [1.0.8] - 2025-12-08 (+128 more)

### Community 1 - "Community 1"
Cohesion: 0.02
Nodes (117): [1.10.0] - 2026-05-05, [1.10.1] - 2026-05-06, [1.10.2] - 2026-05-07, [1.10.3] - 2026-05-08, [1.10.4] - 2026-05-09, [1.11.0] - 2026-05-14, [1.11.1] - 2026-05-15, [1.11.2] - 2026-05-18 (+109 more)

### Community 2 - "Community 2"
Cohesion: 0.03
Nodes (74): dependencies, @aparajita/capacitor-secure-storage, @base-ui/react, beautiful-mermaid, @capacitor/app, @capacitor/core, @capacitor/keyboard, @capacitor/push-notifications (+66 more)

### Community 3 - "Community 3"
Cohesion: 0.03
Nodes (66): scripts, build, build:electron, build:mobile, build:ui, build:web, changelog-card, clean (+58 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (57): dependencies, @base-ui/react, bun-pty, class-variance-authority, clsx, cmdk, @codemirror/autocomplete, @codemirror/commands (+49 more)

### Community 5 - "Community 5"
Cohesion: 0.04
Nodes (55): devDependencies, autoprefixer, @base-ui/react, class-variance-authority, clsx, cmdk, @codemirror/lang-cpp, @codemirror/lang-go (+47 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (37): applyInitialTheme(), bootstrapLocale, bootstrapMessages, buildNotificationVariables(), buildProxiedResponse(), claimOpenChamberNotification(), ConnectionStatus, decodeBase64() (+29 more)

### Community 7 - "Community 7"
Cohesion: 0.05
Nodes (35): setActionRefs(), assertSdkSuccess(), createEventRoutingIndex(), DirectoryEventBatch, DirectorySessionStatusSnapshot, EMPTY_MESSAGES, EMPTY_PARTS, EMPTY_PERMISSION_REQUESTS (+27 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (41): author, dependencies, electron-context-menu, electron-log, electron-updater, @openchamber/web, description, desktopPrerequisites (+33 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (38): ArchiveSessionsOptions, createSession(), DeleteSessionOptions, DeleteSessionsOptions, UnarchiveSessionsOptions, activateConfigForDirectory(), activeSessionByRuntime, AssistantMessageSessionExecution (+30 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (3): ActiveEditorFilePayload, ChatViewProvider, isSameActiveEditorFilePayload()

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (38): abortCurrentOperation(), ascendingId(), assertSdkSuccess(), dir(), DirectoryStoreApi, dirStore(), dirStoreForDirectory(), dirStoreForSession() (+30 more)

### Community 12 - "Community 12"
Cohesion: 0.07
Nodes (28): AutoConnectOutcome, buildCandidatesFromInput(), CandidateRefreshResult, ChosenTransport, createMobilePasswordOperationTracker(), directCandidatesFromUrl(), getMobileDeviceId(), LiveTransport (+20 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (25): DEFAULT_IGNORED_DIR_NAMES, DialogsProps, FileLineEnding, FileNode, FileRow(), FileRowProps, FileStatSnapshot, FileStatus (+17 more)

### Community 14 - "Community 14"
Cohesion: 0.08
Nodes (26): blockMathExtension, escapeAttr(), estimateMarkdownImageCandidateCacheEntryBytes(), extractMarkdownImageCandidates(), getMarkdownImageCandidates(), getMarkdownImageFilename(), hasOpenFence(), hasReferenceDefinitions() (+18 more)

### Community 15 - "Community 15"
Cohesion: 0.07
Nodes (29): devDependencies, autoprefixer, babel-plugin-react-compiler, @clack/prompts, concurrently, cors, cross-env, eslint (+21 more)

### Community 16 - "Community 16"
Cohesion: 0.12
Nodes (19): applyCodeBlockWrapState(), applyMarkdownCodeBlockWrapState(), buildTableMenu(), decorateCodeBlocks(), DecorateContext, decorateImageLabels(), decorateInlineCode(), DecorateLabels (+11 more)

### Community 17 - "Community 17"
Cohesion: 0.07
Nodes (27): Adding a new event type, Anti-patterns, Blocking-request (question/permission) reply routing, Directory bootstrap scheduling, Directory-less session events, Directory-scoped session list, Event → field mapping, Global session list (+19 more)

### Community 18 - "Community 18"
Cohesion: 0.09
Nodes (22): assertSdkSuccess(), CONSTRAINED_INITIAL_PAGE_EXPANSION_LIMITS, createDefaultState(), DirectoryStoreSetter, EMPTY_SESSION_MESSAGE_LOAD_STATE, FetchedPage, filterIdentifiedParts(), formatSdkError() (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.11
Nodes (19): isAbsoluteReferencePath(), normalizeReferencePath(), DEFAULT_MERMAID_CONTROLS, FILE_REFERENCE_STAT_CACHE, fileReferenceExists(), getFileReferenceStatCacheMax(), getResolvedReference(), hasFileExtension() (+11 more)

### Community 20 - "Community 20"
Cohesion: 0.08
Nodes (17): AssistantMessageActionButtons, AssistantMessageActionButtonsProps, AssistantMessageBody, CONTAIN_LAYOUT_STYLE, InteractiveTurnChangedFilePills, MESSAGE_FOOTER_CONTAINER_STYLE, MessageBody, MessageBodyProps (+9 more)

### Community 21 - "Community 21"
Cohesion: 0.14
Nodes (17): collectMarkdownLinesOutsideCode(), findClosingBracket(), findInlineImageEnd(), hasImageSignature(), inspectImage(), isEscapedAt(), isWithin(), markdownImageSources() (+9 more)

### Community 22 - "Community 22"
Cohesion: 0.13
Nodes (23): ACTIVE_TOOL_STATUSES, filterMaterializedParts(), FINAL_TOOL_STATUSES, getPartEndTime(), getPartStateAttachments(), getPartStateTime(), getSessionMaterializationStatus(), getStringField() (+15 more)

### Community 24 - "Community 24"
Cohesion: 0.08
Nodes (24): devDependencies, autoprefixer, concurrently, cors, cross-env, eslint, @eslint/js, eslint-plugin-react-hooks (+16 more)

### Community 25 - "Community 25"
Cohesion: 0.09
Nodes (23): dependencies, adm-zip, bun-pty, @clack/prompts, compression, cron-parser, express, http-proxy-middleware (+15 more)

### Community 26 - "Community 26"
Cohesion: 0.12
Nodes (17): DetectedUpstream, formatElapsedDuration(), getPrVisualState(), getTrackingRemoteName(), MergeMethod, normalizeBranchRef(), pickInitialPrRemote(), PR_ACTION_REFRESH_DELAYS_MS (+9 more)

### Community 27 - "Community 27"
Cohesion: 0.09
Nodes (17): deletedCleanupIdentities, globalRemovedSessionIds, globalUpsertedSessions, inputState, mockScopedClient, mockSdk, movedSessionDirectories, OptimisticAddCall (+9 more)

### Community 28 - "Community 28"
Cohesion: 0.14
Nodes (21): applyGlobalProject(), reduceGlobalEvent(), getSessionMaterializationRequestKey(), getStaleRunningToolMessageID(), isSessionMaterializationStillNeeded(), asOptionalString(), childStoreHasMessagePartState(), childStoreHasSessionState() (+13 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (17): MarkdownImageGallery(), useAssetAuth(), MarkdownImageCandidate, blobToDataUrl(), getPreparedMarkdownImageUrl(), hasImageSignature(), isLocalMarkdownImageSource(), parseLocalImagePath() (+9 more)

### Community 30 - "Community 30"
Cohesion: 0.16
Nodes (19): appendNonOverlappingDelta(), applyDirectoryEvent(), areJsonEquivalent(), areMessageUpdateFieldsEqual(), areSessionStatusesEqual(), cleanupSessionCaches(), DedupeMetadata, DELTA_OVERLAP_FIELDS (+11 more)

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (20): useAllLiveSessions(), useAllSessionStatuses(), useChildStoreManager(), useDirectoryStore(), useEnsureSessionMessages(), useLiveSyncSelector(), useSession(), useSessionDirectory() (+12 more)

### Community 32 - "Community 32"
Cohesion: 0.11
Nodes (18): author, description, engines, node, keywords, license, name, overrides (+10 more)

### Community 33 - "Community 33"
Cohesion: 0.16
Nodes (11): areRecordsEqual(), buildRevertedMessageDockState(), EMPTY_PARTS, EMPTY_REVERTED_MESSAGE_DOCK_STATE, EMPTY_REVERTED_RECORDS, isUserMessage(), RevertedMessageDockState, RevertedMessageRecord (+3 more)

### Community 34 - "Community 34"
Cohesion: 0.19
Nodes (17): autoConnectLastInstance(), deleteMobileConnection(), deleteSecureToken(), findActiveConnection(), getAutoConnectTargetLabel(), isActiveRuntimeConnection(), probeConnectionCandidates(), readConnections() (+9 more)

### Community 35 - "Community 35"
Cohesion: 0.12
Nodes (16): activationEvents, categories, description, displayName, engines, vscode, icon, keywords (+8 more)

### Community 36 - "Community 36"
Cohesion: 0.26
Nodes (15): assertSdkData(), connectionLostError(), dismissOpenQuestionsForSession(), dismissPermission(), getRequestReplyClient(), isPermissionRequestNotFoundError(), isQuestionRequestNotFoundError(), recoverStaleBlockingRequest() (+7 more)

### Community 37 - "Community 37"
Cohesion: 0.18
Nodes (10): areRecordsEqual(), buildUserMessageHistorySnapshot(), EMPTY_HISTORY, EMPTY_PARTS, EMPTY_RECORDS, EMPTY_USER_MESSAGE_HISTORY_SNAPSHOT, getFirstTextFromParts(), getPartText() (+2 more)

### Community 38 - "Community 38"
Cohesion: 0.23
Nodes (12): KNOWN_BASENAME_PATTERN, KNOWN_FILE_BASENAMES, localPathFromFileUrl(), ParsedFileReference, parseFileReference(), stripTrailingReference(), trimPathCandidate(), extractPathCandidateFromElement() (+4 more)

### Community 39 - "Community 39"
Cohesion: 0.24
Nodes (13): browserFetchRequest(), establishLiveTransport(), getJsonRequestData(), logConnect(), logMobileConnectEvent(), nativeHttpRequest(), normalizeConnectionUrl(), probeRelaySession() (+5 more)

### Community 40 - "Community 40"
Cohesion: 0.21
Nodes (6): containsAllPartsByID(), filterIdentifiedParts(), mergeOptimisticPage(), mergeParts(), MessagePage, OptimisticItem

### Community 41 - "Community 41"
Cohesion: 0.28
Nodes (13): archiveSession(), archiveSessions(), cleanupReviewMetadataBeforeDelete(), cleanupSessionWorktreeMetadata(), deleteSession(), deleteSessionInDirectory(), deleteSessions(), finalizeConfirmedSessionDeletion() (+5 more)

### Community 42 - "Community 42"
Cohesion: 0.15
Nodes (13): contributes, commands, menus, submenus, views, viewsContainers, editor/context, editor/title (+5 more)

### Community 43 - "Community 43"
Cohesion: 0.15
Nodes (13): scripts, build, build:extension, build:webview, dev, dev:webview, lint, package (+5 more)

### Community 44 - "Community 44"
Cohesion: 0.17
Nodes (12): mac, CFBundleIconName, artifactName, category, entitlements, entitlementsInherit, extendInfo, gatekeeperAssess (+4 more)

### Community 45 - "Community 45"
Cohesion: 0.17
Nodes (11): main, name, private, scripts, build, dev, lint, test (+3 more)

### Community 46 - "Community 46"
Cohesion: 0.17
Nodes (11): bin, openchamber, files, main, name, private, publishConfig, access (+3 more)

### Community 47 - "Community 47"
Cohesion: 0.29
Nodes (11): markdownContentClassName(), MarkdownRendererImpl(), SimpleMarkdownRendererImpl(), useCurrentMermaidTheme(), useDecorateContext(), useExternalLinkInteractions(), useFileReferenceInteractions(), useMermaidInlineInteractions() (+3 more)

### Community 48 - "Community 48"
Cohesion: 0.29
Nodes (7): createDevTunnelClient(), listen(), startDevServer(), started, startHost(), stopServer(), trackSockets()

### Community 49 - "Community 49"
Cohesion: 0.18
Nodes (11): build, afterPack, appId, artifactName, directories, extraResources, files, npmRebuild (+3 more)

### Community 50 - "Community 50"
Cohesion: 0.25
Nodes (11): findSessionDirectoryInChildStores(), getGlobalSessionSnapshot(), getSessionDirectory(), mirrorSessionIntoLiveStores(), patchSessionMetadata(), setContextObligatoryMessage(), setLinkedIssue(), shareSession() (+3 more)

### Community 51 - "Community 51"
Cohesion: 0.18
Nodes (11): properties, title, configuration, default, description, type, default, description (+3 more)

### Community 52 - "Community 52"
Cohesion: 0.20
Nodes (10): dmg, backgroundColor, contents, iconSize, iconTextSize, sign, title, window (+2 more)

### Community 53 - "Community 53"
Cohesion: 0.31
Nodes (7): compareMessagesChronologically(), getCreatedAt(), insertMessageChronologically(), messagesBefore(), messagesFrom(), buildSessionMessageRecordsSnapshot(), getVisibleMessagesForSession()

### Community 54 - "Community 54"
Cohesion: 0.22
Nodes (10): getReusableSessionMessageRecordsSnapshot(), getSessionMessageRecordsCache(), getSessionMessageRecordsCacheKey(), hasTaskSessionIdentityChange(), isSuspendExemptShellBridge(), isTaskToolPart(), readCachedSessionMessageRecordsSnapshot(), readTaskSessionId() (+2 more)

### Community 55 - "Community 55"
Cohesion: 0.20
Nodes (10): useDirectorySync(), useParentSession(), useScopedBlockingPermissions(), useScopedBlockingQuestions(), useScopedBlockingRequests(), useSessionMessageCount(), useSessionMessagesResolved(), useSessionParts() (+2 more)

### Community 56 - "Community 56"
Cohesion: 0.20
Nodes (10): scripts, build, build:watch, dev, dev:server, dev:server:watch, lint, start (+2 more)

### Community 57 - "Community 57"
Cohesion: 0.25
Nodes (9): boundedSecure(), loadMobileConnections(), logDetail(), logStorage(), migrateLegacyInlineTokenRecords(), migrateLegacyInlineTokens(), readSecureToken(), withTimeout() (+1 more)

### Community 58 - "Community 58"
Cohesion: 0.22
Nodes (7): prepareLocalMarkdownImages(), PNG, requestPaths, resolver, runtimeFetch, TestFileReader, notifyMessageSent()

### Community 59 - "Community 59"
Cohesion: 0.22
Nodes (8): Chat Message Parts: Rendering Architecture, Current important behavior, High-level flow, "I want to change description for Perplexity" (example recipe), "I want tool to become expandable" (example), Quick map of files in this folder, Safe editing checklist, Which file controls what

### Community 60 - "Community 60"
Cohesion: 0.36
Nodes (6): ApiProxyResponsePayload, base64EncodeUtf8(), buildProxyJsonError(), buildUnavailableApiResponse(), normalizeFsProxyPath(), tryHandleLocalFsProxy()

### Community 61 - "Community 61"
Cohesion: 0.22
Nodes (9): devDependencies, concurrently, esbuild, @types/adm-zip, @types/vscode, typescript, vite, @vitejs/plugin-react (+1 more)

### Community 62 - "Community 62"
Cohesion: 0.29
Nodes (5): normalizePath(), toDirectoryListResult(), WebDirectoryEntry, WebDirectoryListResponse, WebFilesAPIOptions

### Community 63 - "Community 63"
Cohesion: 0.29
Nodes (8): ensureSanitizeHook(), exceedsLineLimit(), highlightCodeBlocks(), parseBlock(), renderMarkdownSync(), renderMathExpressions(), sanitize(), unescapeHtml()

### Community 64 - "Community 64"
Cohesion: 0.25
Nodes (8): getQuestionToastKey(), isViewedInCurrentSession(), isWindowFocused(), pruneExternallyViewedSessions(), resyncBlockingRequestsForActiveDirectory(), resyncBlockingRequestsForDirectory(), setExternallyViewedSession(), viewedSessionKey()

### Community 65 - "Community 65"
Cohesion: 0.36
Nodes (8): getSessionIdFromPayload(), ingestDirectoryStateIntoRoutingIndex(), removeIndexedMessage(), removeIndexedSession(), setIndexedMessage(), setIndexedSessionDirectory(), setIndexedSessionMessages(), updateRoutingIndexFromEvent()

### Community 66 - "Community 66"
Cohesion: 0.25
Nodes (8): dependencies, adm-zip, jsonc-parser, @openchamber/ui, @opencode-ai/sdk, react, react-dom, yaml

### Community 67 - "Community 67"
Cohesion: 0.33
Nodes (6): linux, artifactName, category, executableName, icon, target

### Community 68 - "Community 68"
Cohesion: 0.33
Nodes (6): nsis, installerHeaderIcon, installerIcon, oneClick, perMachine, uninstallerIcon

### Community 69 - "Community 69"
Cohesion: 0.33
Nodes (6): entry, Comment, Icon, Name, StartupWMClass, desktop

### Community 70 - "Community 70"
Cohesion: 0.53
Nodes (4): createParser(), escapeRawMarkdownHtml(), isLocalFileUrl(), MARKDOWN_FORBIDDEN_TAGS

### Community 71 - "Community 71"
Cohesion: 0.33
Nodes (5): Extension guideline, Purpose, Runtime modules, Shared webview message ordering, VS Code Backend Modules

### Community 72 - "Community 72"
Cohesion: 0.33
Nodes (6): applySessionStatusSnapshot(), getActiveSessionCandidateIds(), getViewedSessionMaterializationTarget(), materializeSessionFromServer(), resyncDirectoryAfterReconnect(), resyncDirectorySessionStatuses()

### Community 74 - "Community 74"
Cohesion: 0.50
Nodes (5): canonicalRelayUrl(), connectionDisplayUrl(), directCandidates(), refreshActiveConnectionCandidates(), relayCandidateOf()

### Community 75 - "Community 75"
Cohesion: 0.40
Nodes (5): win, artifactName, icon, target, verifyUpdateCodeSignature

### Community 79 - "Community 79"
Cohesion: 0.50
Nodes (4): publish, owner, provider, repo

### Community 80 - "Community 80"
Cohesion: 0.50
Nodes (3): Contract, Markdown Image Grants, Purpose

### Community 82 - "Community 82"
Cohesion: 0.67
Nodes (3): getConnectionStorageKey(), isSameConnectionUrl(), transportMatchesCurrentRuntime()

### Community 83 - "Community 83"
Cohesion: 0.67
Nodes (3): normalizeSubtaskModel(), UserSubtaskPart(), useSessionUIStore

### Community 86 - "Community 86"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **1001 isolated node(s):** `[Unreleased]`, `[1.18.4] - 2026-08-14`, `[1.18.3] - 2026-08-14`, `[1.18.2] - 2026-08-10`, `[1.18.1] - 2026-08-04` (+996 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `runtimeFetch` connect `Community 58` to `Community 74`, `Community 29`, `Community 39`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `notifyMessageSent()` connect `Community 58` to `Community 9`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `useSessionUIStore` connect `Community 83` to `Community 33`, `Community 7`, `Community 9`, `Community 11`, `Community 20`, `Community 26`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `[Unreleased]`, `[1.18.4] - 2026-08-14`, `[1.18.3] - 2026-08-14` to the rest of the system?**
  _1001 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.014598540145985401 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.01694915254237288 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.02702702702702703 - nodes in this community are weakly interconnected._