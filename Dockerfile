FROM node:carbon-alpine

# Port to listen on
EXPOSE 8000

# Copy app and install packages
WORKDIR /app
COPY . /app/

# Default app commands
ENTRYPOINT ["yarn"]
CMD ["start"]
