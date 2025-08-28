// this function gonna take exception on the global filter and if its coming from class validator it gonna format it
// as the rest of exceptions with CustomHttpException

import { TResponse } from '@common/types/response.type';

export const classValidatorFormatter = (exception: any) => {
  const message = exception.response?.message;
  if (!message) return false;

  if (!exception.response?.message) {
    return false;
  }

  if (!Array.isArray(message)) {
    return false;
  }

  const response: TResponse = {
    data: null,
    message: message[0],
    statusCode: 400,
  };

  return response;
};
