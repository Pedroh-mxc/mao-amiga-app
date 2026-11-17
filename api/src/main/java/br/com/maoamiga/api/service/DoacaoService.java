package br.com.maoamiga.api.service;

import br.com.maoamiga.api.dto.DoacaoRequestDTO;
import br.com.maoamiga.api.dto.DoacaoResponseDTO;
import br.com.maoamiga.api.entity.Doacao;
import br.com.maoamiga.api.repository.DoacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoacaoService {

    private final DoacaoRepository repository;

    public Page<DoacaoResponseDTO> filtrar(String filtro, Pageable pageable) {
        String termo = filtro == null ? "" : filtro.trim();
        return repository.buscar(termo, pageable).map(DoacaoResponseDTO::from);
    }

    public DoacaoResponseDTO buscarPorId(UUID id) {
        return DoacaoResponseDTO.from(encontrar(id));
    }

    public DoacaoResponseDTO cadastrar(DoacaoRequestDTO dto) {
        Doacao doacao = new Doacao();
        preencher(doacao, dto);
        doacao.setCriadoEm(LocalDateTime.now().truncatedTo(ChronoUnit.MILLIS));
        return DoacaoResponseDTO.from(repository.save(doacao));
    }

    public DoacaoResponseDTO atualizar(UUID id, DoacaoRequestDTO dto) {
        Doacao doacao = encontrar(id);
        preencher(doacao, dto);
        return DoacaoResponseDTO.from(repository.save(doacao));
    }

    public void excluir(UUID id) {
        repository.delete(encontrar(id));
    }

    private Doacao encontrar(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doação não encontrada"));
    }

    private void preencher(Doacao doacao, DoacaoRequestDTO dto) {
        doacao.setTipoItem(dto.tipoItem().trim());
        doacao.setQuantidade(dto.quantidade());
        doacao.setPontoDestino(dto.pontoDestino().trim());
    }
}
