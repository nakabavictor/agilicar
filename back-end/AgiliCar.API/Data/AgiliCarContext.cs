using AgiliCar.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AgiliCar.API.Data;

public class AgiliCarContext(DbContextOptions<AgiliCarContext> options) : DbContext(options)
{
    public DbSet<Perfil> Perfis { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Veiculo> Veiculos { get; set; }
    public DbSet<OrdemServico> OrdensServico { get; set; }
    public DbSet<Servico> Servicos { get; set; }
    public DbSet<OsServico> OsServicos { get; set; }
    public DbSet<Orcamento> Orcamentos { get; set; }
    public DbSet<Peca> Pecas { get; set; }
    public DbSet<Estoque> Estoques { get; set; }
    public DbSet<OsPeca> OsPecas { get; set; }
    public DbSet<RegistroFotografico> RegistrosFotograficos { get; set; }
    public DbSet<Notificacao> Notificacoes { get; set; }
    public DbSet<Entrega> Entregas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Perfil>(entity =>
        {
            entity.ToTable("perfil");
            entity.HasKey(e => e.IdPerfil);
            entity.Property(e => e.IdPerfil).HasColumnName("id_perfil");
            entity.Property(e => e.NomePerfil).HasColumnName("nome_perfil").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Descricao).HasColumnName("descricao").HasMaxLength(255);
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("cliente");
            entity.HasKey(e => e.IdCliente);
            entity.Property(e => e.IdCliente).HasColumnName("id_cliente");
            entity.Property(e => e.Nome).HasColumnName("nome").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Cpf).HasColumnName("cpf").HasMaxLength(14);
            entity.Property(e => e.Telefone).HasColumnName("telefone").HasMaxLength(20);
            entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(100);
            entity.Property(e => e.Endereco).HasColumnName("endereco").HasMaxLength(255);
            entity.Property(e => e.DataCadastro).HasColumnName("data_cadastro");
            entity.HasIndex(e => e.Cpf).IsUnique();
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("usuario");
            entity.HasKey(e => e.IdUsuario);
            entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");
            entity.Property(e => e.IdPerfil).HasColumnName("id_perfil");
            entity.Property(e => e.Nome).HasColumnName("nome").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Senha).HasColumnName("senha").HasMaxLength(255).IsRequired();
            entity.Property(e => e.Ativo).HasColumnName("ativo");
            entity.Property(e => e.DataCadastro).HasColumnName("data_cadastro");
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasOne(e => e.Perfil)
                  .WithMany(p => p.Usuarios)
                  .HasForeignKey(e => e.IdPerfil)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Veiculo>(entity =>
        {
            entity.ToTable("veiculo");
            entity.HasKey(e => e.IdVeiculo);
            entity.Property(e => e.IdVeiculo).HasColumnName("id_veiculo");
            entity.Property(e => e.IdCliente).HasColumnName("id_cliente");
            entity.Property(e => e.Placa).HasColumnName("placa").HasMaxLength(10).IsRequired();
            entity.Property(e => e.Modelo).HasColumnName("modelo").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Marca).HasColumnName("marca").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Ano).HasColumnName("ano");
            entity.Property(e => e.Cor).HasColumnName("cor").HasMaxLength(50);
            entity.Property(e => e.Chassi).HasColumnName("chassi").HasMaxLength(17);
            entity.Property(e => e.Combustivel).HasColumnName("combustivel").HasMaxLength(20).HasDefaultValue("flex");
            entity.HasIndex(e => e.Placa).IsUnique();
            entity.HasIndex(e => e.Chassi).IsUnique();
            entity.HasOne(e => e.Cliente)
                  .WithMany(c => c.Veiculos)
                  .HasForeignKey(e => e.IdCliente)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<OrdemServico>(entity =>
        {
            entity.ToTable("ordem_servico");
            entity.HasKey(e => e.IdOs);
            entity.Property(e => e.IdOs).HasColumnName("id_os");
            entity.Property(e => e.IdCliente).HasColumnName("id_cliente");
            entity.Property(e => e.IdVeiculo).HasColumnName("id_veiculo");
            entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");
            entity.Property(e => e.DataAbertura).HasColumnName("data_abertura");
            entity.Property(e => e.StatusOs).HasColumnName("status_os").HasMaxLength(30).HasDefaultValue("aberta");
            entity.Property(e => e.Kilometragem).HasColumnName("kilometragem");
            entity.Property(e => e.Descricao).HasColumnName("descricao").HasColumnType("text");
            entity.Property(e => e.DescricaoProblema).HasColumnName("descricao_problema").HasColumnType("text");
            entity.Property(e => e.Observacoes).HasColumnName("observacoes").HasColumnType("text");
            entity.Property(e => e.ValorTotal).HasColumnName("valor_total").HasPrecision(10, 2).HasDefaultValue(0);
            entity.Property(e => e.PrazoEstimado).HasColumnName("prazo_estimado");
            entity.HasOne(e => e.Cliente)
                  .WithMany(c => c.OrdensServico)
                  .HasForeignKey(e => e.IdCliente)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Veiculo)
                  .WithMany(v => v.OrdensServico)
                  .HasForeignKey(e => e.IdVeiculo)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Usuario)
                  .WithMany(u => u.OrdensServico)
                  .HasForeignKey(e => e.IdUsuario)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Servico>(entity =>
        {
            entity.ToTable("servico");
            entity.HasKey(e => e.IdServico);
            entity.Property(e => e.IdServico).HasColumnName("id_servico");
            entity.Property(e => e.NomeServico).HasColumnName("nome_servico").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Descricao).HasColumnName("descricao").HasColumnType("text");
            entity.Property(e => e.Valor).HasColumnName("valor").HasPrecision(10, 2).HasDefaultValue(0);
        });

        modelBuilder.Entity<OsServico>(entity =>
        {
            entity.ToTable("os_servico");
            entity.HasKey(e => new { e.IdOs, e.IdServico });
            entity.Property(e => e.IdOs).HasColumnName("id_os");
            entity.Property(e => e.IdServico).HasColumnName("id_servico");
            entity.Property(e => e.IdTecnico).HasColumnName("id_tecnico");
            entity.Property(e => e.Quantidade).HasColumnName("quantidade").HasDefaultValue(1);
            entity.Property(e => e.ValorCobrado).HasColumnName("valor_cobrado").HasPrecision(10, 2).HasDefaultValue(0);
            entity.Property(e => e.InicioExecucao).HasColumnName("inicio_execucao");
            entity.Property(e => e.FimExecucao).HasColumnName("fim_execucao");
            entity.HasOne(e => e.OrdemServico)
                  .WithMany(o => o.Servicos)
                  .HasForeignKey(e => e.IdOs)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Servico)
                  .WithMany(s => s.OrdensServico)
                  .HasForeignKey(e => e.IdServico)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Tecnico)
                  .WithMany(u => u.ServicosExecutados)
                  .HasForeignKey(e => e.IdTecnico)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Orcamento>(entity =>
        {
            entity.ToTable("orcamento");
            entity.HasKey(e => e.IdOrcamento);
            entity.Property(e => e.IdOrcamento).HasColumnName("id_orcamento");
            entity.Property(e => e.IdOs).HasColumnName("id_os");
            entity.Property(e => e.DataOrcamento).HasColumnName("data_orcamento");
            entity.Property(e => e.ValorTotal).HasColumnName("valor_total").HasPrecision(10, 2).HasDefaultValue(0);
            entity.Property(e => e.StatusOrcamento).HasColumnName("status_orcamento").HasMaxLength(20).HasDefaultValue("pendente");
            entity.Property(e => e.Observacoes).HasColumnName("observacoes").HasColumnType("text");
            entity.HasIndex(e => e.IdOs).IsUnique();
            entity.HasOne(e => e.OrdemServico)
                  .WithOne(o => o.Orcamento)
                  .HasForeignKey<Orcamento>(e => e.IdOs)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Peca>(entity =>
        {
            entity.ToTable("peca");
            entity.HasKey(e => e.IdPeca);
            entity.Property(e => e.IdPeca).HasColumnName("id_peca");
            entity.Property(e => e.NomePeca).HasColumnName("nome_peca").HasMaxLength(100).IsRequired();
            entity.Property(e => e.Descricao).HasColumnName("descricao").HasColumnType("text");
            entity.Property(e => e.Codigo).HasColumnName("codigo").HasMaxLength(50);
            entity.Property(e => e.Fornecedor).HasColumnName("fornecedor").HasMaxLength(100);
            entity.Property(e => e.Quantidade).HasColumnName("quantidade").HasDefaultValue(0);
            entity.Property(e => e.ValorUnitario).HasColumnName("valor_unitario").HasPrecision(10, 2).HasDefaultValue(0);
            entity.HasIndex(e => e.Codigo).IsUnique();
        });

        modelBuilder.Entity<Estoque>(entity =>
        {
            entity.ToTable("estoque");
            entity.HasKey(e => e.IdEstoque);
            entity.Property(e => e.IdEstoque).HasColumnName("id_estoque");
            entity.Property(e => e.IdPeca).HasColumnName("id_peca");
            entity.Property(e => e.QuantidadeDisponivel).HasColumnName("quantidade_disponivel").HasDefaultValue(0);
            entity.Property(e => e.EstoqueMinimo).HasColumnName("estoque_minimo").HasDefaultValue(2);
            entity.Property(e => e.Localizacao).HasColumnName("localizacao").HasMaxLength(100);
            entity.HasIndex(e => e.IdPeca).IsUnique();
            entity.HasOne(e => e.Peca)
                  .WithOne(p => p.Estoque)
                  .HasForeignKey<Estoque>(e => e.IdPeca)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OsPeca>(entity =>
        {
            entity.ToTable("os_peca");
            entity.HasKey(e => new { e.IdOs, e.IdPeca });
            entity.Property(e => e.IdOs).HasColumnName("id_os");
            entity.Property(e => e.IdPeca).HasColumnName("id_peca");
            entity.Property(e => e.Quantidade).HasColumnName("quantidade").HasDefaultValue(1);
            entity.Property(e => e.ValorUnitario).HasColumnName("valor_unitario").HasPrecision(10, 2).HasDefaultValue(0);
            entity.HasOne(e => e.OrdemServico)
                  .WithMany(o => o.Pecas)
                  .HasForeignKey(e => e.IdOs)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Peca)
                  .WithMany(p => p.OrdensServico)
                  .HasForeignKey(e => e.IdPeca)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<RegistroFotografico>(entity =>
        {
            entity.ToTable("registro_fotografico");
            entity.HasKey(e => e.IdFoto);
            entity.Property(e => e.IdFoto).HasColumnName("id_foto");
            entity.Property(e => e.IdOs).HasColumnName("id_os");
            entity.Property(e => e.Imagem).HasColumnName("imagem").HasMaxLength(255).IsRequired();
            entity.Property(e => e.Descricao).HasColumnName("descricao").HasColumnType("text");
            entity.Property(e => e.Momento).HasColumnName("momento").HasMaxLength(10).HasDefaultValue("durante");
            entity.Property(e => e.DataRegistro).HasColumnName("data_registro");
            entity.HasOne(e => e.OrdemServico)
                  .WithMany(o => o.Fotos)
                  .HasForeignKey(e => e.IdOs)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Notificacao>(entity =>
        {
            entity.ToTable("notificacao");
            entity.HasKey(e => e.IdNotificacao);
            entity.Property(e => e.IdNotificacao).HasColumnName("id_notificacao");
            entity.Property(e => e.IdOs).HasColumnName("id_os");
            entity.Property(e => e.Mensagem).HasColumnName("mensagem").HasColumnType("text").IsRequired();
            entity.Property(e => e.DataEnvio).HasColumnName("data_envio");
            entity.Property(e => e.StatusEnvio).HasColumnName("status_envio").HasMaxLength(10).HasDefaultValue("pendente");
            entity.Property(e => e.Tipo).HasColumnName("tipo").HasMaxLength(10).HasDefaultValue("status");
            entity.HasOne(e => e.OrdemServico)
                  .WithMany(o => o.Notificacoes)
                  .HasForeignKey(e => e.IdOs)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Entrega>(entity =>
        {
            entity.ToTable("entrega");
            entity.HasKey(e => e.IdEntrega);
            entity.Property(e => e.IdEntrega).HasColumnName("id_entrega");
            entity.Property(e => e.IdOs).HasColumnName("id_os");
            entity.Property(e => e.DataEntrega).HasColumnName("data_entrega");
            entity.Property(e => e.Confirmacao).HasColumnName("confirmacao");
            entity.Property(e => e.KilometragemSaida).HasColumnName("kilometragem_saida");
            entity.Property(e => e.Observacao).HasColumnName("observacao").HasColumnType("text");
            entity.Property(e => e.AssinadoCliente).HasColumnName("assinado_cliente");
            entity.HasIndex(e => e.IdOs).IsUnique();
            entity.HasOne(e => e.OrdemServico)
                  .WithOne(o => o.Entrega)
                  .HasForeignKey<Entrega>(e => e.IdOs)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Seed initial data
        modelBuilder.Entity<Perfil>().HasData(
            new Perfil { IdPerfil = 1, NomePerfil = "gestor", Descricao = "Acesso completo ao sistema" },
            new Perfil { IdPerfil = 2, NomePerfil = "atendente", Descricao = "Abertura e acompanhamento de OS" },
            new Perfil { IdPerfil = 3, NomePerfil = "tecnico", Descricao = "Execução de serviços" },
            new Perfil { IdPerfil = 4, NomePerfil = "cliente", Descricao = "Consulta de status e histórico" }
        );
    }
}
