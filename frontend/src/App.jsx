import { useState } from "react";
import { useAuth } from "./contexts/AuthContext.jsx";

import Login from "./pages/auth/Login.jsx";

// Processo 1
import IdentificacaoDigital from "./pages/processo1/IdentificacaoDigital.jsx";
import CadastroVeiculo from "./pages/processo1/CadastroVeiculo.jsx";
import ChecklistVisual from "./pages/processo1/CheckListVisual.jsx";
import RegistroSintomas from "./pages/processo1/RegistroSintomas.jsx";
import OSSalva from "./pages/processo1/OSSalva.jsx";

// Processo 2
import ReceberOSDigital from "./pages/processo2/ReceberOSDigital.jsx";
import VisualizarDadosOS from "./pages/processo2/VisualizarDadosOS.jsx";
import DiagnosticoTecnico from "./pages/processo2/Diagnosticotecnico.jsx";
import PecasServicos from "./pages/processo2/PecasServicos.jsx";
import ResumoOrcamento from "./pages/processo2/ResumoOrcamento.jsx";
import EnviarOrcamento from "./pages/processo2/EnviarOrcamento.jsx";
import AguardandoAprovacao from "./pages/processo2/AguardandoAprovacao.jsx";
import DecisaoCliente from "./pages/processo2/DecisaoCliente.jsx";
import ResultadoFinal from "./pages/processo2/ResultadoFinal.jsx";

// Processo 3
import AtribuicaoTecnico from "./pages/processo3/AtribuicaoTecnico.jsx";
import ExecucaoServicoTecnico from "./pages/processo3/ExecucaoServicoTecnico.jsx";
import ChecklistQualidade from "./pages/processo3/ChecklistQualidade.jsx";
import AcompanhamentoCliente from "./pages/processo3/AcompanhamentoCliente.jsx";

// Gestão
import Clientes from "./pages/cadastros/Clientes.jsx";
import Funcionarios from "./pages/cadastros/Funcionarios.jsx";
import Pecas from "./pages/cadastros/Pecas.jsx";
import Servicos from "./pages/cadastros/Servicos.jsx";
import Estoque from "./pages/estoque/Estoque.jsx";
import Relatorios from "./pages/relatorios/Relatorios.jsx";
import Veiculos from "./pages/veiculos/Veiculos.jsx";

function App() {
  const { usuario, carregando } = useAuth();
  const [tela, setTela] = useState("identificacao");

  const [osAtual, setOsAtual] = useState(null);
  const [veiculoAtual, setVeiculoAtual] = useState(null);
  const [clienteAtual, setClienteAtual] = useState(null);
  const [orcamentoAtual, setOrcamentoAtual] = useState(null);
  const [resultadoCliente, setResultadoCliente] = useState("");

  if (carregando) return null;
  if (!usuario) return <Login onLogin={() => setTela("identificacao")} />;

  function navegarMenu(id) {
    const map = {
      inicio: "identificacao",
      ordens: "receberOS",
      clientes: "clientes",
      veiculos: "veiculos",
      funcionarios: "funcionarios",
      pecas: "pecas",
      servicos: "servicos",
      estoque: "estoque",
      relatorios: "relatorios",
    };
    if (map[id]) setTela(map[id]);
  }

  return (
    <>
      {/* Processo 1 */}
      {tela === "identificacao" && (
        <IdentificacaoDigital
          onNavigate={navegarMenu}
          onNovoRegistro={() => setTela("cadastro")}
          onVeiculoEncontrado={(veiculo) => {
            setVeiculoAtual(veiculo);
            setClienteAtual({
              idCliente: veiculo.idCliente,
              nome: veiculo.nomeCliente,
              telefone: veiculo.telefoneCliente,
            });
            setTela("checklist");
          }}
        />
      )}

      {tela === "cadastro" && (
        <CadastroVeiculo
          onNavigate={navegarMenu}
          onCancelar={() => setTela("identificacao")}
          onProximo={(cliente, veiculo) => {
            setClienteAtual(cliente);
            setVeiculoAtual(veiculo);
            setTela("checklist");
          }}
        />
      )}

      {tela === "checklist" && (
        <ChecklistVisual
          onNavigate={navegarMenu}
          onVoltar={() => setTela("cadastro")}
          onProximo={() => setTela("sintomas")}
          idOs={osAtual?.idOs}
        />
      )}

      {tela === "sintomas" && (
        <RegistroSintomas
          onNavigate={navegarMenu}
          onVoltar={() => setTela("checklist")}
          onSalvar={(os) => {
            setOsAtual(os);
            setTela("osSalva");
          }}
          clienteAtual={clienteAtual}
          veiculoAtual={veiculoAtual}
        />
      )}

      {tela === "osSalva" && (
        <OSSalva
          onNavigate={navegarMenu}
          onVoltarInicio={() => {
            setOsAtual(null);
            setVeiculoAtual(null);
            setClienteAtual(null);
            setTela("identificacao");
          }}
          osAtual={osAtual}
          veiculoAtual={veiculoAtual}
          clienteAtual={clienteAtual}
        />
      )}

      {/* Processo 2 */}
      {tela === "receberOS" && (
        <ReceberOSDigital
          onNavigate={navegarMenu}
          onAbrirOS={(os) => {
            setOsAtual(os);
            setTela("visualizarOS");
          }}
        />
      )}

      {tela === "visualizarOS" && (
        <VisualizarDadosOS
          onNavigate={navegarMenu}
          onVoltar={() => setTela("receberOS")}
          onIniciarDiagnostico={() => setTela("diagnosticoTecnico")}
          osAtual={osAtual}
        />
      )}

      {tela === "diagnosticoTecnico" && (
        <DiagnosticoTecnico
          onNavigate={navegarMenu}
          onVoltar={() => setTela("visualizarOS")}
          onSalvarDiagnostico={() => setTela("pecasServicos")}
          osAtual={osAtual}
        />
      )}

      {tela === "pecasServicos" && (
        <PecasServicos
          onNavigate={navegarMenu}
          onVoltar={() => setTela("diagnosticoTecnico")}
          onAvancar={() => setTela("resumoOrcamento")}
          osAtual={osAtual}
        />
      )}

      {tela === "resumoOrcamento" && (
        <ResumoOrcamento
          onNavigate={navegarMenu}
          onVoltar={() => setTela("pecasServicos")}
          onGerarOrcamento={(orc) => {
            setOrcamentoAtual(orc);
            setTela("enviarOrcamento");
          }}
          osAtual={osAtual}
        />
      )}

      {tela === "enviarOrcamento" && (
        <EnviarOrcamento
          onNavigate={navegarMenu}
          onVoltar={() => setTela("resumoOrcamento")}
          onEnviar={() => setTela("aguardandoAprovacao")}
          osAtual={osAtual}
          orcamentoAtual={orcamentoAtual}
        />
      )}

      {tela === "aguardandoAprovacao" && (
        <AguardandoAprovacao
          onNavigate={navegarMenu}
          onVoltar={() => setTela("enviarOrcamento")}
          onAtualizarStatus={() => setTela("decisaoCliente")}
          osAtual={osAtual}
        />
      )}

      {tela === "decisaoCliente" && (
        <DecisaoCliente
          onNavigate={navegarMenu}
          onVoltar={() => setTela("aguardandoAprovacao")}
          onAprovar={() => {
            setResultadoCliente("aprovado");
            setTela("resultadoFinal");
          }}
          onNaoAprovar={() => {
            setResultadoCliente("naoAprovado");
            setTela("resultadoFinal");
          }}
          osAtual={osAtual}
          orcamentoAtual={orcamentoAtual}
        />
      )}

      {tela === "resultadoFinal" && (
        <ResultadoFinal
          onNavigate={navegarMenu}
          resultado={resultadoCliente}
          onVoltar={() => setTela("decisaoCliente")}
          onIniciarExecucao={() => setTela("atribuicaoTecnico")}
          onRevisarOrcamento={() => setTela("pecasServicos")}
          onEncerrarOS={() => setTela("receberOS")}
          osAtual={osAtual}
          orcamentoAtual={orcamentoAtual}
        />
      )}

      {/* Processo 3 */}
      {tela === "atribuicaoTecnico" && (
        <AtribuicaoTecnico
          onNavigate={navegarMenu}
          onVoltar={() => setTela("resultadoFinal")}
          onConfirmarTecnico={(osAtualizada) => {
            if (osAtualizada) setOsAtual(osAtualizada);
            setTela("execucaoTecnico");
          }}
          osAtual={osAtual}
        />
      )}

      {tela === "execucaoTecnico" && (
        <ExecucaoServicoTecnico
          onVoltar={() => setTela("atribuicaoTecnico")}
          onServicoConcluido={() => setTela("checklistQualidade")}
          onNavigate={navegarMenu}
          osAtual={osAtual}
        />
      )}

      {tela === "checklistQualidade" && (
        <ChecklistQualidade
          onVoltar={() => setTela("execucaoTecnico")}
          onAprovar={() => setTela("acompanhamentoCliente")}
          onNavigate={navegarMenu}
          osAtual={osAtual}
        />
      )}

      {tela === "acompanhamentoCliente" && (
        <AcompanhamentoCliente
          onVoltarInicio={() => {
            setOsAtual(null);
            setTela("identificacao");
          }}
          osAtual={osAtual}
        />
      )}

      {/* Gestão */}
      {tela === "clientes" && <Clientes onNavigate={navegarMenu} />}
      {tela === "funcionarios" && <Funcionarios onNavigate={navegarMenu} />}
      {tela === "pecas" && <Pecas onNavigate={navegarMenu} />}
      {tela === "servicos" && <Servicos onNavigate={navegarMenu} />}
      {tela === "estoque" && <Estoque onNavigate={navegarMenu} />}
      {tela === "relatorios" && <Relatorios onNavigate={navegarMenu} />}
      {tela === "veiculos" && <Veiculos onNavigate={navegarMenu} />}
    </>
  );
}

export default App;
