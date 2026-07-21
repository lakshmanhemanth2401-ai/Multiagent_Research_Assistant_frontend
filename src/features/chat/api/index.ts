import type { Conversation, Message } from '@/types/chat'
import { generateId } from '@/utils/helpers'

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// ─── Mock conversation history ────────────────────────────────────────────────

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_001',
    title: 'Quantum Computing Basics',
    is_pinned: true,
    created_at: '2026-07-18T09:00:00Z',
    updated_at: '2026-07-18T09:45:00Z',
    messages: [
      {
        id: 'msg_001',
        role: 'user',
        content: 'Can you explain quantum superposition in simple terms?',
        created_at: '2026-07-18T09:00:00Z',
      },
      {
        id: 'msg_002',
        role: 'assistant',
        content:
          "Quantum superposition is one of the most fascinating principles in quantum mechanics.\n\n**In simple terms:** A quantum particle (like an electron) can exist in multiple states simultaneously until it's observed or measured.\n\n### Classic Analogy\nThink of a coin spinning in the air — while it's spinning, it's neither heads nor tails, it's **both at the same time**. The moment it lands and you look at it, it 'chooses' one state.\n\n### Key Points\n- **Classical bits** are either 0 or 1\n- **Qubits** can be 0, 1, or any combination (superposition) until measured\n- This allows quantum computers to process many possibilities simultaneously\n\nWould you like me to explain how this enables quantum parallelism?",
        created_at: '2026-07-18T09:01:00Z',
        citations: [
          { id: 'cit_1', title: 'Principles of Quantum Mechanics — Dirac', year: 1958 },
        ],
      },
      {
        id: 'msg_003',
        role: 'user',
        content: 'Yes, please explain quantum parallelism!',
        created_at: '2026-07-18T09:05:00Z',
      },
      {
        id: 'msg_004',
        role: 'assistant',
        content:
          "**Quantum parallelism** is what makes quantum computers potentially exponentially faster for certain problems.\n\n### How it Works\n\nBecause a qubit can be in superposition (both 0 and 1 at once), a quantum computer with **n qubits** can represent **2ⁿ states simultaneously**.\n\n```python\n# Classical: process states one at a time\nfor state in range(2**n):  # 2^n iterations\n    process(state)\n\n# Quantum: all 2^n states processed in one step\nquantum_processor.apply_gate(superposed_qubits)\n```\n\n### Real-world Impact\n| Problem | Classical | Quantum |\n|---|---|---|\n| Search unsorted list | O(n) | O(√n) |\n| Factor large numbers | Exponential | Polynomial |\n| Simulate molecules | Exponential | Polynomial |\n\nThis is why quantum computers could revolutionise cryptography, drug discovery, and optimisation problems.",
        created_at: '2026-07-18T09:06:30Z',
      },
    ],
  },
  {
    id: 'conv_002',
    title: 'Climate Change Research',
    is_pinned: false,
    created_at: '2026-07-17T14:00:00Z',
    updated_at: '2026-07-17T14:30:00Z',
    messages: [
      {
        id: 'msg_005',
        role: 'user',
        content: 'What are the most promising carbon capture technologies?',
        created_at: '2026-07-17T14:00:00Z',
      },
      {
        id: 'msg_006',
        role: 'assistant',
        content:
          "Carbon capture is a critical component of climate mitigation strategies. Here are the most promising approaches:\n\n## 1. Direct Air Capture (DAC)\nMachines that pull CO₂ directly from the atmosphere.\n- **Companies**: Climeworks, Carbon Engineering\n- **Current cost**: ~$300–1000/tonne CO₂\n- **Target cost**: <$100/tonne by 2030\n\n## 2. Bioenergy with Carbon Capture (BECCS)\nBurning biomass for energy while capturing the emitted CO₂.\n\n## 3. Enhanced Weathering\nSpreading crushed silicate rocks over agricultural land to accelerate natural CO₂ absorption.\n\n## 4. Ocean-Based Solutions\n- Iron fertilisation\n- Alkalinity enhancement\n\nAll technologies face scale and cost challenges. DAC currently leads in research investment.",
        created_at: '2026-07-17T14:01:30Z',
        citations: [
          { id: 'cit_2', title: 'IPCC AR6 Mitigation Report', year: 2022 },
          { id: 'cit_3', title: 'Nature Energy — DAC Cost Projections', year: 2023 },
        ],
      },
    ],
  },
  {
    id: 'conv_003',
    title: 'LLM Fine-tuning Methods',
    is_pinned: false,
    created_at: '2026-07-15T11:00:00Z',
    updated_at: '2026-07-15T11:20:00Z',
    messages: [
      {
        id: 'msg_007',
        role: 'user',
        content: 'Compare LoRA vs full fine-tuning for LLMs.',
        created_at: '2026-07-15T11:00:00Z',
      },
      {
        id: 'msg_008',
        role: 'assistant',
        content:
          "Great question! Here's a concise comparison:\n\n## LoRA (Low-Rank Adaptation)\n- Adds small trainable rank-decomposition matrices to existing weights\n- **Trains ~0.1–1%** of model parameters\n- Memory: can fine-tune 7B models on a single GPU\n- Speed: significantly faster training\n\n## Full Fine-tuning\n- Updates all model weights\n- **Trains 100%** of parameters\n- Memory: requires multi-GPU setup for large models\n- Best performance ceiling but expensive\n\n### Which to Choose?\n- **LoRA**: task-specific adaptation, limited compute\n- **Full FT**: maximum performance, sufficient budget\n- **QLoRA**: best of both — quantised + LoRA for efficiency",
        created_at: '2026-07-15T11:01:00Z',
      },
    ],
  },
]

// ─── AI response templates (rotated for variety) ──────────────────────────────

const RESPONSE_TEMPLATES = [
  (q: string) =>
    `I've analysed your question about **"${q.slice(0, 60)}${q.length > 60 ? '…' : ''}"**.\n\nHere's what I found based on the available research:\n\n## Key Findings\n\n1. **Primary insight**: This is a well-studied area with significant recent developments.\n2. **Important context**: Multiple research groups have contributed to this topic.\n3. **Current consensus**: The scientific community generally agrees on the core principles.\n\n### Further Exploration\n- Would you like me to dive deeper into any specific aspect?\n- I can also search your uploaded documents for related information.\n\n*This response is powered by the Multi-Agent Research Assistant.*`,

  (_q: string) =>
    `That's an excellent research question! Let me break this down systematically.\n\n## Overview\n\nThis topic intersects several disciplines, which makes it particularly interesting.\n\n### Core Concepts\n\n\`\`\`\nKey principle → Application → Impact\n     ↓               ↓           ↓\n Foundation     Real-world    Measurable\n  theory        use cases     outcomes\n\`\`\`\n\n### Evidence Base\n\nRecent literature (2023–2026) shows:\n- Significant methodological advances\n- Growing consensus on best practices\n- Emerging challenges requiring further study\n\n> "The intersection of theory and practice is where the most valuable insights emerge."\n\nShall I elaborate on any of these points?`,

  (_q: string) =>
    `I've searched through relevant sources to answer your question.\n\n## Summary\n\nBased on current research, here are the critical points:\n\n| Aspect | Details | Confidence |\n|--------|---------|------------|\n| Primary finding | Highly significant correlation | High |\n| Secondary effect | Context-dependent | Medium |\n| Long-term implications | Still under investigation | Low |\n\n### Methodology Note\n\nThis analysis draws from:\n- **Academic papers** (peer-reviewed, 2020–2026)\n- **Technical reports** from leading institutions  \n- **Meta-analyses** where available\n\nWould you like me to generate a full research report on this topic?`,
]

let templateIndex = 0
function getNextResponse(question: string): string {
  const fn = RESPONSE_TEMPLATES[templateIndex % RESPONSE_TEMPLATES.length]
  templateIndex++
  return fn(question)
}

// ─── API functions ─────────────────────────────────────────────────────────────

export async function fetchConversations(): Promise<Conversation[]> {
  await delay(400)
  return SEED_CONVERSATIONS
}

export async function createConversation(title?: string): Promise<Conversation> {
  await delay(200)
  const now = new Date().toISOString()
  return {
    id: 'conv_' + generateId().slice(0, 8),
    title: title ?? 'New Conversation',
    messages: [],
    created_at: now,
    updated_at: now,
  }
}

export async function deleteConversationApi(id: string): Promise<void> {
  await delay(200)
  void id
}

export async function renameConversationApi(id: string, title: string): Promise<void> {
  await delay(200)
  void id
  void title
}

/**
 * Simulates an AI response as a stream of tokens.
 * Calls `onToken` with each new chunk and returns the full response when done.
 */
export async function sendMessageApi(
  conversationId: string,
  userContent: string,
  onToken: (chunk: string) => void,
): Promise<Message> {
  void conversationId
  const fullResponse = getNextResponse(userContent)
  const words = fullResponse.split(' ')

  // Simulate streaming: emit word by word with small delay
  await delay(400) // initial "thinking" delay
  for (let i = 0; i < words.length; i++) {
    await delay(30 + Math.random() * 40)
    onToken(words.slice(0, i + 1).join(' '))
  }

  return {
    id: 'msg_' + generateId().slice(0, 8),
    role: 'assistant',
    content: fullResponse,
    created_at: new Date().toISOString(),
    is_streaming: false,
  }
}
