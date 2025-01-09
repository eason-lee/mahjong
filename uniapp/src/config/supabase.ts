// import { createClient } from '@supabase/supabase-js'
import { createClient } from 'supabase-wechat-stable-v2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './index'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase 