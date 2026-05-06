package com.projeto.security.service;

import com.projeto.security.DTOS.PlanoDTO;
import com.projeto.security.DTOS.PlanoResponseDTO;
import com.projeto.security.entities.Plano;
import com.projeto.security.exception.PlanoNaoEncontradoException;
import com.projeto.security.repositories.PlanoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanoService {

    private final PlanoRepository repository;

    public PlanoResponseDTO createPlan(PlanoDTO dados){
        Plano plano = new Plano();
        BeanUtils.copyProperties(dados, plano);
        Plano planoSalvo = repository.save(plano);
        return new PlanoResponseDTO(planoSalvo.getNome(), planoSalvo.getDescricao(), planoSalvo.getPreco(), planoSalvo.getIntervaloCobranca(), planoSalvo.getId());
    }

    public PlanoResponseDTO putPlan(UUID id, PlanoDTO dados){
        Plano plano = repository.findById(id).orElseThrow(()->new PlanoNaoEncontradoException("Plano não encontrado!"));
        BeanUtils.copyProperties(dados, plano);
        Plano planoSalvo = repository.save(plano);
        return new PlanoResponseDTO(planoSalvo.getNome(), planoSalvo.getDescricao(), planoSalvo.getPreco(), planoSalvo.getIntervaloCobranca(), planoSalvo.getId());
    }

    public void deletePlan(UUID id){
        Plano plano = repository.findById(id).orElseThrow(()-> new PlanoNaoEncontradoException("Plano não encontrado!"));
        repository.delete(plano);
    }

    public List<PlanoResponseDTO> getPlano(){
        return repository.findAll().stream().map((plano)-> new PlanoResponseDTO(plano.getNome(), plano.getDescricao(), plano.getPreco(), plano.getIntervaloCobranca(), plano.getId()))
                .collect(Collectors.toList());
    }
}
