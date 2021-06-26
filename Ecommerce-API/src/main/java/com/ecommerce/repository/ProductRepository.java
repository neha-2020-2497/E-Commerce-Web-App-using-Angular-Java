package com.ecommerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.ecommerce.entity.Product;

@CrossOrigin("http://localhost:4200/")
@Repository
public interface ProductRepository  extends JpaRepository<Product, Long>{

}
