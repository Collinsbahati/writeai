import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { checkUsage, incrementUsage } from '@/lib/usage'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const PROMPTS: Record<string, string> = {
  blog: 'Write a detailed, engaging blog post with an introduction, 3-4 sections with headers, and a conclusion. Topic:',
  email: 'Write a professional, concise email with subject line and body. Topic:',
  social: 'Write 3 variations of engaging social media posts (suitable for Twitter/LinkedIn/Instagram). Topic:',
  ad: 'Write compelling ad copy with headline, body, and call-to-action. Product/Service:',
  rewrite: 'Rewrite the following content to be clearer, more engaging, and professional:',
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { topic, tool } = await req.json()
    if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 })

    const usageData = await checkUsage(user.id)
    if (!usageData.allowed) {
      return NextResponse.json({ error: `Daily limit reached (${usageData.limit}/day). Upgrade to Pro for unlimited.` }, { status: 429 })
    }

    const prompt = PROMPTS[tool] || PROMPTS.blog
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: `${prompt} ${topic}` }],
      max_tokens: 1500,
    })

    await incrementUsage(user.id)
    const content = completion.choices[0]?.message?.content || ''
    const newUsage = { count: usageData.count + 1, limit: usageData.limit }
    return NextResponse.json({ content, usage: newUsage })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 })
  }
}
