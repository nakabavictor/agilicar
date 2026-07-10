# 3. Modelagem dos Processos de Negócio

## 3.1 Modelagem da Situação Atual (AS-IS)

A análise dos processos atuais da oficina permitiu identificar atividades executadas de forma manual, com baixa padronização e pouca integração entre os setores envolvidos.

Atualmente, quando um cliente chega à oficina com seu veículo, o atendimento é realizado presencialmente por um recepcionista. As informações do cliente e do veículo são consultadas em fichas físicas, planilhas ou registros dispersos. Caso o cliente seja novo, seus dados e os dados do veículo são preenchidos manualmente em formulários de papel.

Após a identificação do cliente, o recepcionista realiza uma inspeção visual básica do veículo, registrando observações como avarias aparentes, quilometragem, nível de combustível e demais informações relevantes. Esse registro normalmente é realizado em formulários físicos ou anotações manuais.

Em seguida, os sintomas relatados pelo cliente são anotados e encaminhados para a equipe técnica. A comunicação entre recepcionistas e mecânicos ocorre principalmente de forma verbal ou por aplicativos de mensagens, sem um fluxo padronizado e centralizado.

Durante a etapa de diagnóstico, os técnicos realizam novas anotações sobre possíveis causas do problema e sobre as peças ou serviços necessários para o reparo. Essas informações frequentemente são registradas em documentos separados, dificultando a consolidação dos dados.

O acompanhamento do andamento da Ordem de Serviço depende da comunicação entre os funcionários, tornando o processo suscetível a falhas de informação, atrasos e retrabalho. Além disso, o controle do estoque de peças geralmente não está integrado às atividades realizadas na oficina, dificultando a atualização das quantidades disponíveis.

Os principais problemas observados incluem:

- utilização de registros em papel;
- dificuldade de rastreamento das informações;
- comunicação descentralizada entre funcionários e clientes;
- ausência de integração entre ordens de serviço e estoque;
- baixo controle do andamento dos serviços;
- possibilidade de perda ou inconsistência de dados;
- retrabalho no preenchimento e consulta de informações.

Esses problemas foram detalhados nos modelos AS-IS apresentados em cada processo documentado.

---

## 3.2 Modelagem da Situação Futura (TO-BE)

A proposta do sistema AgiliCar busca digitalizar e integrar os principais processos operacionais da oficina mecânica.

Com a implantação da solução, o processo de atendimento passará a ser realizado de forma totalmente digital e centralizada.

Ao receber o veículo, o recepcionista poderá consultar a placa diretamente no sistema para localizar os dados do cliente e do veículo. Caso não exista cadastro prévio, as informações serão registradas imediatamente na plataforma.

Após a identificação do veículo, será realizado um checklist eletrônico contendo observações sobre o estado geral do automóvel, quilometragem, itens visuais e registros fotográficos quando necessário. Os sintomas relatados pelo cliente serão cadastrados diretamente no sistema e vinculados à Ordem de Serviço.

A equipe técnica terá acesso imediato às informações registradas, podendo incluir diagnósticos, peças necessárias e serviços recomendados diretamente na plataforma. O orçamento será gerado automaticamente com base nos itens selecionados.

Após a aprovação do orçamento pelo cliente, a Ordem de Serviço será encaminhada para execução. Durante a realização dos serviços, os técnicos poderão registrar atualizações, observações e imagens diretamente no sistema, permitindo o acompanhamento em tempo real do andamento das atividades.

O sistema também realizará o controle integrado das peças utilizadas, possibilitando atualização automática do estoque e maior precisão no gerenciamento dos materiais.

Ao final do processo, a entrega do veículo será registrada digitalmente, incluindo quilometragem final, observações de encerramento e confirmação de recebimento pelo cliente.

Com a adoção do AgiliCar, espera-se:

- maior padronização das atividades;
- redução de erros operacionais;
- rastreabilidade das informações;
- integração entre atendimento, diagnóstico, execução e estoque;
- melhoria da comunicação com os clientes;
- maior controle das Ordens de Serviço;
- geração de relatórios operacionais e financeiros;
- suporte à tomada de decisão pelos gestores.

Os modelos TO-BE foram elaborados para representar os fluxos futuros apoiados pelo sistema.

A solução proposta está alinhada aos objetivos da oficina mecânica de aumentar a eficiência operacional, reduzir erros de comunicação e melhorar a experiência do cliente durante todo o ciclo de atendimento.

Como limitação, o sistema depende da correta utilização pelos colaboradores e da disponibilidade de acesso aos dispositivos utilizados para registro das informações. Apesar disso, os benefícios obtidos com a digitalização e integração dos processos superam significativamente as limitações operacionais identificadas no modelo atual.

---

## 3.3 Modelagem dos Processos

Os processos selecionados para modelagem foram detalhados individualmente nos documentos a seguir:

- [Processo 1 – Check-in e Abertura de Ordem de Serviço](../docs/processos/processo-1-checkin-e-abertura-os.md)
- [Processo 2 – Diagnóstico Técnico e Orçamento](../docs/processos/processo-2-diagnostico-e-orcamento.md)
- [Processo 3 – Controle de Status da Ordem de Serviço](../docs/processos/processo-3-controle-de-status.md)
- [Processo 4 – Gestão de Estoque Inteligente](../docs/processos/processo-4-gestao-de-estoque.md)
- [Processo 5 – faturamento](../docs/processos/processo-5-faturamento.md)
