package com.example.helloworld;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@RestController
class HelloWorldController {

    @Value("${NAME:World}")
    String name;

    private Random tokenGenerator = new Random(123);

    @GetMapping("/")
    String hello() {
        return "Hello " + name + "!" + " random: " + (tokenGenerator.nextInt() % 1000);
    }
}

