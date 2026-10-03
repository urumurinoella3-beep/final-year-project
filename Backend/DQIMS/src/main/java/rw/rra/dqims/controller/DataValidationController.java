package rw.rra.dqims.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import rw.rra.dqims.dto.response.ValidationSessionResponse;
import rw.rra.dqims.exception.BadRequestException;
import rw.rra.dqims.service.DataValidationService;

@RestController
@RequestMapping("/api/validation")
public class DataValidationController {
    
    private final DataValidationService validationService;
    
    public DataValidationController(DataValidationService validationService) {
        this.validationService = validationService;
    }
    
    @PostMapping("/upload")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD', 'STAFF')")
    public ResponseEntity<ValidationSessionResponse> uploadFile(
            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new BadRequestException("File is empty");
            }
            ValidationSessionResponse response = validationService.validateFile(file);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error uploading file: " + e.getMessage(), e);
        }
    }
    
    @GetMapping("/sessions")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD', 'STAFF')")
    public ResponseEntity<Page<ValidationSessionResponse>> getAllSessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ValidationSessionResponse> sessions = validationService.getAllSessions(
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );
        return ResponseEntity.ok(sessions);
    }
    
    @GetMapping("/sessions/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOD', 'STAFF')")
    public ResponseEntity<ValidationSessionResponse> getSessionById(@PathVariable Long id) {
        ValidationSessionResponse response = validationService.getSessionById(id);
        return ResponseEntity.ok(response);
    }
}
