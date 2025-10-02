/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config...
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Help webpack resolve pdfjs-dist correctly on server
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false, // pdfjs-dist has optional canvas dependency
      };
      
      // Ignore pdfjs worker files that aren't needed in serverless
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      
      config.module.rules.push({
        test: /pdf\.worker\.(min\.)?js/,
        type: 'asset/resource',
        generator: {
          filename: 'static/worker/[hash][ext][query]',
        },
      });
    }
    
    return config;
  },
};

export default nextConfig;