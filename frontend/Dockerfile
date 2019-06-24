# Use an official runtime as a parent image
FROM node

# Set the working directory
WORKDIR /frontend

# Copy the current directory contents into the container 
COPY . /frontend

# Install
RUN npm install

# Run when the cosntainer launches
CMD ["npm", "start"]