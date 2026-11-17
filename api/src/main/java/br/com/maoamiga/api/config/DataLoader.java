package br.com.maoamiga.api.config;

import br.com.maoamiga.api.entity.Ponto;
import br.com.maoamiga.api.repository.PontoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner carregarPontos(PontoRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }
            repository.saveAll(List.of(
                    ponto("Ponto Central", "Rua 3, 150", "Setor Central", "Seg a Sex, 8h às 17h", "coleta"),
                    ponto("Casa Solidária Bueno", "Av. T-4, 1200", "Setor Bueno", "Seg a Sáb, 9h às 18h", "distribuição"),
                    ponto("Ponto Oeste", "Rua 1, 85", "Setor Oeste", "Seg a Sex, 8h às 16h", "coleta"),
                    ponto("Ponto Marista", "Av. T-10, 640", "Setor Marista", "Ter a Sáb, 9h às 17h", "coleta"),
                    ponto("Centro de Distribuição Campinas", "Rua 24, 310", "Campinas", "Seg a Sex, 8h às 17h", "distribuição"),
                    ponto("Ponto Universitário", "Rua 238, 95", "Setor Universitário", "Seg a Sex, 10h às 18h", "coleta"),
                    ponto("Ponto Sul", "Av. 85, 2200", "Setor Sul", "Seg a Sáb, 8h às 12h", "coleta"),
                    ponto("Ponto Vila Nova", "Rua 15, 48", "Vila Nova", "Ter a Dom, 9h às 15h", "distribuição"),
                    ponto("Ponto Jardim Goiás", "Rua JG-12, 77", "Jardim Goiás", "Seg a Sex, 9h às 18h", "coleta"),
                    ponto("Ponto Pedro Ludovico", "Rua PL-5, 410", "Setor Pedro Ludovico", "Seg a Sex, 8h às 17h", "coleta"),
                    ponto("Ponto Jardim América", "Av. T-63, 980", "Jardim América", "Seg a Sáb, 8h às 17h", "distribuição"),
                    ponto("Ponto Aeroporto", "Rua 4, 220", "Setor Aeroporto", "Seg a Sex, 8h às 16h", "coleta"),
                    ponto("Ponto Parque Amazônia", "Rua 8, 515", "Parque Amazônia", "Seg a Sex, 9h às 17h", "coleta"),
                    ponto("Ponto Leste Universitário", "Rua 260, 135", "Setor Leste Universitário", "Seg a Sex, 8h às 17h", "coleta"),
                    ponto("Ponto Coimbra", "Rua 10, 77", "Setor Coimbra", "Ter a Sáb, 9h às 16h", "distribuição"),
                    ponto("Ponto Nova Suíça", "Rua 4, 305", "Setor Nova Suíça", "Seg a Sex, 8h às 18h", "coleta"),
                    ponto("Ponto Jaó", "Rua J-3, 120", "Setor Jaó", "Seg a Sex, 8h às 17h", "coleta"),
                    ponto("Ponto Vila Rosa", "Rua VR-2, 64", "Vila Rosa", "Seg a Sáb, 9h às 15h", "distribuição"),
                    ponto("Ponto Eldorado", "Rua E-7, 890", "Residencial Eldorado", "Seg a Sex, 8h às 17h", "coleta"),
                    ponto("Ponto Novo Mundo", "Rua NM-9, 33", "Jardim Novo Mundo", "Seg a Sex, 9h às 17h", "coleta"),
                    ponto("Ponto Redenção", "Rua 7, 250", "Vila Redenção", "Ter a Sáb, 8h às 16h", "distribuição"),
                    ponto("Ponto Faiçalville", "Rua F-11, 410", "Setor Faiçalville", "Seg a Sex, 8h às 17h", "coleta"),
                    ponto("Ponto Cidade Jardim", "Av. CJ-1, 1500", "Cidade Jardim", "Seg a Sáb, 8h às 18h", "coleta"),
                    ponto("Ponto Candida de Morais", "Rua CM-6, 72", "Setor Candida de Morais", "Seg a Sex, 9h às 16h", "distribuição"),
                    ponto("Ponto Anhanguera", "Rua A-14, 188", "Parque Anhanguera", "Seg a Sex, 8h às 17h", "coleta"),
                    ponto("Ponto Vila Brasília", "Rua VB-3, 91", "Vila Brasília", "Ter a Dom, 9h às 15h", "coleta"),
                    ponto("Ponto Bela Vista", "Rua BV-8, 205", "Setor Bela Vista", "Seg a Sex, 8h às 17h", "distribuição"),
                    ponto("Ponto Santa Genoveva", "Rua SG-2, 360", "Setor Santa Genoveva", "Seg a Sáb, 9h às 17h", "coleta")
            ));
        };
    }

    private static Ponto ponto(String nome, String endereco, String bairro, String horario, String tipo) {
        return new Ponto(null, nome, endereco, bairro, horario, tipo);
    }
}
