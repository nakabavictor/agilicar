### 3.3.1 Processo 1 – Check-in e Abertura de Ordem de Serviço

O processo de Check-in e Abertura de Ordem de Serviço tem como objetivo formalizar a entrada do veículo na oficina e registrar todas as informações necessárias para o início do atendimento.

Atualmente, esse processo é realizado por meio de anotações manuais e comunicação informal entre os colaboradores, dificultando o rastreamento das informações e aumentando a possibilidade de erros operacionais.

Com a utilização do sistema AgiliCar, todas as informações passam a ser registradas digitalmente, permitindo maior controle sobre o histórico do veículo, geração automática da Ordem de Serviço e acompanhamento do processo desde o primeiro contato com o cliente.

#### Início do Processo

O processo inicia quando o cliente chega à oficina e solicita atendimento para seu veículo.

#### Participantes

- Cliente;
- Atendente/Consultor de Serviços;
- Sistema AgiliCar;
- Equipe Técnica caso precise.

#### Atividades do Processo

1. Identificar cliente e veículo;
2. Verificar existência de cadastro;
3. Realizar cadastro quando necessário;
4. Recuperar histórico de manutenção;
5. Executar checklist de entrada;
6. Registrar fotografias do veículo;
7. Registrar sintomas relatados pelo cliente;
8. Gerar Ordem de Serviço;
9. Armazenar os dados no sistema;
10. Encaminhar o veículo para diagnóstico técnico.

#### Fim do Processo

O processo é encerrado quando a Ordem de Serviço é gerada e o veículo é encaminhado para o setor de diagnóstico técnico.

#### Oportunidades de Melhoria

- Eliminação de registros em papel;
- Centralização das informações de clientes e veículos;
- Registro digital do checklist de entrada;
- Registro fotográfico do estado do veículo;
- Geração automática da Ordem de Serviço;
- Rastreabilidade completa do atendimento;
- Integração entre recepção e equipe técnica.

![Modelo BPMN do Processo 1](..\images\processo_1.png "Modelo BPMN do Processo 1")

#### Detalhamento das atividades

---

### buscar veículo pela placa

| **Campo**        | **Tipo**       | **Restrições**                        | **Valor Default** |
| ---------------- | -------------- | ------------------------------------- | ----------------- |
| Placa do veículo | Caixa de texto | Formato de placa válido e obrigatório | Vazio             |

| **Comandos**  | **Destino**                 | **Tipo** |
| ------------- | --------------------------- | -------- |
| Novo Cadastro | Cadastro de Cliente/Veículo | Botão    |

### Cadastro do Cliente/Veículo

| **Campo**           | **Tipo**       | **Restrições**                                    | **Valor Default** |
| ------------------- | -------------- | ------------------------------------------------- | ----------------- |
| Placa do veículo    | Caixa de texto | Formato de placa válido e obrigatório             | Vazio             |
| Nome do cliente     | Caixa de texto | Obrigatório para novo cadastro                    | Vazio             |
| Telefone / WhatsApp | Caixa de texto | Obrigatório para novo cadastro                    | Vazio             |
| Modelo              | Caixa de texto | Formato válido                                    | Vazio             |
| Marca               | Caixa de texto | Formato válido                                    | Vazio             |
| Ano                 | Caixa de texto | Formato válido                                    | Vazio             |
| Quilometragem atual | Número         | Maior que zero                                    | Vazio             |
| Tipo de combustível | Seleção única  | Gasolina, Etanol, Flex, Diesel, Elétrico, Híbrido | Vazio             |

| **Comandos**  | **Destino**                   | **Tipo**        |
| ------------- | ----------------------------- | --------------- |
| Novo Cadastro | Cadastro de Cliente e Veículo | default (botão) |
| Cancelar      | Fim do Processo               | cancel (botão)  |

---

### Recuperar Histórico do Veículo

| **Campo**                    | **Tipo**      | **Restrições**  | **Valor Default** |
| ---------------------------- | ------------- | --------------- | ----------------- |
| Histórico de Manutenções     | Tabela        | Somente leitura |                   |
| Ordens de Serviço Anteriores | Tabela        | Somente leitura |                   |
| Observações Registradas      | Área de texto | Somente leitura |                   |

| **Comandos**    | **Destino**                  | **Tipo** |
| --------------- | ---------------------------- | -------- |
| Salvar Cadastro | Check-list Visual do Veículo | default  |
| Cancelar        | Fim do Processo              | cancel   |

---

### Check-list Visual do Veículo

| **Campo**              | **Tipo**         | **Restrições**    | **Valor Default** |
| ---------------------- | ---------------- | ----------------- | ----------------- |
| Observações de avarias | Área de texto    | Opcional          | Vazio             |
| Fotos do veículo       | Imagem           | Múltiplas imagens | Vazio             |
| Itens verificados      | Seleção múltipla | Checklist padrão  | Vazio             |

| **Comandos**       | **Destino**                  | **Tipo** |
| ------------------ | ---------------------------- | -------- |
| Capturar Foto      | Check-list Visual do Veículo | default  |
| Salvar e Continuar | Registro de Sintomas         | default  |
| Cancelar           | Fim do Processo              | cancel   |

---

### Registro de Sintomas

| **Campo**             | **Tipo**      | **Restrições**              | **Valor Default** |
| --------------------- | ------------- | --------------------------- | ----------------- |
| Descrição do problema | Área de texto | Obrigatório                 | Vazio             |
| Prioridade            | Seleção única | Baixa, Média, Alta, Urgente | Média             |

| **Comandos**       | **Destino**                  | **Tipo** |
| ------------------ | ---------------------------- | -------- |
| Salvar Informações | Gerar Ordem de Serviço       | default  |
| Voltar             | Check-list Visual do Veículo | cancel   |

---

### OS Salva

| **Campo**               | **Tipo**       | **Restrições**         | **Valor Default**      |
| ----------------------- | -------------- | ---------------------- | ---------------------- |
| Número da OS            | Caixa de texto | Gerado automaticamente | Sequencial             |
| Placa do veículo        | Caixa de texto | Somente leitura        | Dados da OS            |
| Nome do cliente         | Caixa de texto | Somente leitura        | Dados da OS            |
| Status da OS            | Seleção única  | Somente leitura        | Aguardando Diagnóstico |
| Mensagem de confirmação | Área de texto  | Somente leitura        | OS salva com sucesso   |

| **Comandos**       | **Destino**                   | **Tipo** |
| ------------------ | ----------------------------- | -------- |
| Imprimir Protocolo | Impressão da Ordem de Serviço | default  |
| Voltar ao Início   | Tela Inicial                  | default  |

---

### WIREFRAMES - PROCESSO 1

![WR-1](..\images\wireframes\WF-identificacao.png "WF-01 – Identificação Digital")
![WR-2](..\images\wireframes\WF-CADASTRO-CLIENTE-VEIC.png "WF-02 – Cadastro")
![WR-3](..\images\wireframes\WF-check-list.png "WF-03 – Check-list")
![WR-4](..\images\wireframes\WF-registro-sintomas.png "WF-04 – Registro dos sintomas")
![WR-5](..\images\wireframes\WF-OSsalva.png "WF-05 – OS salva")
