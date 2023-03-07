function errorHandler(error) {
  if (!error.response) return console.log(error);

  const { status, data } = error.response;

  if ([401, 403, 404, 422, 500, 400].includes(status)) {
    console.log(error.response, data);
    throw data;
  }

  console.dir(error);
}

export default errorHandler;
