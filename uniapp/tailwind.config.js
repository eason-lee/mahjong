/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        'rpx-1': '1rpx',
        'rpx-2': '2rpx',
        'rpx-4': '4rpx',
        'rpx-8': '8rpx',
        'rpx-16': '16rpx',
        'rpx-32': '32rpx',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
  transform: {
    px: {
      unit: 'rpx',
      ratio: 2,
    },
  },
}

