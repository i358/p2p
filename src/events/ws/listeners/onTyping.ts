module.exports = {
  on: "typing",
  execute(io: any, socket: any, data: any) {
    io.emit("typing", data);
  },
};
