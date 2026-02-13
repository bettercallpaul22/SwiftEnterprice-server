module.exports = {
  // Vercel configuration
  rewrites() {
    return [
      {
        source: '/(.*)',
        destination: '/api'
      }
    ]
  },
  
  // Function configuration
  functions: {
    'dist/server.js': {
      maxDuration: 30
    }
  }
}