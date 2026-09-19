# Uso diário do Antes do Pix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar os fluxos de resultado, entrada manual e scanner mais acionáveis no uso diário, preservando análise local, privacidade e acessibilidade.

**Architecture:** Uma função pura no domínio fornece próximos passos por nível de risco. As telas continuam responsáveis por apresentação, estado local e navegação; nenhum novo estado persistente será criado. O scanner só grava análise e oferece revisão quando a leitura contém uma entidade útil, como Pix ou URL.

**Tech Stack:** Expo SDK 57, React Native, TypeScript, Expo Router, Zustand, Jest e Testing Library React Native.

**Spec:** `docs/superpowers/specs/2026-09-19-uso-diario-design.md`

## Global Constraints

- A análise continua determinística e sem rede.
- Nenhum texto bruto será gravado em arquivo, log, histórico ou armazenamento persistente.
- Nenhuma ação inicia pagamento, acessa banco ou valida titularidade.
- Textos novos usam `allowFontScaling`, papéis acessíveis e não dependem de cor isoladamente.
- Animações existentes e novas respeitam `useReducedMotion`.
- A entrada manual permanece limitada a 5.000 caracteres.

## Review Focus

- Nível `possivelGolpe`: a orientação deve dizer para não pagar e confirmar por canal oficial; coberto no teste da função de próximos passos.
- Nível `baixoRisco`: a orientação não pode sugerir segurança garantida; coberto no teste da função de próximos passos.
- Resultado sem análise: a ação de nova conferência não pode quebrar o redirecionamento existente; coberto pelo teste já existente da tela e pelo teste de interação.
- Limpeza com erro visível: o campo deve zerar e remover o alerta; coberto no teste de `ManualScreen`.
- QR vazio, QR inválido e QR Pix válido: somente o último avança; coberto nos testes de `ScannerScreen`.

---

### Task 1: Próximos passos por nível de risco

**Files:**
- Create: `src/domain/analysis/nextSteps.ts`
- Test: `src/domain/analysis/__tests__/nextSteps.test.ts`

**Interfaces:**
- Produces `getNextSteps(level: RiskLevel): readonly NextStep[]`.
- `NextStep` has `title: string` and `description: string`.

- [ ] **Step 1: Write the failing test**

  Create `src/domain/analysis/__tests__/nextSteps.test.ts` with three cases that call `getNextSteps` for `possivelGolpe`, `atencao` and `baixoRisco`. Assert that the first result contains, respectively, `Não faça o pagamento`, `Pare` and `Confirme o beneficiário`, and that the low-risk text does not contain `seguro` or `garantido` as a promise.

- [ ] **Step 2: Run test to verify it fails**

  Run: `npm test -- --runInBand src/domain/analysis/__tests__/nextSteps.test.ts`

  Expected: FAIL because `src/domain/analysis/nextSteps.ts` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

  Add the `NextStep` interface and a `Record<RiskLevel, readonly NextStep[]>` containing two or three concrete, short steps per level. Export `getNextSteps` as a lookup function. Keep the copy informational and never use “golpe confirmado”, “seguro” or “100% confiável”.

- [ ] **Step 4: Run test to verify it passes**

  Run: `npm test -- --runInBand src/domain/analysis/__tests__/nextSteps.test.ts`

  Expected: the three tests pass.

- [ ] **Step 5: Commit**

  Run:

  ```bash
  git add src/domain/analysis/nextSteps.ts src/domain/analysis/__tests__/nextSteps.test.ts
  git commit -m "feat: orienta proximos passos por risco"
  ```

### Task 2: Card acionável e nova conferência no resultado

**Files:**
- Create: `src/components/NextStepsCard.tsx`
- Test: `src/components/__tests__/NextStepsCard.test.tsx`
- Modify: `src/app/result.tsx`
- Test: `src/app/__tests__/result.test.tsx`

**Interfaces:**
- `NextStepsCard` consumes `steps: readonly NextStep[]` and renders an accessible card titled `O que fazer agora`.
- `ResultScreen` consumes `getNextSteps(analysis.result.level)` and clears the analysis before `router.replace('/')` when `Conferir outro conteúdo` is pressed.

- [ ] **Step 1: Write the failing component and screen tests**

  In `NextStepsCard.test.tsx`, render two `NextStep` values and assert the title and both descriptions. In `result.test.tsx`, seed the store with `analyzeInput('Pague agora para resgatar seu prêmio.', 'manual')`, render the screen, assert `O que fazer agora`, press `Conferir outro conteúdo`, then assert the router replacement with `/` and `currentAnalysis` is `null`.

- [ ] **Step 2: Run tests to verify they fail**

  Run: `npm test -- --runInBand src/components/__tests__/NextStepsCard.test.tsx src/app/__tests__/result.test.tsx`

  Expected: FAIL because the component, result card and button do not exist.

- [ ] **Step 3: Write the minimal implementation**

  Create `NextStepsCard` with `accessibilityRole="text"`, icon plus text rows, `allowFontScaling`, existing colors/spacing and no animation. Import it in `result.tsx`, render it after the limitations card, and add the `handleNewAnalysis` action as `Conferir outro conteúdo` while keeping the existing behavior and share action intact.

- [ ] **Step 4: Run focused and full tests**

  Run:

  ```bash
  npm test -- --runInBand src/components/__tests__/NextStepsCard.test.tsx src/app/__tests__/result.test.tsx
  npm test -- --runInBand
  ```

  Expected: focused tests and the complete suite pass.

- [ ] **Step 5: Commit**

  Run:

  ```bash
  git add src/components/NextStepsCard.tsx src/components/__tests__/NextStepsCard.test.tsx src/app/result.tsx src/app/__tests__/result.test.tsx
  git commit -m "feat: mostra proximos passos no resultado"
  ```

### Task 3: Limpeza acessível da entrada manual

**Files:**
- Modify: `src/app/manual.tsx`
- Test: `src/app/__tests__/manual.test.tsx`

**Interfaces:**
- `ManualScreen` keeps `text` and `error` local, conditionally renders `Limpar campo`, and clearing sets `text` to `''` and `error` to `null`.

- [ ] **Step 1: Write the failing tests**

  Add one test that enters text, presses `Limpar campo`, and asserts the input value is empty, `0/5000` is shown and the button disappears. Add a second test that first triggers the empty-input error, then enters text, presses `Limpar campo`, and asserts the alert text disappears.

- [ ] **Step 2: Run tests to verify they fail**

  Run: `npm test -- --runInBand src/app/__tests__/manual.test.tsx`

  Expected: FAIL because `Limpar campo` is not rendered.

- [ ] **Step 3: Write the minimal implementation**

  Add an `AppButton` with label `Limpar campo`, quiet or secondary variant, and `onPress={() => { setText(''); setError(null); }}` only when `text.length > 0`. Keep the existing error and analysis behavior unchanged.

- [ ] **Step 4: Run focused and full tests**

  Run:

  ```bash
  npm test -- --runInBand src/app/__tests__/manual.test.tsx
  npm test -- --runInBand
  ```

  Expected: all manual tests and the complete suite pass.

- [ ] **Step 5: Commit**

  Run:

  ```bash
  git add src/app/manual.tsx src/app/__tests__/manual.test.tsx
  git commit -m "feat: permite limpar entrada manual"
  ```

### Task 4: Leitura de QR Code inválida

**Files:**
- Modify: `src/app/scanner.tsx`
- Test: `src/app/__tests__/scanner.test.tsx`

**Interfaces:**
- Scanner treats a QR analysis as useful when `analysis.input.pix` or `analysis.input.url` exists.
- Invalid non-empty scans set a local error, keep `hasScanned` false, do not call `setAnalysis`, and keep the camera retryable.

- [ ] **Step 1: Write the failing tests**

  Add a test for `data: '   '` that asserts no analysis and no navigation. Add a test for `data: 'codigo-sem-formato-pix'` that asserts the message `Este QR Code não parece ser um Pix ou link conferível.` and no `Conferir QR Code` button. Keep the existing valid Pix test as the regression case.

- [ ] **Step 2: Run tests to verify they fail**

  Run: `npm test -- --runInBand src/app/__tests__/scanner.test.tsx`

  Expected: the invalid non-empty scan test fails because the current scanner marks every non-empty code as found.

- [ ] **Step 3: Write the minimal implementation**

  Add `scanError` state. In `handleBarcodeScanned`, trim and return for empty data; call `analyzeInput(data, 'qrCode')`; if neither `analysis.input.pix` nor `analysis.input.url` exists, set the error and return without setting `hasScanned` or the store. For valid data, clear the error, set `hasScanned(true)` and store the analysis. Render the error as an accessible alert and keep the retry/close controls available.

- [ ] **Step 4: Run focused and full tests**

  Run:

  ```bash
  npm test -- --runInBand src/app/__tests__/scanner.test.tsx
  npm run check
  git diff --check
  ```

  Expected: scanner tests, typecheck and the complete suite pass; diff check is clean.

- [ ] **Step 5: Commit**

  Run:

  ```bash
  git add src/app/scanner.tsx src/app/__tests__/scanner.test.tsx
  git commit -m "fix: orienta sobre QR Code invalido"
  ```

## Final verification

- [ ] Run `npm run check` from the final tree.
- [ ] Run `git diff --check` from the final tree.
- [ ] Inspect `git status --short --branch` and `git log --oneline -5`.
- [ ] Confirm no production behavior outside the four scoped flows changed.
