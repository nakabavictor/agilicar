## 7. Indicadores de Desempenho e Relatórios

Pré-requisitos: [Projeto da Solução](4-Projeto-Solucao.md)

Os indicadores de desempenho do AgiliCar foram definidos com base nas informações armazenadas no modelo relacional do sistema, especialmente na tabela `ordem_servico`, que centraliza o ciclo completo de atendimento da oficina. Os indicadores permitem ao gestor monitorar a eficiência operacional, identificar gargalos e tomar decisões baseadas em dados.

---

### 7.1 Indicadores de Desempenho (KPIs)

| Indicador                       | Objetivos                                                                                        | Descrição                                                                                                         | Fonte de dados         | Fórmula de cálculo                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------- |
| Taxa de Conclusão de OS         | Avaliar a eficiência do ciclo de atendimento, medindo quantas ordens são efetivamente concluídas | Percentual de ordens de serviço concluídas ou entregues em relação ao total de OS abertas no sistema              | Tabela `ordem_servico` | (qtd. OS com status `concluida` + `entregue`) / total de OS × 100         |
| Taxa de Cancelamento de OS      | Identificar problemas no fluxo de atendimento que levam ao abandono de ordens                    | Percentual de ordens de serviço canceladas em relação ao total, indicando falhas no processo ou recusa do cliente | Tabela `ordem_servico` | (qtd. OS com status `cancelada`) / total de OS × 100                      |
| Ticket Médio por OS             | Mensurar a receita média gerada por ordem de serviço para apoiar decisões de precificação        | Valor médio faturado por OS concluída, considerando mão de obra e peças                                           | Tabela `ordem_servico` | soma de `valor_total` (OS concluídas + entregues) / qtd. de OS concluídas |
| Taxa de Aprovação de Orçamentos | Medir a aceitação dos orçamentos pelos clientes e a competitividade da precificação              | Percentual de orçamentos aprovados pelo cliente em relação ao total de orçamentos gerados                         | Tabela `orcamento`     | (qtd. orçamentos com status `aprovado`) / total de orçamentos × 100       |

**Metas estabelecidas:**

| Indicador                       | Meta        | Justificativa                                                                |
| ------------------------------- | ----------- | ---------------------------------------------------------------------------- |
| Taxa de Conclusão de OS         | ≥ 70%       | Garantir que a maioria dos atendimentos iniciados seja concluída com sucesso |
| Taxa de Cancelamento de OS      | ≤ 10%       | Manter baixo índice de desistências para preservar a receita da oficina      |
| Ticket Médio por OS             | ≥ R$ 300,00 | Assegurar viabilidade financeira mínima por atendimento                      |
| Taxa de Aprovação de Orçamentos | ≥ 60%       | Indicar que a precificação está alinhada às expectativas dos clientes        |

---

### 7.2 Gráficos e Dashboard

O sistema AgiliCar disponibiliza um dashboard na tela de **Relatórios** (acessível pelo menu lateral), que compila os principais indicadores em tempo real a partir dos dados do banco de dados MySQL.

O painel apresenta:

- **Cards de KPI** com valor calculado em tempo real e indicador de meta atingida (✓) ou não (✗)
- **Gráfico de barras** com a distribuição percentual de OS por status (Aberta, Em Execução, Aguardando Peça, Concluída, Entregue, Cancelada)
- **Cards de resumo** com total de OS, OS em aberto, OS concluídas e receita realizada
- **Tabela de OS** com filtro por status e busca por número, cliente ou placa

Os dados exibidos no dashboard são gerados diretamente das tabelas `ordem_servico` e `orcamento`, garantindo que os indicadores reflitam sempre o estado atual da operação da oficina.

![Dashboard de Relatórios](images/relatorios-dashboard.png)
