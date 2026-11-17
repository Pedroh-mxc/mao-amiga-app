# App Instituto Mão Amiga

App em React Native (Expo) do Instituto Mão Amiga. Na N1 ele guardava as doações no aparelho; na N2 **pontos de coleta e doações vêm de uma API Spring Boot própria**, com CRUD completo por HTTP.

## Onde está cada parte

| Parte | Pasta |
|---|---|
| App (Expo / React Native) | raiz do repositório (`App.js`, `src/`) |
| API (Spring Boot + H2) | **`api/`** neste mesmo repositório |

## Como rodar a API

Requisitos: **Java 21** (confira com `java -version`).

```bash
cd api
mvnw.cmd spring-boot:run      # Windows
./mvnw spring-boot:run        # Linux / macOS
```

- API: `http://localhost:8080/api/v1`
- Swagger: `http://localhost:8080/swagger-ui/index.html`
- Console do H2: `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:file:./data/maoamiga`, usuário `sa`, senha vazia)
- O banco grava em arquivo (`api/data/`). Na primeira execução são carregados 28 pontos de coleta em Goiânia (endereços fictícios); nos reinícios a carga não se repete.

## Como rodar o app

```bash
npm install
npx expo start
```

**Trocar o IP da API:** abra `src/services/api.ts` e altere a constante `API_URL` para o IPv4 do computador que roda a API (comando `ipconfig`). No celular **não** funciona `localhost`. Celular e computador precisam estar na mesma rede Wi-Fi, e o firewall do Windows precisa liberar o Java na rede privada.

Testado no celular com Expo Go pela rede local.

## Endpoints

### Pontos de coleta (`/api/v1/pontos`)

| Método | URL | Descrição |
|---|---|---|
| GET | `/api/v1/pontos` | lista todos os pontos |
| GET | `/api/v1/pontos/filtro?filtro=...&page=0&size=10` | busca paginada por nome ou bairro |
| GET | `/api/v1/pontos/{id}` | um ponto (404 se não existir) |
| POST | `/api/v1/pontos` | cadastra (400 se faltar campo) |
| PUT | `/api/v1/pontos/{id}` | edita (404 se não existir, 400 se faltar campo) |
| DELETE | `/api/v1/pontos/{id}` | exclui |

### Doações (`/api/v1/doacoes`)

| Método | URL | Descrição |
|---|---|---|
| GET | `/api/v1/doacoes/filtro?filtro=...&page=0&size=10` | busca paginada por tipo de item, da mais nova para a mais antiga |
| GET | `/api/v1/doacoes/{id}` | uma doação (404 se não existir) |
| POST | `/api/v1/doacoes` | cadastra (400 se quantidade ≤ 0 ou campo vazio) |
| PUT | `/api/v1/doacoes/{id}` | edita, mantendo id e data de cadastro |
| DELETE | `/api/v1/doacoes/{id}` | exclui |

## Busca paginada de pontos (N2-2)

**1. Sem filtro**

`GET /api/v1/pontos/filtro`

```json
COLE AQUI a resposta do Swagger
```

**2. Filtrando por bairro**

`GET /api/v1/pontos/filtro?filtro=bueno`

```json
COLE AQUI a resposta do Swagger
```

**3. Segunda página**

`GET /api/v1/pontos/filtro?page=1&size=10`

```json
COLE AQUI a resposta do Swagger
```

## Prints do Swagger

### Pontos (N2-1)

| Resposta | Print |
|---|---|
| GET lista | ![GET lista](docs/prints/pontos-get-lista.png) |
| GET por id | ![GET por id](docs/prints/pontos-get-id.png) |
| POST 201 | ![POST 201](docs/prints/pontos-post-201.png) |
| PUT 200 | ![PUT 200](docs/prints/pontos-put-200.png) |
| DELETE 204 | ![DELETE 204](docs/prints/pontos-delete-204.png) |
| 400 (campo vazio) | ![POST 400](docs/prints/pontos-post-400.png) |
| 404 (id inexistente) | ![GET 404](docs/prints/pontos-get-404.png) |

### Doações (N2-5)

| Resposta | Print |
|---|---|
| GET filtro | ![GET filtro](docs/prints/doacoes-get-filtro.png) |
| GET por id | ![GET por id](docs/prints/doacoes-get-id.png) |
| POST 201 | ![POST 201](docs/prints/doacoes-post-201.png) |
| PUT 200 | ![PUT 200](docs/prints/doacoes-put-200.png) |
| DELETE 204 | ![DELETE 204](docs/prints/doacoes-delete-204.png) |
| 400 (quantidade 0) | ![POST 400](docs/prints/doacoes-post-400.png) |
| 404 (id inexistente) | ![GET 404](docs/prints/doacoes-get-404.png) |

## Roteiro de demonstração (até 3 minutos)

1. Com a API ligada, abrir **Pontos de coleta** e **buscar** por um bairro (ex.: "bueno"). Rolar a lista até carregar mais itens.
2. **Cadastrar** um ponto novo (ex.: "Ponto Teste"), buscá-lo pelo nome, **editar** o horário e **excluir** com confirmação.
3. **Favoritar** um ponto com o ♡, abrir **Meus pontos**, ver o ponto lá e **desmarcar**.
4. **Registrar uma doação** escolhendo o ponto de destino entre os da API; ver no topo do histórico, **editar** a quantidade e **excluir**.
5. No Swagger, mostrar um **400** (ex.: POST de doação com quantidade 0) e um **404** (GET com id inexistente).

## Decisão técnica

Os **favoritos ficam no aparelho** (AsyncStorage, só com os ids) porque são uma preferência de cada pessoa e não precisam ser compartilhados. Já **pontos e doações ficam no servidor**, porque são dados do Instituto: precisam ser os mesmos para todo mundo, validados no servidor e consistentes entre aparelhos. Os favoritos guardam só o id e os dados do ponto são buscados na API, então se o ponto for editado o app mostra o valor atual, e se for excluído ele simplesmente some de "Meus pontos".

O acesso à rede fica em camadas: só `src/services/api.ts` chama `fetch`; `pontosService.ts` e `doacoesService.ts` montam as URLs; as telas só chamam os services.
