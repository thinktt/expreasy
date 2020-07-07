# Pull From Base in GCR
FROM gcr.io/google_appengine/nodejs

WORKDIR /opt
COPY public /opt/public
COPY server.js /opt
COPY package.json /opt
RUN npm install

EXPOSE 8080

CMD ["npm", "start"]

# #Update npm if necessary
# RUN /usr/local/bin/install_node ">=0.12.7"

# # Install prerequisites
# RUN npm install --only=dev


# #Bundle app src
# COPY . /usr/src/app
# RUN npm run build
# # RUN npm start
