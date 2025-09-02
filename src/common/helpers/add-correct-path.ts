export const addCorrectPathToObject = (
  object: any,
  pathKey: string,
  PathEnvVariable: string,
) => {
  object[pathKey] = `${PathEnvVariable}${object[pathKey]}`;
  return object;
};
