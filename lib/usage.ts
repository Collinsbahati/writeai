import { createServiceClient } from './supabase-server'

const FREE_LIMIT = 5

export async function checkUsage(userId: string): Promise<{ allowed: boolean; count: number; limit: number }> {
  const supabase = createServiceClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', userId)
    .single()

  if (profile?.plan === 'pro' || profile?.plan === 'team') {
    return { allowed: true, count: 0, limit: Infinity }
  }

  const { data: usage } = await supabase
    .from('usage')
    .select('count')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  const count = usage?.count || 0
  return { allowed: count < FREE_LIMIT, count, limit: FREE_LIMIT }
}

export async function incrementUsage(userId: string) {
  const supabase = createServiceClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: existing } = await supabase
    .from('usage')
    .select('id, count')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  if (existing) {
    await supabase.from('usage').update({ count: existing.count + 1 }).eq('id', existing.id)
  } else {
    await supabase.from('usage').insert({ user_id: userId, date: today, count: 1 })
  }
}
