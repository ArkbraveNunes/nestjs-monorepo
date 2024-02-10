## Nestjs-Monorepo

Olá, bom dia, aqui será apresentado uma documentação relativa a estrutura de todas as aplicações que forem criadas dentro desse monorepo, o objetivo dessa documentação é expôr de maneira clara e objetiva o funcionamento da aplicação bem como sua estrutura. Os padrões aqui impostos seguem conceitos como Clean Code, Clean Architecture, SOLID, DRY, KISS e Design Patterns. Essa documentação também tem correlação ao [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) proposto pelo Google. Uma outra fonte de inspiração foi o repositório [Clean Code Typescript](https://github.com/labs42io/clean-code-typescript), que adapta conceitos conhecidos do Clean Code para o Typescript.

## IMPORTANTE

Para rodar esse projeto é necessário o mesmo estar dentro da pasta projects no repositório [docker-development](https://github.com/ArkbraveNunes/docker-development.git) para ser executado, para mais informações, favor conferir o Readme do docker-development!

## Libs

Para baixar todas as libs do projeto, rodar o comando abaixo

```shell
git submodule init
```

## Principais Ferramentas

Principais ferramentas utilizadas:

- [Nestjs](https://nestjs.com/)
- [Husky](https://typicode.github.io/husky/)
- [CommitLint](https://commitlint.js.org/#/)
- [Commitzen](https://commitizen-tools.github.io/commitizen/)
- [Typescript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [ESLint SonarJS](https://github.com/SonarSource/eslint-plugin-sonarjs/tree/master)
- [Prettier](https://prettier.io/)
- [Lint Staged](https://eslint.org/https://www.npmjs.com/package/lint-staged)
- [Jest](https://jestjs.io/pt-BR/)
- [Jest Mock Extended](https://www.npmjs.com/package/jest-mock-extended)

## Estrutura

O Projeto segue o seguinte modelo de orgranização de arquivos e pastas:

```
    /...
    /src
      |__/common
        |__/config
        |__/enum
      |__/module
        |__/moduleName
          |__/application
            |__/controller
            |__/dto
          |_/domain
            |_/contract
            |_/entity
            |_/service
          |_/infra
            |_/repository
            |_/adapter
            |_/schema
    /...
```

- /src - Aqui se localiza a raíz da aplicação em questão;

- /common - Aqui é armazendo pastas contendo arquivos cuja finalidade é utilizá-los na aplicação como um todo independente do seu local;

  - /config - Local os se localiza o mapeamento das variáveis de ambiente(env) da aplicação
  - /enum - Essa pasta compreende os enums(identificadores) utilizados na aplicação como um todo

- /module -> Aqui são armazenados os módulos da aplicação;

- /module/moduleName/application:

  - /controller - Essa pasta compreende os controllers da aplicação;
  - /dto - Aqui se localiza as definições de entrada(IN) e saída(OUT) dos controllers;

- /module/moduleName/domain:

  - /service: Compreende principalmente os services da aplicação;
  - /entity - Entidade de conversão de dados, atuando como um de/para para os dados fornecidos pelo Banco de Dados;
  - /contract - Local onde fica definido os métodos(queries) enviadas ao banco de dados;

- /module/moduleName/infra:
  - /repository: Aqui se localiza as queries executadas no banco de dados;
  - /adapter: Diretório que compreende conexões com provedores de terceiros ou outras aplicações em diferentes contextos;
  - /schema: Local onde são armazenadas as Tabelas e/ou Schemas/Models relativas ao Banco de Dados;

## Testes

- Neste projeto utilizamos o [Jest](https://jestjs.io/pt-BR/) como framework para a execução de testes unitários e e2e. Todas as configurações utilizadas podem ser encontradas no arquivo `jest.config.json` presente na raiz do projeto.
- Os arquivos contendo testes unitários devem estar no mesmo diretório do código de produção. Por padrão, os arquivos de teste devem ter o mesmo nome do arquivo onde está a implementação do que está sendo testado, com a adição do sufixo `spec`, por exemplo, `my-code.service.spec.ts`.
- Os testes e2e ficam no diretório `test`, na raiz do projeto, e são organizados por módulos. Esse tipo de teste é utilizado para testar o fluxo da aplicação como um todo, fazendo um request para um endpoint e recebendo uma response. Para efetuar requests nos testes e2e é utilizado a lib [Supertest](https://www.npmjs.com/package/supertest) em conjunto com o Jest. O nome dos arquivos de teste deve ter o seguinte padrão: nome do módulo + sufixo e2e-spec, como por exemplo, `my-module.e2e-spec.ts`.
- Este projeto também está configurado para gerar relatórios de execução de testes e de coverage. Os de execução podem ser encotrados no diretório `reports` e os de coverage em `coverage`, ambos na raiz da aplicação.
- Os seguintes scripts estão configurados para a execução dos testes:
  - `test` - executa todos os testes da aplicação.
  - `test:watch` - executa os testes em watch mode.
  - `test:staged` - executa os testes relacionados aos arquivos da staging area do git.
  - `test:cov` - executa todos os testes da aplicação e gera o relatório de coverage.
  - `test:debug` - executa os testes no modo debug.
  - `test:e2e` - executa os testes e2e.

### Husky

O Husky é uma ferramenta utilizada para a criação e execução de [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks), permitindo executar lint, tests, etc... ao fazer um commit ou push.
Neste projeto temos três hooks configurados:

- commit-msg: Hook executado quando um commit é realizado. Visa validar, juntamente com o commintlint, se todos os commits estão dentro do padrão estabelecido.
- pre-commit: Hook executado antes de todos os commits. Com o auxílio do lint-staged executa os testes e lint para todos os arquivos que foram alterados.
- pre-push: Hook executado antes do push para o repositório de origem. É utilizado para rodar os testes e lint de todo projeto antes de confirmar o push para a origem.

Para melhor entendimento do funcionamento dessa biblioteca, basta acessar o [guia](https://typicode.github.io/husky/guide.html) disponível na documentação oficial do Husky.

### Eslint + Prettier + SonarJS

O ESLint/Prettier/SonarJS analisa estaticamente o código da aplicação para encontrar e corrigir problemas de lint rapidamente. Todas as configurações de plugins e regras de lint utilizadas estão no arquivo `.eslintrc.js` na raiz da aplicação.

Para executar o lint basta rodar o seguinte comando: `npm run lint`.

Caso queira entender melhor sobre o funcionamento das bibliotecas, recomendamos a consulta em suas documentações oficiais: [ESLint](https://eslint.org/), [ESLint SonarJS](https://github.com/SonarSource/eslint-plugin-sonarjs/tree/master), [Prettier](https://prettier.io/).

## Padrões de Nomenclatura

- Use PascalCase para nomes de classes, types e interfaces: `MyClass`.
- Use camelCase para nomes de variáveis, funções e métodos: `exampleVariable`, `myFunction()`.
- Use kebab-case + nome da pasta para nome dos arquivos: `my-code.service.ts`,`my-code.repository.ts`.
- Para testes, siga o mesmo padrão de nomes de arquivos, com a adição do sufixo spec: `my-code.service.spec.ts`,`my-code.repository.spec.ts`.
- Use snake_case + uppercase para nomes de constantes e enums: `MAX_LIMIT`, `MIN_LIMIT`.

## Boas Práticas

### 1. Defina variáveis com nomes pronunciáveis e que façam sentido. Isso também serve para tipos, funções e etc.

**Bad:**

```ts
type DtaRcrd102 = {
  genymdhms: Date;
  modymdhms: Date;
  pszqint: number;
};
```

**Good:**

```ts
type Customer = {
  generationTimestamp: Date;
  modificationTimestamp: Date;
  recordId: number;
};
```

### 2. Defina variáveis com nomes que possam ser lidos e procurados com facilidade.

**Bad:**

```ts
// What the heck is 86400000 for?
setTimeout(restart, 86400000);
```

**Good:**

```ts
// Declare them as capitalized named constants.
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000; // 86400000

setTimeout(restart, MILLISECONDS_PER_DAY);
```

### 3. Evite mapeamento mental. Defina variáveis de forma explicita.

Explicit is better than implicit.
_Clarity is king._
**Bad:**

```ts
const u = getUser();
const s = getSubscription();
const t = charge(u, s);
```

**Good:**

```ts
const user = getUser();
const subscription = getSubscription();
const transaction = charge(user, subscription);
```

### 4. Use argumentos default ao invés de condicionais ou ternários.

**Bad:**

```ts
function loadPages(count?: number) {
  const loadCount = count !== undefined ? count : 10;
  // ...
}
```

**Good:**

```ts
function loadPages(count: number = 10) {
  // ...
}
```

### 5. Use enums para documentar a intenção do código.

**Bad:**

```ts
const GENRE = {
  ROMANTIC: 'romantic',
  DRAMA: 'drama',
  COMEDY: 'comedy',
  DOCUMENTARY: 'documentary',
};

configureFilm(GENRE.COMEDY);
```

**Good:**

```ts
enum GENRE {
  ROMANTIC,
  DRAMA,
  COMEDY,
  DOCUMENTARY,
}

configureFilm(GENRE.COMEDY);
```

### 6. Limite a quantidade de paramêtros de uma função/método para no máximo 2

**Bad:**

```ts
function createMenu(
  title: string,
  body: string,
  buttonText: string,
  cancellable: boolean,
) {
  // ...
}

createMenu('Foo', 'Bar', 'Baz', true);
```

**Good:**

```ts
type MenuOptions = {
  title: string;
  body: string;
  buttonText: string;
  cancellable: boolean;
};

function createMenu(options: MenuOptions) {
  // ...
}

createMenu({
  title: 'Foo',
  body: 'Bar',
  buttonText: 'Baz',
  cancellable: true,
});
```

### 7. Funções/métodos devem ter uma única responsabilidade.

**Bad:**

```ts
function emailActiveClients(clients: Client[]) {
  clients.forEach((client) => {
    const clientRecord = database.lookup(client);
    if (clientRecord.isActive()) {
      email(client);
    }
  });
}
```

**Good:**

```ts
function emailActiveClients(clients: Client[]) {
  clients.filter(isActiveClient).forEach(email);
}

function isActiveClient(client: Client) {
  const clientRecord = database.lookup(client);
  return clientRecord.isActive();
}
```

### 8. Nomes de funções/métodos devem dizer exatamente o que fazem.

**Bad:**

```ts
function addToDate(date: Date, month: number): Date {
  // ...
}

const date = new Date();

// It's hard to tell from the function name what is added
addToDate(date, 1);
```

**Good:**

```ts
function addMonthToDate(date: Date, month: number): Date {
  // ...
}

const date = new Date();
addMonthToDate(date, 1);
```

## Referências

- [The Clean Code Blog](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [The Catalog of Design Patterns](https://refactoring.guru/design-patterns/catalog)
- [SOLID with Typescript](https://github.com/labs42io/clean-code-typescript)
- [Google Typescript Style Guide](https://google.github.io/styleguide/tsguide.html)
