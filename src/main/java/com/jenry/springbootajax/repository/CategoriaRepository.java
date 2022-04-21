package com.jenry.springbootajax.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jenry.springbootajax.domain.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long>{

}
