APP_VERSION=$(node -p "require('../package.json').version")
APP_NAME=$(node -p "require('../package.json').name")

echo "Building docker image $APP_NAME:$APP_VERSION"
docker build -t $APP_NAME:$APP_VERSION --platform linux/amd64,linux/arm64 ../