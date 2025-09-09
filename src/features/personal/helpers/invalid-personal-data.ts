export const logInvalidPersonalData = () => {
  console.log(
    `There is more than 1 record in the 'personal' table, please check the database, application will be shut down.`,
  );
};
