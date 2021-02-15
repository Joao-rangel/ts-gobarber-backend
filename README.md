#  TS-Gobarber-Backend

Backend (API) da aplicação GoBarber criada utilizando Node.Js com Typescript e Express.js durante o bootcamp da rocketseat.
A aplicação gerencia um serviço de agendamentos para berbearias, conectando prestadores de serviço e clientes.
A api atende ao frontend em suas versões [web](https://github.com/Joao-rangel/ts-gobarber-web) e [mobile](https://github.com/Joao-rangel/ts-gobarber-mobile).

### Links da API

* [Documentação (Insomnia)](https://joao-rangel.github.io/ts-gobarber-backend/)

* [Gobarber-API (Heroku)](https://node-gobarber-api.herokuapp.com/)

###  Alterações em relação ao projeto do curso

* A aplicação foi alterada para identificar se o usuário autentidcado é prestador de serviço ou cliente.

### Dependências do sistema

* Node.JS 14.15.x
* [PostgreSQL](https://www.postgresql.org/download/)
* [MongoDB](https://docs.mongodb.com/drivers/node/)
* [Redis](https://redis.io/topics/quickstart)
* [Docker](https://docs.docker.com/get-docker/)


### Configurações

1.  Clone o projeto e acesse a pasta:
```
    $ git clone https://github.com/Joao-rangel/ts-gobarber-backend.git && cd ts-gobarber-backend
```
2.  Rode o yarn para instalar as bibliotecas:
```
    $ yarn
```
3.  Copie o conteúdo das variáveis de ambiente e altere seus valores:
```
    $ cp .env.example .env
```
4.  Inicie os bancos de dados com o docker (alterando os valores conforme .env):
  * PostgreSQL
```
     $ docker run -d --name postgres -e POSTGRES_PASSWORD=PASSWORD -e POSTGRES_USER=USERNAME -e POSTGRES_DB=DATABASE -p 5432:5432 postgres
```
  * MongoDB
```
     $ docker run -d --name mongodb -p 27017:27017 -t mongo
```
  * Redis
```
     $ docker run -d --name redis -p 6379:6379 -t redis:alpine
```
5.  Inicie o projeto:
```
    $ yarn dev:server
```
