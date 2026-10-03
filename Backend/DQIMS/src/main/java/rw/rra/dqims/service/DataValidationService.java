package rw.rra.dqims.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import rw.rra.dqims.dto.response.PreviewDataResponse;
import rw.rra.dqims.dto.response.ValidationErrorResponse;
import rw.rra.dqims.dto.response.ValidationSessionResponse;
import rw.rra.dqims.entity.User;
import rw.rra.dqims.entity.ValidationError;
import rw.rra.dqims.entity.ValidationSession;
import rw.rra.dqims.exception.BadRequestException;
import rw.rra.dqims.exception.ResourceNotFoundException;
import rw.rra.dqims.repository.ValidationErrorRepository;
import rw.rra.dqims.repository.ValidationSessionRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class DataValidationService {
    
    private final ValidationSessionRepository sessionRepository;
    private final ValidationErrorRepository errorRepository;
    private final CurrentUserService currentUserService;
    private final AuditLogService auditLogService;
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern TIN_PATTERN = Pattern.compile("^[0-9]{9}$");
    private static final int MAX_PREVIEW_ROWS = 5;
    
    public DataValidationService(
            ValidationSessionRepository sessionRepository,
            ValidationErrorRepository errorRepository,
            CurrentUserService currentUserService,
            AuditLogService auditLogService) {
        this.sessionRepository = sessionRepository;
        this.errorRepository = errorRepository;
        this.currentUserService = currentUserService;
        this.auditLogService = auditLogService;
    }
    
    @Transactional
    public ValidationSessionResponse validateFile(MultipartFile file) {
        User user = currentUserService.getCurrentUser();
        String fileName = file.getOriginalFilename();
        
        if (fileName == null || fileName.isEmpty()) {
            throw new BadRequestException("File name is required");
        }
        
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        
        if (!extension.equals("csv") && !extension.equals("xlsx") && !extension.equals("xls")) {
            throw new BadRequestException("Only CSV and Excel files are supported");
        }
        
        try {
            List<Map<String, String>> rows;
            List<String> headers;
            
            if (extension.equals("csv")) {
                var result = parseCSV(file);
                headers = (List<String>) result.get(0);
                rows = (List<Map<String, String>>) (List<?>) result.get(1);
            } else {
                var result = parseExcel(file);
                headers = (List<String>) result.get(0);
                rows = (List<Map<String, String>>) (List<?>) result.get(1);
            }
            
            // Perform validation
            List<ValidationError> errors = new ArrayList<>();
            Set<String> seenTINs = new HashSet<>();
            
            for (int i = 0; i < rows.size(); i++) {
                Map<String, String> row = rows.get(i);
                int rowNumber = i + 2; // +2 because row 1 is header and we start from 0
                
                // Validate each row
                errors.addAll(validateRow(row, rowNumber, seenTINs));
            }
            
            // Create validation session
            ValidationSession session = ValidationSession.builder()
                    .user(user)
                    .fileName(fileName)
                    .totalRecords(rows.size())
                    .passedRecords(rows.size() - countDistinctRows(errors))
                    .failedRecords(countDistinctRows(errors))
                    .build();
            
            session = sessionRepository.save(session);
            
            // Save all errors
            ValidationSession finalSession = session;
            errors.forEach(error -> error.setSession(finalSession));
            errorRepository.saveAll(errors);
            
            // Create preview data
            List<PreviewDataResponse> previewData = rows.stream()
                    .limit(MAX_PREVIEW_ROWS)
                    .map(row -> new PreviewDataResponse(
                            rows.indexOf(row) + 2,
                            row
                    ))
                    .toList();
            
            // Log audit
            auditLogService.log(user, "VALIDATE_FILE", "VALIDATION_SESSION", session.getId(),
                    "Validated file: " + fileName + " with " + rows.size() + " records");
            
            return toResponse(session, errors, previewData);
            
        } catch (Exception e) {
            throw new BadRequestException("Error processing file: " + e.getMessage());
        }
    }
    
    private List<Object> parseCSV(MultipartFile file) throws Exception {
        List<Map<String, String>> rows = new ArrayList<>();
        List<String> headers = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = reader.readLine();
            if (headerLine == null) {
                throw new BadRequestException("Empty CSV file");
            }
            
            headers = Arrays.asList(headerLine.split(","));
            
            String line;
            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",", -1); // -1 to include empty trailing fields
                Map<String, String> row = new LinkedHashMap<>();
                
                for (int i = 0; i < headers.size(); i++) {
                    String value = i < values.length ? values[i].trim() : "";
                    row.put(headers.get(i).trim(), value);
                }
                
                rows.add(row);
            }
        }
        
        List<Object> result = new ArrayList<>();
        result.add(headers);
        result.add(rows);
        return result;
    }
    
    private List<Object> parseExcel(MultipartFile file) throws Exception {
        List<Map<String, String>> rows = new ArrayList<>();
        List<String> headers = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();
            
            if (!rowIterator.hasNext()) {
                throw new BadRequestException("Empty Excel file");
            }
            
            // Read headers
            Row headerRow = rowIterator.next();
            for (Cell cell : headerRow) {
                headers.add(getCellValueAsString(cell).trim());
            }
            
            // Read data rows
            while (rowIterator.hasNext()) {
                Row dataRow = rowIterator.next();
                Map<String, String> row = new LinkedHashMap<>();
                
                for (int i = 0; i < headers.size(); i++) {
                    Cell cell = dataRow.getCell(i);
                    String value = cell != null ? getCellValueAsString(cell).trim() : "";
                    row.put(headers.get(i), value);
                }
                
                rows.add(row);
            }
        }
        
        List<Object> result = new ArrayList<>();
        result.add(headers);
        result.add(rows);
        return result;
    }
    
    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getDateCellValue().toString();
                } else {
                    double numericValue = cell.getNumericCellValue();
                    if (numericValue == (long) numericValue) {
                        yield String.valueOf((long) numericValue);
                    } else {
                        yield String.valueOf(numericValue);
                    }
                }
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }
    
    private List<ValidationError> validateRow(Map<String, String> row, int rowNumber, Set<String> seenTINs) {
        List<ValidationError> errors = new ArrayList<>();
        
        // Validate TIN
        String tin = row.getOrDefault("TIN", "");
        if (tin.isEmpty()) {
            errors.add(createError(rowNumber, "COMPLETENESS", "TIN", "Missing TIN value", tin));
        } else {
            if (!TIN_PATTERN.matcher(tin).matches()) {
                errors.add(createError(rowNumber, "FORMAT", "TIN", "TIN must be 9 digits", tin));
            }
            if (seenTINs.contains(tin)) {
                errors.add(createError(rowNumber, "UNIQUENESS", "TIN", "Duplicate TIN: " + tin, tin));
            } else {
                seenTINs.add(tin);
            }
        }
        
        // Validate Name
        String name = row.getOrDefault("Name", "");
        if (name.isEmpty()) {
            errors.add(createError(rowNumber, "COMPLETENESS", "Name", "Missing taxpayer name", name));
        }
        
        // Validate Amount
        String amount = row.getOrDefault("Amount", "");
        if (!amount.isEmpty()) {
            try {
                double amountValue = Double.parseDouble(amount);
                if (amountValue < 0) {
                    errors.add(createError(rowNumber, "ACCURACY", "Amount", "Negative amount not allowed", amount));
                }
            } catch (NumberFormatException e) {
                errors.add(createError(rowNumber, "FORMAT", "Amount", "Invalid number format", amount));
            }
        }
        
        // Validate Email
        String email = row.getOrDefault("Email", "");
        if (!email.isEmpty() && !EMAIL_PATTERN.matcher(email).matches()) {
            errors.add(createError(rowNumber, "FORMAT", "Email", "Invalid email format", email));
        }
        
        return errors;
    }
    
    private ValidationError createError(int rowNumber, String errorType, String field, String description, String value) {
        return ValidationError.builder()
                .rowNumber(rowNumber)
                .errorType(errorType)
                .fieldName(field)
                .description(description)
                .value(value)
                .build();
    }
    
    private int countDistinctRows(List<ValidationError> errors) {
        return (int) errors.stream()
                .map(ValidationError::getRowNumber)
                .distinct()
                .count();
    }
    
    public Page<ValidationSessionResponse> getAllSessions(Pageable pageable) {
        User user = currentUserService.getCurrentUser();
        Page<ValidationSession> sessions;
        
        if (user.getRole() == rw.rra.dqims.entity.enums.UserRole.ADMIN) {
            sessions = sessionRepository.findAllByOrderByCreatedAtDesc(pageable);
        } else {
            sessions = sessionRepository.findByUser(user, pageable);
        }
        
        return sessions.map(session -> toResponse(session, null, null));
    }
    
    public ValidationSessionResponse getSessionById(Long id) {
        ValidationSession session = sessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Validation session not found"));
        
        List<ValidationError> errors = errorRepository.findBySessionOrderByRowNumberAsc(session);
        
        return toResponse(session, errors, null);
    }
    
    private ValidationSessionResponse toResponse(ValidationSession session, 
                                                  List<ValidationError> errors, 
                                                  List<PreviewDataResponse> previewData) {
        List<ValidationErrorResponse> errorResponses = null;
        if (errors != null) {
            errorResponses = errors.stream()
                    .map(e -> new ValidationErrorResponse(
                            e.getId(),
                            e.getRowNumber(),
                            e.getErrorType(),
                            e.getFieldName(),
                            e.getDescription(),
                            e.getValue()
                    ))
                    .toList();
        }
        
        return new ValidationSessionResponse(
                session.getId(),
                session.getFileName(),
                session.getTotalRecords(),
                session.getPassedRecords(),
                session.getFailedRecords(),
                session.getCreatedAt(),
                errorResponses,
                previewData
        );
    }
}
