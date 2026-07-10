### 3.3.2 Processo 2 – Diagnóstico Técnico e Orçamento

O Processo 2 tem como objetivo realizar o diagnóstico técnico do veículo, registrar as falhas identificadas, definir as peças e serviços necessários, gerar o orçamento e submetê-lo à aprovação do cliente.

Atualmente, o diagnóstico e a elaboração de orçamentos podem depender de consultas manuais ao histórico do veículo, levantamentos separados de peças e serviços e comunicação informal com o cliente, aumentando o tempo de atendimento e a possibilidade de erros.

Com a utilização do sistema AgiliCar, o histórico de manutenção fica disponível de forma integrada, as peças podem ser consultadas diretamente no estoque, o orçamento é gerado automaticamente e a aprovação do cliente passa a ser registrada digitalmente, garantindo maior controle e rastreabilidade.

#### Início do Processo

O processo inicia quando uma Ordem de Serviço é encaminhada para a equipe técnica após a conclusão do check-in do veículo.

#### Participantes

- Técnico/Mecânico;
- Cliente;
- Sistema AgiliCar;

#### Atividades do Processo

1. Receber a Ordem de Serviço digital;
2. Consultar dados do cliente, veículo e histórico;
3. Realizar diagnóstico técnico;
4. Registrar falhas identificadas;
5. Definir peças e serviços necessários;
6. Consultar disponibilidade em estoque;
7. Gerar orçamento;
8. Enviar orçamento ao cliente;
9. Registrar aprovação ou reprovação;
10. Encaminhar para execução ou revisão.

#### Fim do Processo

O processo é finalizado quando o orçamento é aprovado e a Ordem de Serviço é encaminhada para execução ou quando a OS é encerrada por reprovação do cliente.

#### Oportunidades de Melhoria

- Eliminação de registros manuais em papel;
- Consulta automática ao histórico de manutenção do veículo;
- Integração com o estoque para verificação de disponibilidade das peças;
- Geração automática de orçamento;
- Envio digital do orçamento por WhatsApp ou e-mail;
- Registro eletrônico da aprovação ou reprovação do cliente;
- Rastreabilidade completa das decisões tomadas durante o processo.

![Modelo BPMN do Processo 2](..\images\processo2.drawio.png)

---

## Detalhamento das atividades

### Receber Ordem de Serviço Digital

| Campo                   | Tipo           | Restrições      | Valor Default         |
| ----------------------- | -------------- | --------------- | --------------------- |
| Número da OS            | Caixa de texto | Somente leitura | Gerado pelo sistema   |
| Nome do Cliente         | Caixa de texto | Somente leitura | Cadastro do cliente   |
| Telefone                | Caixa de texto | Somente leitura | Cadastro do cliente   |
| Marca do Veículo        | Caixa de texto | Somente leitura | Cadastro do veículo   |
| Modelo do Veículo       | Caixa de texto | Somente leitura | Cadastro do veículo   |
| Placa                   | Caixa de texto | Formato AAA0A00 | Cadastro do veículo   |
| Histórico de Manutenção | Área de texto  | Somente leitura | Histórico registrado  |
| Sintomas Relatados      | Área de texto  | Obrigatório     | Informado na recepção |

| Comandos             | Destino                      | Tipo    |
| -------------------- | ---------------------------- | ------- |
| Abrir OS             | Visualização dos Dados da OS | default |
| Visualizar Histórico | Visualização dos Dados da OS |         |
| Iniciar Diagnóstico  | Diagnóstico Técnico          | default |

---

### Visualização dos Dados da OS

| Campo                   | Tipo          | Restrições      | Valor Default |
| ----------------------- | ------------- | --------------- | ------------- |
| Dados do Cliente        | Área de texto | Somente leitura | Cadastro      |
| Dados do Veículo        | Área de texto | Somente leitura | Cadastro      |
| Histórico de Manutenção | Área de texto | Somente leitura | Sistema       |
| Problema Relatado       | Área de texto | Somente leitura | Recepção      |
| Observações             | Área de texto | Opcional        |               |

| Comandos            | Destino                          | Tipo    |
| ------------------- | -------------------------------- | ------- |
| Voltar              | Receber Ordem de Serviço Digital | cancel  |
| Iniciar Diagnóstico | Diagnóstico Técnico              | default |

---

### Diagnóstico Técnico

| Campo                 | Tipo          | Restrições                                   | Valor Default |
| --------------------- | ------------- | -------------------------------------------- | ------------- |
| Falha Identificada    | Área de texto | Obrigatório                                  |               |
| Categoria do Problema | Seleção única | Mecânico, Elétrico, Suspensão, Freios, Motor |               |
| Severidade            | Seleção única | Baixa, Média, Alta, Crítica                  |               |
| Observações Técnicas  | Área de texto | Opcional                                     |               |

| Comandos           | Destino                      | Tipo    |
| ------------------ | ---------------------------- | ------- |
| Adicionar Falha    | Diagnóstico Técnico          |         |
| Salvar Diagnóstico | Registro de Peças e Serviços |         |
| Continuar          | Registro de Peças e Serviços | default |
| Voltar             | Visualização dos Dados da OS | cancel  |

---

### Registro de Peças e Serviços

| Campo                      | Tipo          | Restrições             | Valor Default |
| -------------------------- | ------------- | ---------------------- | ------------- |
| Tipo do Item               | Seleção única | Peça ou Serviço        | Peça          |
| Peça/Serviço               | Seleção única | Cadastro existente     |               |
| Quantidade                 | Número        | Maior que zero         | 1             |
| Valor Unitário             | Número        | Maior ou igual a zero  | Cadastro      |
| Disponibilidade em Estoque | Número        | Somente leitura        | Sistema       |
| Lista de Itens Adicionados | Tabela        | Gerada automaticamente |               |

| Comandos               | Destino                      | Tipo    |
| ---------------------- | ---------------------------- | ------- |
| Adicionar Item         | Registro de Peças e Serviços |         |
| Consultar Estoque      | Registro de Peças e Serviços |         |
| Remover Item           | Registro de Peças e Serviços |         |
| Avançar para Orçamento | Resumo do Orçamento          | default |
| Voltar                 | Diagnóstico Técnico          | cancel  |

---

### Resumo do Orçamento

| Campo                | Tipo          | Restrições                | Valor Default |
| -------------------- | ------------- | ------------------------- | ------------- |
| Valor das Peças      | Número        | Calculado automaticamente | Sistema       |
| Valor da Mão de Obra | Número        | Calculado automaticamente | Sistema       |
| Custos Adicionais    | Número        | Opcional                  | 0             |
| Prazo Estimado       | Número        | Dias                      |               |
| Valor Total          | Número        | Calculado automaticamente | Sistema       |
| Observações          | Área de texto | Opcional                  |               |

| Comandos         | Destino                      | Tipo    |
| ---------------- | ---------------------------- | ------- |
| Gerar Orçamento  | Envio de Orçamento           |         |
| Editar Valores   | Registro de Peças e Serviços |         |
| Salvar Orçamento | Envio de Orçamento           | default |
| Voltar           | Registro de Peças e Serviços | cancel  |

---

### Envio de Orçamento

| Campo                  | Tipo          | Restrições              | Valor Default |
| ---------------------- | ------------- | ----------------------- | ------------- |
| Documento do Orçamento | Arquivo       | PDF gerado pelo sistema | Sistema       |
| Valor Total            | Número        | Somente leitura         | Sistema       |
| Observações ao Cliente | Área de texto | Opcional                |               |
| Canal de Envio         | Seleção única | WhatsApp ou E-mail      |               |

| Comandos         | Destino              | Tipo    |
| ---------------- | -------------------- | ------- |
| Enviar Orçamento | Aguardando Aprovação | default |
| Reenviar         | Aguardando Aprovação |         |
| Cancelar         | Resumo do Orçamento  | cancel  |

---

### Aguardando Aprovação

| Campo                    | Tipo           | Restrições      | Valor Default        |
| ------------------------ | -------------- | --------------- | -------------------- |
| Status da Solicitação    | Caixa de texto | Somente leitura | Aguardando Aprovação |
| Histórico de Comunicação | Área de texto  | Somente leitura | Sistema              |
| Data de Envio            | Data e Hora    | Somente leitura | Sistema              |

| Comandos         | Destino            | Tipo    |
| ---------------- | ------------------ | ------- |
| Atualizar Status | Decisão do Cliente | default |
| Voltar           | Envio de Orçamento | cancel  |

---

### Decisão do Cliente

| Campo                 | Tipo          | Restrições            | Valor Default |
| --------------------- | ------------- | --------------------- | ------------- |
| Status da Aprovação   | Seleção única | Aprovado ou Reprovado |               |
| Observação do Cliente | Área de texto | Opcional              |               |

| Comandos    | Destino              | Tipo    |
| ----------- | -------------------- | ------- |
| Aprovar     | Resultado Final      | default |
| Não Aprovar | Resultado Final      | default |
| Voltar      | Aguardando Aprovação | cancel  |

---

### Resultado Final

| Campo                    | Tipo           | Restrições      | Valor Default |
| ------------------------ | -------------- | --------------- | ------------- |
| Resultado da Solicitação | Caixa de texto | Somente leitura | Sistema       |
| Status Final da OS       | Caixa de texto | Somente leitura | Sistema       |
| Observações Finais       | Área de texto  | Opcional        |               |

| Comandos          | Destino                          | Tipo    |
| ----------------- | -------------------------------- | ------- |
| Iniciar Execução  | Processo 3 – Execução do Serviço | default |
| Revisar Orçamento | Registro de Peças e Serviços     |         |
| Encerrar OS       | Fim do Processo                  | cancel  |

---

### WIREFRAMES - PROCESSO 2

![WR-1](..\images\wireframes\WF-identificacao.png "WF-01 – Identificação Digital")
![WR-2](..\images\wireframes\WF-CADASTRO-CLIENTE-VEIC.png "WF-02 – Cadastro")
![WR-3](..\images\wireframes\WF-check-list.png "WF-03 – Check-list")
![WR-4](..\images\wireframes\WF-registro-sintomas.png "WF-04 – Registro dos sintomas")
![WR-5](..\images\wireframes\WF-OSsalva.png "WF-05 – OS salva")
