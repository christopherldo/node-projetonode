exports.defaultPageTitle = "Notícias Express";

exports.menu = [{
    name: 'Home',
    slug: '/',
    guest: true,
    logged: true
  },
  {
    name: 'Login',
    slug: '/users/login',
    guest: true,
    logged: false
  },
  {
    name: 'Cadastro',
    slug: '/users/register',
    guest: true,
    logged: false
  },
  {
    name: 'Adicionar Post',
    slug: '/post/add',
    guest: false,
    logged: true
  },
  {
    name: 'Sair',
    slug: '/users/logout',
    guest: false,
    logged: true
  },
];