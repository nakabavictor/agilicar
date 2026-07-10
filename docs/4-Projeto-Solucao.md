## 4. Projeto da Solução

Pré-requisitos [Modelagem do Processo de Negocio](./3-Modelagem-Processos-Negócio.md)

## 4.1. Arquitetura da solução
<img width="2800" height="1640" alt="image" src="https://github.com/user-attachments/assets/408439e7-a1c8-430c-8ca4-003c26a140c3" />
 

### 4.2. Protótipos de telas

Visão geral da interação do usuário pelas telas do sistema e protótipo interativo das telas com as funcionalidades que fazem parte do sistema (wireframes).
Apresente as principais interfaces da plataforma. Discuta como ela foi elaborada de forma a atender os requisitos funcionais, não funcionais e histórias de usuário abordados nas <a href="02-Especificação do Projeto.md"> Especificação do Projeto</a>.
A partir das atividades de usuário identificadas na seção anterior, elabore o protótipo de tela de cada uma delas.
![Exemplo de Wireframe](images/wireframe-example.png)

São protótipos usados em design de interface para sugerir a estrutura de um site web e seu relacionamentos entre suas páginas. Um wireframe web é uma ilustração semelhante do layout de elementos fundamentais na interface.
 
> **Links Úteis**:
> - [Protótipos vs Wireframes](https://www.nngroup.com/videos/prototypes-vs-wireframes-ux-projects/)
> - [Ferramentas de Wireframes](https://rockcontent.com/blog/wireframes/)
> - [MarvelApp](https://marvelapp.com/developers/documentation/tutorials/)
> - [Figma](https://www.figma.com/)
> - [Adobe XD](https://www.adobe.com/br/products/xd.html#scroll)
> - [Axure](https://www.axure.com/edu) (Licença Educacional)
> - [InvisionApp](https://www.invisionapp.com/) (Licença Educacional)


## Diagrama de Classes

O diagrama de classes ilustra graficamente como será a estrutura do software, e como cada uma das classes da sua estrutura estarão interligadas. Essas classes servem de modelo para materializar os objetos que executarão na memória.

As referências abaixo irão auxiliá-lo na geração do artefato “Diagrama de Classes”.

> - [Diagramas de Classes - Documentação da IBM](https://www.ibm.com/docs/pt-br/rational-soft-arch/9.6.1?topic=diagrams-class)
> - [O que é um diagrama de classe UML? | Lucidchart](https://www.lucidchart.com/pages/pt/o-que-e-diagrama-de-classe-uml)


### 4.3. Modelo de dados

Objetivo de criar um banco de dados para o sistema AgiliCar, plataforma digital voltada ao gerenciamento completo de oficinas mecânicas. O banco de dados tem como objetivo centralizar e integrar todas as informações geradas ao longo do ciclo de atendimento, desde o cadastro do cliente e do veículo, passando pela abertura e execução das Ordens de Serviço, controle de estoque de peças, geração e aprovação de orçamentos, registro fotográfico dos serviços, até o envio de notificações automáticas e a confirmação de entrega do veículo ao cliente. O sistema contempla quatro perfis de usuário, gestor, técnico, atendente e cliente, controlando o acesso e as operações disponíveis conforme o papel de cada um. O banco foi projetado para o SGBD MySQL,  garantindo integridade referencial, suporte a transações e rastreabilidade completa de todas as movimentações operacionais da oficina.

#### 4.3.1 Modelo ER

<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/d5aaf4ad-e8ae-48c1-85bd-4860832707ea" />


#### 4.3.2 Esquema Relacional

<img width="1349" height="639" alt="image" src="https://github.com/user-attachments/assets/c89eddbb-426c-481f-b308-3cbc8667720b" />


#### 4.3.3 Modelo Físico


O script de criação do banco de dados está disponível em [`src/db/agilicar.sql`](../src/db/4.3.3-modelo-fisico.md).


### 4.4. Tecnologias

_Descreva qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas._

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.


| **Dimensão**   | **Tecnologia**  |
| ---            | ---             |
| SGBD           | MySQL           |
| Front end      | HTML+CSS+JS+React     |
| Back end       | C# ASP .NET Core |
| Deploy         |     |

