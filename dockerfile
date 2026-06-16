FROM node:lts-alpine

# Create app directory
WORKDIR /root/scriptcraft

# Download openjdk 25
RUN apk add --no-cache openjdk25

# Make minecraft folder
RUN mkdir minecraft

# Download latest minecraft server jar to ./minecraft/server.jar ( 26.1.2 )
RUN wget -O minecraft/server.jar https://piston-data.mojang.com/v1/objects/97ccd4c0ed3f81bbb7bfacddd1090b0c56f9bc51/server.jar

# Install app dependencies
COPY package*.json ./

# Install dependencies ( Should be no dependencies in the current version )
RUN npm install

# Copy remaining files to ./
COPY . .

# Public folder needs to be mounted as a docker volume
VOLUME /root/scriptcraft/public

# Expose port 25565
EXPOSE 25565

# Run the server
CMD ["node", "index.js"]
