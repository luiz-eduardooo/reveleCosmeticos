package com.projeto.security.repositories;

import com.projeto.security.entities.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
        public boolean existsByNome(String nome);
        public List<Produto> findAllById(Iterable<Long> ids);
}
