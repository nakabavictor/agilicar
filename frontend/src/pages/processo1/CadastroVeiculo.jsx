import { useState } from "react";
import AppLayout from "../../components/AppLayout.jsx";
import { clientes, veiculos } from "../../services/api.js";

function CadastroVeiculo({ onCancelar, onProximo, onNavigate }) {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    placa: "",
    modelo: "",
    marca: "",
    ano: "",
    km: "",
    combustivel: "",
  });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErro("");
  }

  async function handleProximo() {
    const obrigatorios = [
      "nome",
      "telefone",
      "placa",
      "modelo",
      "marca",
      "km",
      "combustivel",
    ];
    const vazio = obrigatorios.find((c) => !formData[c].toString().trim());
    if (vazio) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setCarregando(true);
    setErro("");
    try {
      const cliente = await clientes.criar({
        nome: formData.nome,
        telefone: formData.telefone,
      });
      const veiculo = await veiculos.criar({
        idCliente: cliente.idCliente,
        placa: formData.placa.toUpperCase(),
        modelo: formData.modelo,
        marca: formData.marca,
        ano: formData.ano ? parseInt(formData.ano) : null,
        combustivel: formData.combustivel,
      });
      onProximo(
        { ...cliente, km: parseInt(formData.km) },
        { ...veiculo, km: parseInt(formData.km) },
      );
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <AppLayout active="inicio" onNavigate={onNavigate}>
      <section className="form-screen">
        <div className="screen-title">
          <h2>Novo Cadastro</h2>
          <p>Preencha os dados do cliente e do veículo.</p>
        </div>

        <form className="process-form">
          <label>
            Nome do Cliente *
            <input
              type="text"
              name="nome"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleChange}
            />
          </label>
          <label>
            WhatsApp/Telefone *
            <input
              type="tel"
              name="telefone"
              placeholder="(00) 00000-0000"
              value={formData.telefone}
              onChange={handleChange}
            />
          </label>
          <label>
            Placa *
            <input
              type="text"
              name="placa"
              placeholder="ABC1D23"
              value={formData.placa}
              onChange={handleChange}
              maxLength={8}
            />
          </label>
          <label>
            Marca *
            <input
              type="text"
              name="marca"
              placeholder="Ex: Volkswagen"
              value={formData.marca}
              onChange={handleChange}
            />
          </label>
          <label>
            Modelo *
            <input
              type="text"
              name="modelo"
              placeholder="Ex: Gol 1.6"
              value={formData.modelo}
              onChange={handleChange}
            />
          </label>
          <label>
            Ano
            <input
              type="number"
              name="ano"
              placeholder="Ex: 2020"
              value={formData.ano}
              onChange={handleChange}
            />
          </label>
          <label>
            KM Atual *
            <input
              type="number"
              name="km"
              placeholder="Quilometragem"
              value={formData.km}
              onChange={handleChange}
            />
          </label>
          <label>
            Tipo de Combustível *
            <select
              name="combustivel"
              value={formData.combustivel}
              onChange={handleChange}
            >
              <option value="" disabled>
                Selecione
              </option>
              <option value="gasolina">Gasolina</option>
              <option value="etanol">Etanol</option>
              <option value="flex">Flex</option>
              <option value="diesel">Diesel</option>
              <option value="eletrico">Elétrico</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </label>

          {erro && <p className="form-error">{erro}</p>}

          <div className="form-actions">
            <button className="btn-outline" type="button" onClick={onCancelar}>
              Cancelar
            </button>
            <button
              className="btn-main"
              type="button"
              onClick={handleProximo}
              disabled={carregando}
            >
              {carregando ? "Salvando..." : "Próximo Passo"}
            </button>
          </div>
        </form>
      </section>
    </AppLayout>
  );
}

export default CadastroVeiculo;
