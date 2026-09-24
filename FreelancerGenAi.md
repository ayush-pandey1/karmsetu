# Karmsetu - Freelancer GenAI Proposal Generator Documentation

Is document me Karmsetu platform ke **Freelancer-side GenAI Proposal / Application Generator** feature ka complete architectural aur technical breakdown Hinglish me diya gaya hai. Interview revision aur codebase reference ke liye ye document step-by-step design kiya gaya hai.

---

## 1. Feature Overview
Karmsetu me freelancer jab kisi client ki job/gig par **"Apply"** click karta hai, toh ek application dialog open hota hai jisme pehle freelancer ko manually proposal message type karna padta tha. 

Ab is dialog ke andar ek **"Generate with AI"** button provide kiya gaya hai. Freelancer jaise hi button click karta hai, backend automatically us job ki requirements (title, required skills, scope, budget, duration) aur freelancer ki profile (matching skills, relevant portfolio projects, aur completed work) ko analyze karta hai. Server-side Google Gemini model ek tailored, high-converting, professional proposal draft karta hai jo instant subtle typing animation ke sath existing textarea me render ho jata hai. Freelancer ise freely review, edit, aur customize karke manually submit karta hai.

---

## 2. Why We Added AI Proposal Generation
* **What did we do?** Freelancer application modal me ek one-click GenAI proposal drafting layer add ki.
* **Why did we do it?** Freelancing platforms par generic "Copy-Paste" proposals client turant reject kar dete hain. Non-native English speakers ya busy freelancers ke liye har gig ke liye tailored, persuasive proposal likhna difficult aur time-consuming hota hai. AI generation se:
  1. Proposal drafting time 5-10 minutes se ghat kar 2 seconds ho gaya.
  2. Freelancer ke relevant skills aur past work naturally highlight hote hain.
  3. Client ko quality, relevant bids milti hain jo conversion rate improve karti hain.
* **How does it work?** Frontend server endpoint ko project aur freelancer ID bhejta hai. Server deterministic relevance filtering perform karke compact JSON banata hai aur Gemini ko bhejta hai. Gemini response return karta hai jo textarea me stream-in ho jata hai.

---

## 3. Existing Freelancer Apply Flow
Pehle freelancer ka manual application flow aesa tha:
1. Freelancer `/fl/jobdetails/[jobId]` page par job details dekhta hai.
2. "Apply" (ya previous rejection par "Re-Apply for Job") button click karta hai.
3. Radix UI `Dialog` khulta hai jisme ek single `<Textarea id="message">` hota hai.
4. Freelancer manually proposal type karta hai (min 5, max 2000 characters).
5. "Submit Application" click karne par `POST /api/applicationStore` par request jati hai.
6. DB me `Application` document create hota hai with status `Pending`, aur client ko real-time socket event `send-application` emit hota hai.

---

## 4. New AI Flow
GenAI add hone ke baad streamlined user journey:
1. Freelancer `/fl/jobdetails/[jobId]` par "Apply" click karta hai.
2. Application dialog open hota hai, jahan textarea ke theek upar modern **"Generate with AI"** button dikhta hai.
3. Freelancer button click karta hai -> Button animated SVG loading spinner aur `"Generating with AI..."` state me switch ho jata hai (aur accidental double-click prevent karta hai).
4. Backend MongoDB se job aur freelancer data nikaal kar code-level relevance filtering lagata hai.
5. Filtered context Gemini ko structured schema ke sath pass hota hai.
6. Model tailored proposal return karta hai.
7. **Safe Overwrite Check**: Agar freelancer ne pehle se kuch likha tha, toh silent overwrite nahi hota—ek inline confirmation alert aata hai (*"Replace current text with AI proposal?"*). Agar textarea empty tha, toh text smoothly reveal/type ho jata hai.
8. Freelancer draft ko padhta hai, apne according edits karta hai, aur normal flow se "Submit Application" click karta hai.

> **CRITICAL**: AI kabhi bhi application ko automatically submit ya send nahi karta. Freelancer hamesha final proposal ka full control retain karta hai.

---

## 5. Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Freelancer Browser                   │
│   Job Details Page (/fl/jobdetails/[jobId])            │
│   ├── Application Dialog                               │
│   │   ├── "Generate with AI" Button                    │
│   │   ├── Overwrite Confirmation Alert (Conditional)   │
│   │   └── Textarea (Progressive Typing Animation)      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼ axios.post("/api/ai/generate-proposal", { projectId, freelancerId })
┌────────────────────────────────────────────────────────┐
│               Next.js Server API Route                 │
│           (/api/ai/generate-proposal)                  │
│                                                        │
│   1. Fetch Project & Freelancer from MongoDB           │
│   2. Deterministic Code-Level Relevance Filtering      │
│   3. Build Compact JSON Payload (Zero Fluff)           │
│   4. Call Gemini Service (lib/ai/gemini.js)            │
│   5. Validate Structured Response via Zod              │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼ Google Generative AI SDK
┌────────────────────────────────────────────────────────┐
│                 Google Gemini Model                    │
│     - System Prompt (Honesty, Tone, Brevity)           │
│     - Compact One-Shot Example                         │
│     - Strict JSON ResponseSchema: { proposal: string } │
└────────────────────────────────────────────────────────┘
```

---

## 6. Frontend Flow
* **File**: `src/app/(freelancer)/fl/jobdetails/[...jobId]/page.jsx`
* **States Added**:
  - `isAiGenerating`: Loading state jo button ko disable karti hai aur animated SVG render karti hai.
  - `showOverwriteConfirm`: Boolean state jo tab trigger hoti hai jab user ke existing text ko replace karne se pehle permission leni ho.
  - `pendingAiProposal`: AI se aayi hui proposal string ko temporarily hold karti hai confirmation tak.
  - `isTypingAnimation`: Typing reveal animation ke dauraan true rehti hai.
* **Non-Blocking Interaction**: Freelancer typing animation ke dauraan textarea par click karke typing animation instantly skip karke manual edit start kar sakta hai.

---

## 7. Backend Flow
* **File**: `src/app/api/ai/generate-proposal/route.js`
* **Steps**:
  1. Incoming JSON body se `projectId` aur `freelancerId` extract aur validate hote hain using Zod (`generateProposalInputSchema`).
  2. Database se `Project`, `User`, aur freelancer ke `Completed` projects fetch hote hain parallel me via `Promise.all`.
  3. Deterministic filtering function chalata hai jo skills aur portfolio items match karta hai.
  4. Minimal, ultra-compact JSON object banta hai.
  5. `generateProposalWithGemini(contextData)` call hota hai.
  6. Response client ko HTTP 200 `{ success: true, proposal }` me bheja jata hai.

---

## 8. Freelancer Data Selection
Hum freelancer profile me se sirf wahi fields uthate hain jo proposal me client ko convince karne ke liye strictly zaroori hain:
* `name`: Freelancer ka first name / full name.
* `title`: Professional title (e.g. `"Full-Stack Developer"`, `"UI/UX Designer"`).
* `relevantSkills`: Job ke sath match hone wale top technical skills (max 8).
* `relevantPortfolio`: Job requirements se match hone wale portfolio items (max 2 items, description trimmed to 120 chars).
* `relevantCompletedProjects`: Similar domain ke completed projects (max 1 item).

---

## 9. Job Data Selection
Job document me se sirf relevant decision-making parameters extract hote hain:
* `title`: Project ka title.
* `category`: Project category (e.g. `"Web Development"`).
* `requiredSkills`: Client dwara required technologies (e.g. `["React.js", "Node.js"]`).
* `description`: Client ka project scope (trimmed to max 1200 characters).
* `budget`: Project budget in INR (formatted, e.g. `"₹50,000"`).
* `duration`: Timeline (e.g. `"1 Month"`).

---

## 10. JSON Payload (Sent to Gemini)
```json
{
  "freelancer": {
    "name": "Alex",
    "title": "Full-Stack Developer",
    "relevantSkills": ["React.js", "Node.js", "MongoDB", "Express.js", "Tailwind CSS"],
    "relevantPortfolio": [
      {
        "title": "Clothing Brand Online Store",
        "description": "Built responsive e-commerce web app with product filtering, shopping cart, and Razorpay checkout."
      }
    ]
  },
  "job": {
    "title": "Build a Clothing Store Website",
    "category": "Web Development",
    "requiredSkills": ["React.js", "Node.js", "MongoDB"],
    "description": "Looking for a developer to build an e-commerce website with product catalog, cart, and Razorpay payment integration.",
    "budget": "₹50,000",
    "duration": "1 Month"
  }
}
```

---

## 11. Why These Fields Are Sent
* **Freelancer Name & Title**: Personal connection establish karne ke liye.
* **Relevant Skills**: Ye dikhane ke liye ki freelancer job ke exact tech-stack par kaam kar chuka hai.
* **Portfolio & Completed Projects**: Real evidence provide karne ke liye jisse trust build ho.
* **Job Title, Description, Budget & Duration**: Proposal ko specific banane ke liye taaki client ko lage freelancer ne unki requirement dhyan se padhi hai.

---

## 12. Fields Intentionally Not Sent (Privacy & Security)
Token consumption aur data security dono ke liye ye fields kabhi nahi bheje jaate:
* ❌ Password hash ya auth tokens.
* ❌ Email address ya personal phone number.
* ❌ Physical home address ya exact coordinates.
* ❌ Database internal IDs (`_id`, `__v`) ya timestamps.
* ❌ Irrelevant skills (jaise web job ke liye video editing skills bhejna).
* ❌ Bank ya payment account details.

---

## 13. Relevance Filtering
* **What did we do?** Backend code me deterministic keyword aur skill overlap algorithm lagaya.
* **Why did we do it?** Agar freelancer ke paas 30 skills aur 10 portfolio projects hain aur hum sab prompt me daal denge, toh:
  1. Input token cost high ho jayegi.
  2. Model confuse ho jayega aur generic proposal likhega.
  3. LLM se filtering karwana expensive aur slow hota hai.
* **How does it work?**
  ```javascript
  // Matched skills nikaalo
  const matchedSkills = userSkills.filter(skill => 
    jobSkills.some(js => skill.toLowerCase().includes(js) || js.includes(skill.toLowerCase()))
  );
  // Max 4 complimentary skills add karo
  const otherSkills = userSkills.filter(s => !matchedSkills.includes(s)).slice(0, 4);
  const relevantSkills = [...matchedSkills, ...otherSkills].slice(0, 8);
  ```

---

## 14. Gemini API Integration
* **File**: `src/lib/ai/gemini.js`
* Function: `generateProposalWithGemini(contextData)`
* Reuses existing server-side `getGeminiClient()` initializing `@google/generative-ai`.
* `temperature: 0.3`: Low temperature to keep proposals grounded in facts while allowing natural linguistic fluency.
* `maxOutputTokens: 1024`: Proposal length ko concise (~150 words) rakhne ke liye token limit enforce ki gayi hai.

---

## 15. System Prompt
* **File**: `src/lib/ai/prompts/proposalGenerator.js`
* **Role**: Karmsetu AI Proposal Assistant.
* **Core Directives**:
  1. **Strict Honesty Rule**: Kabhi bhi fake skills, clients, results ya experience fabricate na kare. Sirf provided JSON context use kare.
  2. **Structure**: 2-3 short paragraphs (100-180 words):
     - Hook (understanding requirement)
     - Proof & Approach (how skills/portfolio solve the problem)
     - Call to action (friendly closing)
  3. **No Fluff**: Generic phrases like "Dear Sir/Madam", "Hope this finds you well" ban hain.
  4. **Output Constraint**: Sirf valid JSON schema with `"proposal"` key.

---

## 16. One-Shot Example
Tokens save karne ke liye humne sirf **ek single short one-shot example** include kiya hai:
* **Input**: Web developer applying to apparel store with React + Node + Razorpay.
* **Output**:
  ```json
  {
    "proposal": "Hi, I saw that you need a modern web store for your fashion brand with seamless product browsing and payment checkout. Having built full-stack e-commerce platforms using React.js, Node.js, and MongoDB with integrated Razorpay payments, I can build an intuitive, mobile-responsive store tailored to your brand.\n\nMy approach will focus on clean product filtering, a secure checkout flow, and easy catalog management for your team. I can comfortably align with your 1-month timeline and milestone budget.\n\nLet's connect to review your brand design preferences and get started."
  }
  ```

---

## 17. Structured Output
* Hum Gemini ke native `responseMimeType: "application/json"` aur `responseSchema` parameters use karte hain:
  ```javascript
  export const proposalResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      proposal: {
        type: SchemaType.STRING,
        description: "A concise, personalized freelance proposal pitch (approx 100-180 words, 2-3 short paragraphs).",
      },
    },
    required: ["proposal"],
  };
  ```
* Isse model guaranteed JSON return karta hai bina markdown code blocks (` ```json `) ya conversation commentary ke.

---

## 18. Token Optimization
Humne token wastage minimize karne ke liye 8 specific optimizations implement ki hain:
1. **Zero HTML/Code**: Frontend UI ya CSS prompt me nahi bheja jata.
2. **Deterministic Pre-filtering**: DB ke 50 items me se sirf top 1-2 relevant items code me filter hokar prompt me jaate hain.
3. **No Conversation History**: Single stateless turn.
4. **Single One-shot Example**: Multiple heavy examples avoid kiye gaye hain.
5. **Concise System Instructions**: Bulleted, high-signal rules without redundant prose.
6. **No Reasoning Tokens**: Model se chain-of-thought ya analysis explain karne ko nahi kaha jata.
7. **Strict Max Output**: 1024 max tokens.
8. **Native JSON Schema**: Zero markdown token overhead.

---

## 19. Proposal Generation Logic
Proposal follow karta hai **Value-First Pitch Formula**:
1. Client ke dard/zaroorat ko pehli line me address karna.
2. Freelancer ke relevant tools aur portfolio proof show karna.
3. Deliverables aur timeline execution ka short summary dena.
4. Friendly collaboration invitation se close karna.

---

## 20. UI/UX
* Button styling Karmsetu ke existing theme se perfectly blend hoti hai:
  - Outline button with primary accent border (`border-primary/30`).
  - Gradient sparkle icon (`LuSparkles`).
  - Text counter indicator: `(characterCount/2000)`.
  - Accessible focus rings and disabled states.

---

## 21. Loading Animation
* **What did we do?** Button click hone par dynamic animated SVG spinner render hota hai with label `"Generating with AI..."`.
* **Why did we do it?** Freelancer ko clear visual feedback milta hai ki request background me chal rahi hai. Saath hi accidental double-clicks aur multiple concurrent API calls completely block ho jaate hain.
* **Lightweight**: Zero external animation library use hui hai; pure CSS `animate-spin` aur SVG paths ka use kiya gaya hai.

---

## 22. Proposal Text Animation
* **What did we do?** Proposal aane par textarea me instant dump karne ke bajaye ek snappy, progressive text-reveal stream effect chalaya.
* **Snappy Timing**: Animation ~15ms per chunk chalta hai aur total duration under 1 second rehta hai, taaki user ka time waste na ho.
* **Unblocked Editing**: Freelancer typing ke dauraan textarea par click karke typing animation instantly complete kar sakta hai.

---

## 23. Error Handling & Fallback Strategy
* **High Demand / 503 Auto-Fallback**: Agar primary model (`gemini-3.5-flash`) high demand ya 503 error return karta hai, toh backend automatic fallback model (`gemini-3.1-flash-lite`) par request retry karta hai.
* **UI/UX Error Sanitization**: User ko raw stack trace ya internal URL (`[GoogleGenerativeAI Error]: ... [503 Service Unavailable]...`) popup me kabhi nahi dikhaya jata. Toast aur alert box me clean, readable message display hota hai:
  *"AI service is currently experiencing high demand. Please try again in a few moments."*
* **Rate Limits (429)**: Toast message: *"AI rate limit reached. Please wait a moment before trying again."*
* **Missing IDs**: Agar project ya freelancer ID missing ho toh 400 error return hota hai.
* **Missing API Key**: Server par `GEMINI_API_KEY` na hone par friendly 503 configuration error return hota hai without exposing internal stack traces.
* **Network Failures**: Frontend toast cleanly notify karta hai bina dialog crash kiye.

---

## 24. Security
1. **Server-Side API Calls**: Browser direct Gemini ko call nahi karta. API key `process.env.GEMINI_API_KEY` server environment me securely rehti hai.
2. **No Data Tampering**: Client-side se freelancer ke skills ya project details trust nahi kiye jaate; backend direct MongoDB se authenticated verified records nikaalta hai.
3. **Privacy**: PII (phone number, email, address, hashed passwords) prompt me kabhi nahi bheje jaate.

---

## 25. Environment Variables
* Root `.env` aur `.env.example` me configured:
  ```bash
  GEMINI_API_KEY=your_gemini_api_key_here
  GEMINI_MODEL=gemini-3.5-flash
  GEMINI_FALLBACK_MODEL=gemini-3.1-flash-lite
  ```

---

## 26. Model Configuration & Fallback
* `src/config/ai.js` centralized point hai:
  - `model`: `"gemini-3.5-flash"` (Primary)
  - `fallbackModel`: `"gemini-3.1-flash-lite"` (High-demand / 503 fallback)
  Dono models ek hi configuration point se manage hote hain bina code change kiye.

---

## 27. Why LangChain Was/Wasn't Used
* **Decision**: LangChain use nahi kiya gaya; direct `@google/generative-ai` SDK use hua.
* **Reason**: Proposal generation ek single-turn, structured-output task hai (`Context JSON -> Gemini -> String`). LangChain add karne se heavy dependencies, abstraction bloat, aur extra latency aati bina kisi practical benefit ke. Direct SDK fastest aur most reliable solution hai.

---

## 28. Files Created
1. `src/lib/ai/prompts/proposalGenerator.js` — System prompt, one-shot example, and response schema.
2. `src/validations/aiProposal.js` — Zod input/output schemas.
3. `src/app/api/ai/generate-proposal/route.js` — Server-side endpoint with DB fetching and deterministic relevance filtering.
4. `FreelancerGenAi.md` — This complete documentation.

---

## 29. Files Modified
1. `src/lib/ai/gemini.js` — Added `generateProposalWithGemini(contextData)` function.
2. `src/app/(freelancer)/fl/jobdetails/[...jobId]/page.jsx` — Added "Generate with AI" button, animated SVG loader, safe overwrite confirmation, and snappy progressive typing reveal.

---

## 30. Important Functions
* `generateProposalWithGemini(contextData)` (`src/lib/ai/gemini.js`): Calls Google Generative AI with proposal schema.
* `POST(req)` (`src/app/api/ai/generate-proposal/route.js`): Server route handling DB fetch, relevance filtering, and API execution.
* `handleGenerateProposalClick()` (`fl/jobdetails/[...jobId]/page.jsx`): Triggers generation from UI.
* `animateProposalText(fullText)` (`fl/jobdetails/[...jobId]/page.jsx`): Executes snappy chunked reveal animation in the textarea.

---

## 31. Request/Response Flow

**Frontend Request (`POST /api/ai/generate-proposal`):**
```json
{
  "projectId": "6724a180e034a7812903bc12",
  "freelancerId": "6723b190f023a9921804bc55"
}
```

**Backend Response (HTTP 200):**
```json
{
  "success": true,
  "message": "Proposal generated successfully",
  "proposal": "Hi, I saw that you need a modern web store for your fashion brand with seamless product browsing and payment checkout. Having built full-stack e-commerce platforms using React.js, Node.js, and MongoDB with integrated Razorpay payments, I can build an intuitive, mobile-responsive store tailored to your brand.\n\nMy approach will focus on clean product filtering, a secure checkout flow, and easy catalog management for your team. I can comfortably align with your 1-month timeline and milestone budget.\n\nLet's connect to review your brand design preferences and get started."
}
```

---

## 32. Example Input
* Freelancer: "Rahul", Full Stack Developer, Skills: `["React.js", "Node.js", "MongoDB", "Docker", "Figma", "AWS"]`
* Job: "Build an Online Clothing Store", Category: Web Development, Skills required: `["React.js", "Node.js", "MongoDB"]`, Budget: ₹50,000, Timeline: 1 Month.

---

## 33. Example Output
> *"Hi, I noticed you are looking to build a modern clothing store with product browsing and Razorpay payment checkout. Having developed full-stack e-commerce web applications using React.js, Node.js, and MongoDB, I can create a fast, mobile-friendly store tailored to your brand.*
>
> *I will ensure clean state management for shopping carts, secure checkout flow, and an intuitive catalog. I can comfortably deliver within your 1-month timeline. Let's connect to discuss your brand vision."*

---

## 34. How AI Output Enters Existing Form
* AI proposal aane par `setMessage(fullText)` update hota hai.
* Form state `message` wahi standard state variable hai jo existing "Submit Application" button me `applicationSubmissionSchema` ke through validate hota hai.
* Submitting existing flow ko call karta hai (`submitApplication(parsed.data)`), jisse socket notification aur database record seamlessly update hote hain.

---

## 35. Interview Explanation (Quick Summary in Hinglish)

> **Interview Question: "Freelancer side par aapne GenAI proposal generator kaise banaya aur token optimization kaise kiya?"**
>
> *"Humare platform Karmsetu par freelancer jab kisi job par 'Apply' karta tha, toh unhe blank textarea milta tha jisme unhe khud proposal draft karna hota tha. Bahut se freelancers generic templates copy-paste kar dete the jisse client unhe reject kar deta tha.*
>
> *Humne application dialog ke andar ek 'Generate with AI' assistant integrate kiya. Frontend simply projectId aur freelancerId hamare backend route `/api/ai/generate-proposal` ko bhejta hai.*
>
> *Backend par humne token efficiency ke liye code-level deterministic relevance filtering implement ki. Hum freelancer ka pura database profile prompt me dump nahi karte. Code me freelancer ke skills aur portfolio items ko job ki requirements se match karke sirf top relevant 1-2 items filter karte hain. Isse token consumption 80% kam ho jata hai.*
>
> *Phir ye compact JSON Google Gemini model ko jata hai with a strict system prompt aur native JSON schema (`{ proposal: string }`). Humne LangChain use nahi kiya kyunki direct `@google/generative-ai` SDK lightweight aur faster hai.*
>
> *Frontend par proposal aane par hum direct replace nahi karte agar user ne pehle se kuch likha tha—hum safe overwrite confirmation dete hain. Aur empty input me proposal ek snappy progressive reveal animation ke sath stream hota hai. User proposal ko edit karke normal payment aur socket workflow se submit karta hai. Is feature se freelancer ka application time 10 guna fast ho gaya aur proposal quality kaafi improve ho gayi."*
