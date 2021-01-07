package com.example.helloworld;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tech.portal.mirror.makeup.dev.api.v1.RestApiApi;
import tech.portal.mirror.makeup.dev.model.v1.BrandPojo;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;


@RestController
@RequestMapping()
//@AllArgsConstructor
public class MakeupApiImpl implements RestApiApi {

    private Random tokenGenerator = new Random(4567);

    @Override
    public ResponseEntity<List<BrandPojo>> searchBrands() {
        BrandPojo brand1 = new BrandPojo();
        brand1.setId(12L);
        brand1.setName("Maybelline, random: " + tokenGenerator.nextInt() % 1000);
        brand1.setSmallImage("https://todo-list-dev.web.app/images/brands/maybelline.png");
        brand1.setSortPriority(10);

        List<BrandPojo> result = new ArrayList<>();
        result.add(brand1);

        return ResponseEntity.ok(result);
    }
}
