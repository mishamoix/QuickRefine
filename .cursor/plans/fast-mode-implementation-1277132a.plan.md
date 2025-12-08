---
name: Fast Mode Implementation Specification
overview: ""
todos:
  - id: 696b4091-3d4c-4f3b-a8ea-499720bd52a3
    content: Create prompts/fast_mode.md with single-shot proofreading prompt
    status: pending
  - id: d7f05f70-7dff-40cb-b17b-1b37a7e4e86a
    content: Add fastModeEnhance function and schema to src/libs/llm.ts
    status: pending
  - id: 20c4aa1c-d391-4f19-b80a-fb80cdd04551
    content: Update src/libs/prompts.ts to load fast mode prompt
    status: pending
  - id: 96a2a8a5-33f8-453e-9761-aa64aa4d58f4
    content: Create src/app/api/enhance/fast/route.ts endpoint
    status: pending
  - id: ffb1e1b0-ea29-4748-89cc-3330fd720915
    content: Add Fast Mode toggle to TextAnalyzer component with localStorage persistence
    status: pending
  - id: ac044829-0e99-4196-9518-7053504f4e50
    content: Implement mode-based API call switching in TextAnalyzer
    status: pending
  - id: e1ee21ca-2ff1-4f17-8e93-30845e369660
    content: Add conditional rendering for fast mode vs classic mode results
    status: pending
  - id: 3c5c1de9-4a72-4b5b-a5d2-4ad9c1ec2122
    content: Test both modes, edge cases, and mode switching behavior
    status: pending
---

# Fast Mode Implementation Specification

## Overview

Add Fast Mode - a single-shot LLM proofreading mode that returns all corrections and explanations in one formatted text response, as an alternative to the current two-step (fix + explain) process.

## 1. UI Changes

### 1.1 Toggle Component (`src/components/TextAnalyzer.tsx`)

- Add Fast Mode toggle above the textarea (lines 118-119)
- Toggle component:
                                                                                                                                - Label: "Fast Mode" with tooltip/description
                                                                                                                                - Position: Above textarea, aligned right or centered
                                                                                                                                - Styling: DaisyUI toggle class
                                                                                                                                - State: `const [isFastMode, setIsFastMode] = useState(false)`

### 1.2 Mode Persistence

- Save mode to localStorage on toggle change:
  ```ts
  localStorage.setItem('text_analyzer_mode', isFastMode ? 'fast' : 'classic')
  ```

- Restore on component mount (in existing useEffect around line 30)

### 1.3 Clear Results on Mode Switch

- When toggle changes, clear:
                                                                                                                                - `data` (mutation result)
                                                                                                                                - `error` (mutation error)
- Keep `currentText` (user input) unchanged
- Implementation: Reset react-query mutation state

### 1.4 Block Requests During Pending

- Disable toggle when `isPending === true`
- Show loading state on toggle or lock it
- Prevent mode switch while request is in progress

### 1.5 Results Display

- **Classic Mode** (current): Show corrected text box + detailed mistakes cards (lines 178-242)
- **Fast Mode**: Show single formatted text area/card with the complete response
                                                                                                                                - No need for "copy" button (user can select/copy directly)
                                                                                                                                - Simple card with pre-formatted text or markdown rendering
                                                                                                                                - Display the complete text from API response

## 2. API Changes

### 2.1 New Endpoint (`src/app/api/enhance/fast/route.ts`)

- Create new file mirroring structure of `src/app/api/enhance/route.ts`
- Same authentication, validation, and user checks
- Differences:
                                                                                                                                - Single LLM call using new prompt
                                                                                                                                - Return schema: `{ text: string }` (just one property)
                                                                                                                                - Trace name: `'enhance-request-fast'`
                                                                                                                                - Generation name: `'fast-mode'`

### 2.2 Response Schema

```ts
{
  text: string  // Complete formatted response with corrections and explanations
}
```

## 3. LLM Integration

### 3.1 New Prompt (`prompts/fast_mode.md`)

Create new prompt that:

- Checks if text is English (same as fix_text.md)
- Returns error if not: `{"error":"I can't understand you 🥹"}`
- If text is correct: Return encouraging message like "No mistakes! Text is excellent."
- If text has mistakes: Return formatted text containing:

                                                                                                                                1. Corrected version with **bold** highlights on corrections
                                                                                                                                2. List of mistakes with explanations below

- Format example:
  ```
  **Corrected Text:**
  Yesterday **morning**, **I went** to the store...
  
  **Mistakes Found:**
  1. "monday" → "morning": Wrong word in context...
  2. "I going" → "I went": Past action requires simple past tense...
  ```


### 3.2 New LLM Function (`src/libs/llm.ts`)

Add function:

```ts
export async function fastModeEnhance(
  text: string,
  prompt: string,
  traceGeneration?: any
): Promise<LLMResponse<z.infer<typeof fastModeSchema>>>
```

New schema:

```ts
const fastModeSchema = z.object({
  text: z.string(),
  error: z.string().optional(),
});
```

### 3.3 Prompt Loading (`src/libs/prompts.ts`)

- Add function to load fast mode prompt
- Or extend `loadEnhancePrompts()` to include fast mode prompt

## 4. Frontend Integration

### 4.1 API Call Logic (`src/components/TextAnalyzer.tsx`)

- Modify mutation to check `isFastMode`
- If fast mode: POST to `/api/enhance/fast`
- If classic mode: POST to `/api/enhance` (current)

### 4.2 TypeScript Types (`src/app/models/index.ts`)

Add new types:

```ts
export interface FastModeResponse {
  text: string;
}

export type ApiResponse = EnhancedText | FastModeResponse;
```

## 5. Implementation Steps

1. Create `prompts/fast_mode.md` with single-shot prompt
2. Update `src/libs/llm.ts` with fast mode schema and function
3. Update `src/libs/prompts.ts` to load fast mode prompt
4. Create `src/app/api/enhance/fast/route.ts` endpoint
5. Add Fast Mode toggle UI to `src/components/TextAnalyzer.tsx`
6. Add localStorage persistence for mode
7. Add mode-based API call switching
8. Add conditional results rendering (classic vs fast)
9. Test both modes thoroughly

## 6. Edge Cases & Validation

- Mode switch during pending request: Block toggle
- localStorage not available: Default to classic mode
- Fast mode returns error: Display same as classic mode
- Empty/no mistakes in fast mode: Show success message
- Switching modes: Clear previous results but keep input text

## 7. Files to Modify/Create

**New Files:**

- `prompts/fast_mode.md`
- `src/app/api/enhance/fast/route.ts`

**Modified Files:**

- `src/components/TextAnalyzer.tsx` (toggle, state, API calls, rendering)
- `src/libs/llm.ts` (new function and schema)
- `src/libs/prompts.ts` (load fast mode prompt)
- `src/app/models/index.ts` (types, if needed)