# AgiliCar

`Sistemas de Informação`

`Trabalho Interdisciplinar: Aplicações para Processos de Negócios`

`1º Semestre de 2026`

O **AgiliCar** é um sistema web de gerenciamento de ordens de serviço para oficinas mecânicas. Ele automatiza os três processos principais da operação: entrada e identificação digital de veículos, diagnóstico técnico e aprovação de orçamentos pelo cliente, e execução dos serviços com entrega documentada. O sistema também conta com módulos de gestão de funcionários, peças, serviços, estoque e relatórios.

## Integrantes

- Lucas Henrique de Almeida Silva
- Victor de Castro Nakabayashi
- Vitor Ferreira de Abreu

## Orientador

- Cleia Marcia Gomes Amaral

---

## Instruções de utilização

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)
- [Node.js 20+](https://nodejs.org/)
- MySQL 8+

### 1. Banco de dados

Execute o script SQL disponível em [`db/4.3.3-modelo-fisico.md`](db/4.3.3-modelo-fisico.md) no seu MySQL para criar o banco `agilicar` e todas as tabelas.

Em seguida, insira os usuários iniciais com senhas encriptadas (BCrypt). Exemplo de insert para um gestor:

```sql
INSERT INTO usuario (nome, email, senha, id_perfil, ativo)
VALUES ('Admin', 'admin@agilicar.com', '$2a$11$...hash_bcrypt...', 1, 1);
```

> Os perfis são: **1 = Gestor**, **2 = Recepcionista**, **3 = Técnico**.

### 2. Backend (API)

Crie o arquivo de segredos locais (não versionado):

```
back-end/AgiliCar.API/appsettings.Local.json
```

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=agilicar;User=SEU_USUARIO;Password=SUA_SENHA;"
  },
  "Jwt": {
    "Key": "SUA_CHAVE_JWT_MINIMO_32_CARACTERES",
    "Issuer": "AgiliCar.API",
    "Audience": "AgiliCar.Frontend"
  }
}
```

Execute a API:

```bash
cd back-end/AgiliCar.API
dotnet run
```

A API ficará disponível em `http://localhost:5050`. O Swagger está acessível em `http://localhost:5050/index.html` (apenas em modo Development).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse o sistema em `http://localhost:5173`.

---

## Tecnologias utilizadas

| Camada         | Tecnologia                           |
| -------------- | ------------------------------------ |
| Frontend       | React 19 + Vite                      |
| Backend        | ASP.NET Core 8 Web API (C#)          |
| ORM            | Entity Framework Core + Pomelo MySQL |
| Autenticação   | JWT Bearer (8h) + BCrypt             |
| Banco de dados | MySQL 8                              |

---

## Processos automatizados

**Processo 1 — Entrada e identificação digital de veículos**
Busca de veículo por placa, cadastro de novo cliente e veículo, checklist visual fotográfico e registro de sintomas com abertura da Ordem de Serviço.

**Processo 2 — Diagnóstico, orçamento e aprovação**
Visualização da OS pelo técnico, lançamento de diagnóstico, seleção de peças e serviços, geração do orçamento, envio ao cliente e registro da decisão de aprovação ou reprovação.

**Processo 3 — Execução e entrega**
Atribuição de técnico responsável, execução dos serviços com registro fotográfico, acompanhamento pelo cliente e finalização com entrega documentada e assinatura digital.

---

# Documentação

<ol>
<li><a href="docs/1-Contexto.md"> Documentação de Contexto</a></li>
<li><a href="docs/2-Especificação.md"> Especificação do Projeto</a></li>
<li><a href="docs/3-Modelagem-Processos-Negócio.md"> Modelagem dos Processos de Negócio</a></li>
<li><a href="docs/4-Projeto-Solucao.md"> Projeto da Solução</a></li>
<li><a href="docs/5-Gerenciamento-Projeto.md"> Gerenciamento do Projeto</a></li>
<li><a href="docs/6-Interface-Sistema.md"> Interface do Sistema</a></li>
<li><a href="docs/7-Indicadores-Relatorios.md"> Indicadores de Desempenho e Relatórios</a></li>
<li><a href="docs/7-Conclusão.md"> Conclusão</a></li>
<li><a href="docs/8-Referências.md"> Referências</a></li>
</ol>

# Código

<li><a href="frontend/src/README.md"> Código Fonte — Frontend (React)</a></li>
<li><a href="back-end/AgiliCar.API/"> Código Fonte — Backend (ASP.NET Core)</a></li>

# Apresentação

<li><a href="docs/apresentacao/README.md"> Apresentação da solução</a></li>

---

## Histórico de versões

- 0.3.0
  - Implementação do Processo 3: execução de serviços, registro fotográfico e entrega ao cliente.
- 0.2.0
  - Implementação do Processo 2: diagnóstico técnico, orçamento e aprovação pelo cliente.
- 0.1.0
  - Implementação do Processo 1: entrada e identificação digital de veículos.
  - Adição dos módulos de gestão: funcionários, peças, serviços, estoque e relatórios.
- 0.0.1
  - Trabalhando na modelagem do processo de negócio.
