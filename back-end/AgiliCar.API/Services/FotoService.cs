using AgiliCar.API.Data;
using AgiliCar.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AgiliCar.API.Services;

public class FotoService(AgiliCarContext context, IWebHostEnvironment env)
{
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    private const long MaxFileSize = 10 * 1024 * 1024; // 10MB

    public async Task<FotoResponse> SalvarAsync(int idOs, IFormFile arquivo, string momento, string? descricao)
    {
        var ext = Path.GetExtension(arquivo.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            throw new ArgumentException("Tipo de arquivo não permitido. Use JPG, PNG ou WEBP.");

        if (arquivo.Length > MaxFileSize)
            throw new ArgumentException("Arquivo muito grande. Tamanho máximo: 10MB.");

        var uploadsDir = Path.Combine(env.WebRootPath ?? env.ContentRootPath, "uploads", "os", idOs.ToString());
        Directory.CreateDirectory(uploadsDir);

        var nomeArquivo = $"{Guid.NewGuid()}{ext}";
        var caminhoCompleto = Path.Combine(uploadsDir, nomeArquivo);

        using var stream = File.Create(caminhoCompleto);
        await arquivo.CopyToAsync(stream);

        var caminhoRelativo = $"/uploads/os/{idOs}/{nomeArquivo}";

        var foto = new RegistroFotografico
        {
            IdOs = idOs,
            Imagem = caminhoRelativo,
            Descricao = descricao,
            Momento = momento
        };

        context.RegistrosFotograficos.Add(foto);
        await context.SaveChangesAsync();

        return new FotoResponse
        {
            IdFoto = foto.IdFoto,
            IdOs = foto.IdOs,
            Url = caminhoRelativo,
            Descricao = foto.Descricao,
            Momento = foto.Momento,
            DataRegistro = foto.DataRegistro
        };
    }

    public async Task<List<FotoResponse>> ListarPorOsAsync(int idOs, string? momento = null)
    {
        var query = context.RegistrosFotograficos
            .Where(f => f.IdOs == idOs);

        if (!string.IsNullOrEmpty(momento))
            query = query.Where(f => f.Momento == momento);

        return await query
            .OrderBy(f => f.DataRegistro)
            .Select(f => new FotoResponse
            {
                IdFoto = f.IdFoto,
                IdOs = f.IdOs,
                Url = f.Imagem,
                Descricao = f.Descricao,
                Momento = f.Momento,
                DataRegistro = f.DataRegistro
            })
            .ToListAsync();
    }
}

public class FotoResponse
{
    public int IdFoto { get; set; }
    public int IdOs { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public string Momento { get; set; } = string.Empty;
    public DateTime DataRegistro { get; set; }
}
