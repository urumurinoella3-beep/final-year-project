package rw.rra.dqims.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "validation_errors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ValidationError {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private ValidationSession session;

    @Column(name = "row_number", nullable = false)
    private Integer rowNumber;

    @Column(name = "error_type", nullable = false)
    private String errorType;

    @Column(name = "field_name", nullable = false)
    private String fieldName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    private String value;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
