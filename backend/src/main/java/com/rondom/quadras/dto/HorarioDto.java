package com.rondom.quadras.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HorarioDto {
    private Long id;
    private LocalDateTime inicio;
    private LocalDateTime fim;
    private boolean reservado;
}
