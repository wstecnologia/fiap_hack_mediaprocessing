# 📦 File Storage API

API para upload, armazenamento e recuperação de arquivos utilizando AWS S3 e Redis.

## 🚀 Tecnologias Utilizadas

- **Node.js** com TypeScript
- **Express** para gerenciamento de rotas
- **AWS S3** para armazenamento de arquivos
- **Redis** para armazenamento de metadados
- **Swagger** para documentação da API
- **Docker** para ambiente de desenvolvimento
- **Kubernetes** para orquestração de containers


```

## 🔧 Instalação e Configuração

1. Clone o repositório:
   ```sh
   git https://github.com/wstecnologia/fiap_hack_mediaprocessing
   
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:
   ```sh
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_S3_BUCKET_NAME=your-bucket
   REDIS_HOST=
   REDIS_PORT=
   ```

4. Execute a aplicação em ambiente de desenvolvimento:
   ```sh
   npm run dev
   ```

5. Acesse a documentação via Swagger:
   ```
   http://localhost:3000/api-docs
   ```

## 📌 Endpoint

### 📤 Upload de Arquivo
```
get /api/files/
```
**Descrição:** Faz upload de um arquivo para o S3 e armazena seus metadados no Redis.


## 🛡️ Autenticação

A API utiliza `AuthMiddleware` para proteger rotas sensíveis, garantindo que apenas usuários autenticados possam acessar determinados endpoints.

## 🐳 Executando com Docker


## 📜 Licença



