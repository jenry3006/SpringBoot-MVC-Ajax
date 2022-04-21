package com.jenry.springbootajax;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import com.jenry.springbootajax.domain.SocialMetaTag;
import com.jenry.springbootajax.service.SocialMetaTagService;

@SpringBootApplication
public class SpringbootAjaxApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootAjaxApplication.class, args);
	}

	@Autowired
	SocialMetaTagService service;
	
	@Override
	public void run(String... args) throws Exception {

		
	}

}
