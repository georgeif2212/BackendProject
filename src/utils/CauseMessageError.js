export const generatorUserError = (data) => {
  return `Todos los campos son requeridos
  - first_name  :${data.first_name}
  - email       :${data.email}`;
};

export const generatorUserIdError = (id) => {
  return `The identifier must be valid
  - Received ID  :${id}`;
};
