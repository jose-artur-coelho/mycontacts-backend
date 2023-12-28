module.exports = (error, _request, response, _next) => {
  console.log(error);
  response.sendStatus(500);
};
