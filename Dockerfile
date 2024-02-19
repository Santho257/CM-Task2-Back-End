FROM node:latest
WORKDIR /home/Santho257/Downloads/Tasks/Task2/Back End
RUN git clone https://github.com/Santho257/CM-Task2-Back-End
RUN npm install
CMD ["npm","start"]