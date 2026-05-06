package com.projeto.security.user;

import com.projeto.security.DTOS.PlanoDTO;
import com.projeto.security.DTOS.PlanoResponseDTO;
import com.projeto.security.ENUMS.Cobranca;
import com.projeto.security.entities.Plano;
import com.projeto.security.exception.PlanoNaoEncontradoException;
import com.projeto.security.repositories.PlanoRepository;
import com.projeto.security.service.PlanoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@ExtendWith(MockitoExtension.class)
public class PlanoServiceTest {
    private PlanoDTO planoDTO;
    @Mock
    private PlanoRepository planoRepository;
    @InjectMocks
    private PlanoService service;
    @BeforeEach
    void setUp(){
        planoDTO = new PlanoDTO("Netflix", "Streams de tv", new BigDecimal(300), Cobranca.MENSAL);
    }

    @Test
    void verificarPlanoSendoCriado(){
        UUID idGerado = UUID.randomUUID();
        Plano plano = new Plano();
        plano.setId(idGerado);
        plano.setDescricao(planoDTO.descricao());
        plano.setNome(planoDTO.nome());
        plano.setPreco(planoDTO.preco());
        plano.setIntervaloCobranca(planoDTO.intervaloCobranca());
        when(planoRepository.save(any(Plano.class))).thenReturn(plano);
        PlanoResponseDTO resultado = service.createPlan(planoDTO);

        PlanoResponseDTO esperado = new PlanoResponseDTO(plano.getNome(), plano.getDescricao(), plano.getPreco(), plano.getIntervaloCobranca(), idGerado);

        assertEquals(esperado, resultado);
        verify(planoRepository).save(any());
    }

    @Test
    void modificarPlanoNaoEncontrado(){
        UUID uuid = UUID.randomUUID();
        when(planoRepository.findById(uuid)).thenReturn(Optional.empty());
        assertThrows(PlanoNaoEncontradoException.class, ()->{
            service.putPlan(uuid, planoDTO);
        });
        verify(planoRepository, never()).save(any());
    }

    @Test
    void modificarPlanoFuncional(){
        UUID id = UUID.randomUUID();
        Plano plano = new Plano();
        plano.setId(id);
        when(planoRepository.findById(id)).thenReturn(Optional.of(plano));
        when(planoRepository.save(any(Plano.class))).thenReturn(plano);
        PlanoResponseDTO resultado = service.putPlan(id, planoDTO);
        PlanoResponseDTO esperado = new PlanoResponseDTO(planoDTO.nome(), planoDTO.descricao(), planoDTO.preco(), planoDTO.intervaloCobranca(), id);
        assertEquals(esperado, resultado);
        verify(planoRepository).save(any());
    }

    @Test
    void deletarPlanoExistente(){
        Plano duble = new Plano();
        UUID randomId = UUID.randomUUID();
        when(planoRepository.findById(randomId)).thenReturn(Optional.of(duble));
        service.deletePlan(randomId);
        verify(planoRepository).delete(duble);
    }

    @Test
    void deletarPlanoNaoExistente(){
        UUID uuid = UUID.randomUUID();
        when(planoRepository.findById(uuid)).thenReturn(Optional.empty());
        assertThrows(PlanoNaoEncontradoException.class, ()->{
            service.deletePlan(uuid);
        });
        verify(planoRepository, never()).delete(any());
    }
}
