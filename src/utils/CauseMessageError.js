export const generatorUserError = (data) => {
  return `Todos los campos son requeridos
  - first_name  :${data.first_name}
  - email       :${data.email}`;
};

export const generatorUserLoginError = (data) => {
  return `Todos los campos son requeridos
  - email  :${data.email}
  - password       :${data.password}`;
};

export const generatorAdminPremiumError = () => {
  return `Admin cant be changed to premium user`;
};

export const generatorDocumentsAreMissingError = () => {
  return `Required documents are missing`;
};

export const generatorUserLoginDataError = () => {
  return `Invalid email or password`;
};

export const generatorUserAlreadyExistsError = (data) => {
  return `The user with the email: ${data.email} already exists`;
};

export const generatorUserIdError = (id) => {
  return `The identifier must be valid
  - Received ID  :${id}`;
};

export const generatorCartIdError = (id) => {
  return `The identifier must be valid
  - Received ID  :${id}`;
};

export const generatorCartError = (data) => {
  return `Products Array must be empty
  - data  :${data}`;
};

export const generatorMessageIdError = (id) => {
  return `The identifier must be valid
  - Received ID  :${id}`;
};

export const generatorMessageError = (data) => {
  return `Todos los campos son requeridos
  - user  :${data.user}
  - message       :${data.message}`;
};

export const generatorProductIdError = (id) => {
  return `The identifier must be valid
  - Received ID  :${id}`;
};

export const generatorProductError = (data) => {
  return `Todos los campos son requeridos
  - title  :${data.title}
  - description: ${data.description}     
  - price: ${data.price}
  - thumbnail: ${data.thumbnail}
  - code: ${data.code}
  - stock: ${data.stock}`;
};

export const generatorTicketIdError = (id) => {
  return `The identifier must be valid
  - Received ID  :${id}`;
};

export const generatorTicketError = (data) => {
  return `Todos los campos son requeridos
  - email  :${data.email}
  - availableProducts: ${data.availableProducts}`;
};

export const generatorPermissionError = () => {
  return `User doesn't have permission`;
};
