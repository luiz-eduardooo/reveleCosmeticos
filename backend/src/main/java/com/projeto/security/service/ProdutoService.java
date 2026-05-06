package com.projeto.security.service;

import com.projeto.security.DTOS.produto.ProdutoCreateDTO;
import com.projeto.security.DTOS.produto.ProdutoResponseDTO;
import com.projeto.security.DTOS.produto.ProdutoUpdateDTO;
import com.projeto.security.entities.Produto;
import com.projeto.security.exception.ProdutoJaExistenteException;
import com.projeto.security.exception.ProdutoNaoEncontradoException;
import com.projeto.security.repositories.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {
    private final ProdutoRepository repository;


    private ProdutoResponseDTO toResponseDTO(Produto produto){
        return new ProdutoResponseDTO(produto.getId(), produto.getNome(), produto.getDescricao(), produto.getPreco(), produto.getEstoque(), produto.getStatusClube());
    }

    @Transactional
    public ProdutoResponseDTO criarProduto(ProdutoCreateDTO produtoDTO){

        if(repository.existsByNome(produtoDTO.nome())){
            throw new ProdutoJaExistenteException("Um produto com esse nome ja existe!");
        }

        Produto produto = new Produto();
        produto.setEstoque(produtoDTO.estoque());
        produto.setImagem(produtoDTO.imagem());
        produto.setDescricao(produtoDTO.descricao());
        produto.setPreco(produtoDTO.preco());
        produto.setNome(produtoDTO.nome());
        if(produtoDTO.statusClube() != null) produto.setStatusClube(produtoDTO.statusClube());
        if(produtoDTO.descontoEspecial() != null) produto.setDescontoEspecial(produtoDTO.descontoEspecial());
        Produto produtoResposta = repository.save(produto);
        return toResponseDTO(produtoResposta);
    }
    @Transactional
    public ProdutoResponseDTO modificarProduto(Long id, ProdutoUpdateDTO produtoDTO){
        Produto produtoEncontrado = repository.findById(id).orElseThrow(()-> new ProdutoNaoEncontradoException(id));
        if (produtoDTO.descricao() != null) produtoEncontrado.setDescricao(produtoDTO.descricao());
        if(produtoDTO.preco() != null) produtoEncontrado.setPreco(produtoDTO.preco());
        if (produtoDTO.estoque() != null) produtoEncontrado.setEstoque(produtoDTO.estoque());
        if(produtoDTO.nome() != null) produtoEncontrado.setNome(produtoDTO.nome());
        if (produtoDTO.imagem() != null) produtoEncontrado.setImagem(produtoDTO.imagem());
        Produto produtoSalvo = repository.save(produtoEncontrado);
        return toResponseDTO(produtoSalvo);
    }
    @Transactional
    public void deletarProduto(Long id){
        Produto produtoEncontrado = repository.findById(id).orElseThrow(()-> new ProdutoNaoEncontradoException(id));
        repository.delete(produtoEncontrado);
    }
    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarProdutos(){
        return repository.findAll().stream().map(this::toResponseDTO).toList();
    }
    @Transactional(readOnly = true)
    public ProdutoResponseDTO procurarProduto(Long id){
        return toResponseDTO(repository.findById(id).orElseThrow(()-> new ProdutoNaoEncontradoException(id)));
    }

}
