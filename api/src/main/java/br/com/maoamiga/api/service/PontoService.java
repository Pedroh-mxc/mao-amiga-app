package br.com.maoamiga.api.service;

import br.com.maoamiga.api.dto.PontoRequestDTO;
import br.com.maoamiga.api.dto.PontoResponseDTO;
import br.com.maoamiga.api.entity.Ponto;
import br.com.maoamiga.api.repository.PontoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PontoService {

    private final PontoRepository repository;

    public List<PontoResponseDTO> listar() {
        return repository.findAll(Sort.by("nome")).stream()
                .map(PontoResponseDTO::from)
                .toList();
    }

    public Page<PontoResponseDTO> filtrar(String filtro, Pageable pageable) {
        String termo = filtro == null ? "" : filtro.trim();
        return repository.buscar(termo, pageable).map(PontoResponseDTO::from);
    }

    public PontoResponseDTO buscarPorId(UUID id) {
        return PontoResponseDTO.from(encontrar(id));
    }

    public PontoResponseDTO cadastrar(PontoRequestDTO dto) {
        Ponto ponto = new Ponto();
        preencher(ponto, dto);
        return PontoResponseDTO.from(repository.save(ponto));
    }

    public PontoResponseDTO atualizar(UUID id, PontoRequestDTO dto) {
        Ponto ponto = encontrar(id);
        preencher(ponto, dto);
        return PontoResponseDTO.from(repository.save(ponto));
    }

    public void excluir(UUID id) {
        repository.delete(encontrar(id));
    }

    private Ponto encontrar(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ponto não encontrado"));
    }

    private void preencher(Ponto ponto, PontoRequestDTO dto) {
        ponto.setNome(dto.nome().trim());
        ponto.setEndereco(dto.endereco().trim());
        ponto.setBairro(dto.bairro().trim());
        ponto.setHorario(dto.horario().trim());
        ponto.setTipo(dto.tipo().trim());
    }
}
