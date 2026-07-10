### 3.3.5 Processo 5 – Faturamento e Entrega

O Processo 5 tem como objetivo validar a qualidade do serviço executado, realizar o faturamento da Ordem de Serviço, comunicar o cliente sobre a conclusão da manutenção, registrar a retirada do veículo e efetuar o encerramento definitivo da OS.

Atualmente, a etapa de entrega do veículo pode depender de controles manuais, comunicação informal com o cliente e registros descentralizados, dificultando a rastreabilidade das informações e aumentando o risco de inconsistências no fechamento da Ordem de Serviço.

Com a utilização do sistema AgiliCar, todas as etapas de faturamento e entrega passam a ser registradas digitalmente, permitindo maior controle sobre a finalização do atendimento, emissão de comprovantes, registro da retirada do veículo e armazenamento do histórico completo da manutenção.

#### Início do Processo

O processo inicia quando a execução dos serviços é concluída e a Ordem de Serviço é encaminhada para a etapa de controle de qualidade e faturamento.

#### Participantes

- Técnico/Mecânico;
- Gestor da Oficina caso precise revisar;
- Cliente;
- Sistema AgiliCar.

#### Atividades do Processo

1. Receber a Ordem de Serviço concluída;
2. Realizar inspeção e checklist de qualidade;
3. Verificar conformidade dos serviços executados;
4. Registrar aprovação da inspeção;
5. Calcular valores finais da Ordem de Serviço;
6. Gerar faturamento da OS;
7. Emitir comprovantes e documentos financeiros;
8. Notificar o cliente sobre a conclusão do serviço;
9. Registrar a retirada do veículo;
10. Confirmar o recebimento pelo cliente;
11. Encerrar a Ordem de Serviço;
12. Armazenar o histórico da manutenção e do faturamento.

#### Fim do Processo

O processo é finalizado quando o veículo é entregue ao cliente, a Ordem de Serviço é encerrada e todas as informações de faturamento, entrega e histórico do serviço são registradas no sistema.

#### Oportunidades de Melhoria

- Padronização da inspeção de qualidade;
- Controle digital da entrega do veículo;
- Comunicação automática com o cliente;
- Registro eletrônico da retirada;
- Emissão automática de comprovantes;
- Encerramento digital da Ordem de Serviço;
- Histórico completo de faturamento e entrega.

![Modelo BPMN do Processo 5](..\images\processo5_corrigido.drawio.png)

---

## Detalhamento das atividades

### Check-list de Qualidade

| Campo                                 | Tipo             | Restrições  | Valor Default |
| ------------------------------------- | ---------------- | ----------- | ------------- |
| Serviço executado conforme solicitado | Seleção múltipla | Obrigatório | Não marcado   |
| Peças instaladas corretamente         | Seleção múltipla | Obrigatório | Não marcado   |
| Teste de rodagem realizado            | Seleção múltipla | Obrigatório | Não marcado   |
| Ausência de vazamentos ou ruídos      | Seleção múltipla | Obrigatório | Não marcado   |
| Limpeza interna e externa realizada   | Seleção múltipla | Obrigatório | Não marcado   |
| Documentação e fotos registradas      | Seleção múltipla | Obrigatório | Não marcado   |
| Observações Finais                    | Área de texto    | Opcional    |               |

| Comandos         | Destino              | Tipo    |
| ---------------- | -------------------- | ------- |
| Aprovar          | Liberação do veiculo | default |
| Solicitar Ajuste | Processo 3           | cancel  |

---

### Liberação do veiculo

| Comandos                       | Destino                 | Tipo    |
| ------------------------------ | ----------------------- | ------- |
| Confirmar Liberação do veiculo | Notificação ao Cliente  | default |
| Cancelar                       | Check-list de Qualidade | cancel  |

---

### Notificação ao Cliente

| Campo                   | Tipo          | Restrições          | Valor Default |
| ----------------------- | ------------- | ------------------- | ------------- |
| Mensagem de Notificação | Área de texto | Enviada manualmente | Sistema       |
| Canal de Comunicação    | Seleção única | WhatsApp ou E-mail  | WhatsApp      |

---

### Encerramento da OS

| Campo                         | Tipo           | Restrições      | Valor Default |
| ----------------------------- | -------------- | --------------- | ------------- |
| Número da OS                  | Caixa de texto | Somente leitura | Sistema       |
| Status Final                  | Caixa de texto | Somente leitura | Encerrada     |
| Data de Encerramento          | Data e Hora    | Automático      | Sistema       |
| Histórico Completo do Serviço | Área de texto  | Somente leitura | Sistema       |

| Comandos             | Destino           | Tipo    |
| -------------------- | ----------------- | ------- |
| Finalizar Processo   | Fim do Processo 5 | default |
| Visualizar Histórico | Histórico da OS   |         |

---

### WIREFRAMES - PROCESSO 5

![WR-1](..\images\wireframes\WF-check-list-qualidade.png "WF-01 – Check-list de Qualidade")
![WR-2](..\images\wireframes\WF-acompanhamento-cliente.png "WF-02 – Liberação do Veículo")
![WR-3](..\images\wireframes\WF-OS.png "WF-03 – OS detalhes")
