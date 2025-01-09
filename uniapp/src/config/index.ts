interface Config {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  WX_APP_ID: string
  WX_APP_SECRET: string
  APP_TITLE: string
}

// 开发环境配置
const DEV_CONFIG: Config = {
  SUPABASE_URL: 'http://localhost:54321',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  WX_APP_ID: 'wxbcb9dae2efcc9e5f',
  WX_APP_SECRET: '8a49d8ff231dd8d27c9a801939213b73',
  APP_TITLE: '麻将馆预约小程序'
}

// 生产环境配置
const PROD_CONFIG: Config = {
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
  WX_APP_ID: 'your-wx-app-id',
  WX_APP_SECRET: 'your-wx-app-secret', 
  APP_TITLE: '麻将馆预约小程序'
}

// 导出当前环境的配置
export const config: Config = process.env.NODE_ENV === 'development' ? DEV_CONFIG : PROD_CONFIG

// 为了向后兼容,也导出单独的配置项
export const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  WX_APP_ID,
  WX_APP_SECRET,
  APP_TITLE
} = config 