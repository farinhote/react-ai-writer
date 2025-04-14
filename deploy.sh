#!/bin/bash

# Production deployment script for React AI Writer

# Update .env.production with your server domain
read -p "Enter your server domain or IP (without http://): " SERVER_DOMAIN
echo "REACT_APP_API_URL=http://$SERVER_DOMAIN/api" > ./client/.env.production

# Generate a secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Create a .env file for production
cat > .env << EOL
# Production environment variables
JWT_SECRET=$JWT_SECRET
DEEPSEEK_API_KEY=$(grep DEEPSEEK_API_KEY ./server/.env | cut -d '=' -f2)
DEEPSEEK_BASE_URL=$(grep DEEPSEEK_BASE_URL ./server/.env | cut -d '=' -f2)
JINA_API_KEY=$(grep JINA_API_KEY ./server/.env | cut -d '=' -f2)
EOL

echo "Configuration complete. Run the following command to start the application:"
echo "docker-compose up -d --build"