import { supabase } from './supabase'

/** Return a signed-in user only when their id is on the server-managed admin list. */
export async function getAdminUser() {
  if (!supabase) return null
  const { data: sessionData } = await supabase.auth.getUser()
  const user = sessionData.user
  if (!user) return null
  const { data, error } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (error || !data) return null
  return user
}
