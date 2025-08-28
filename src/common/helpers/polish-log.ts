export const polishLog = (method: string, url: string, data: any) => {
  switch (method) {
    case 'POST': {
      return `New record created at ${url} with data: ${JSON.stringify(data)}`;
    }
    case 'PUT': {
      return `Record was edited on ${url} with data: ${JSON.stringify(data)}`;
    }
    case 'DELETE': {
      return `Record was deleted from ${url} with data: ${JSON.stringify(data)}`;
    }
    case 'PATCH': {
      return `Record was edited on ${url} with data: ${JSON.stringify(data)}`;
    }
    default: {
      return `${method} ${url} with data: ${JSON.stringify(data)}`;
    }
  }
};
