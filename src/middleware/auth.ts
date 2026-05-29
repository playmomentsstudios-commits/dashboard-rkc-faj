import { supabase } from '@/lib/supabase'
import type { AdminRole } from '../types/admin'

const roleHierarchy: AdminRole[] = [
  'viewer',
  'editor',
  'finance',
  'admin',
  'owner'
]

export function canAccessRole(
  userRole: AdminRole | null | undefined,
  minimumRole: AdminRole
) {
  if (!userRole) return false

  return (
    roleHierarchy.indexOf(userRole) >=
    roleHierarchy.indexOf(minimumRole)
  )
}

export async function requireRole(minimumRole: AdminRole) {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    window.location.href = '/login'
    return false
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    window.location.href = '/'
    return false
  }

  const allowed = canAccessRole(
    profile.role as AdminRole,
    minimumRole
  )

  if (!allowed) {
    window.location.href = '/'
    return false
  }

  return true
}
