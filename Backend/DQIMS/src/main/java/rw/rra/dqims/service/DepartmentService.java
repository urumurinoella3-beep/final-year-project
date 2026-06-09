package rw.rra.dqims.service;

import org.springframework.stereotype.Service;
import rw.rra.dqims.dto.request.CreateDepartmentRequest;
import rw.rra.dqims.dto.response.DepartmentResponse;
import rw.rra.dqims.entity.Department;
import rw.rra.dqims.exception.BadRequestException;
import rw.rra.dqims.exception.ResourceNotFoundException;
import rw.rra.dqims.repository.DepartmentRepository;

import java.util.List;

@Service
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll().stream()
                .filter(d -> Boolean.TRUE.equals(d.getIsActive()))
                .map(this::toResponse)
                .toList();
    }

    public DepartmentResponse create(CreateDepartmentRequest request) {
        departmentRepository.findByNameIgnoreCase(request.name()).ifPresent(d -> {
            throw new BadRequestException("Department already exists");
        });
        Department department = Department.builder()
                .name(request.name().toUpperCase())
                .description(request.description())
                .isActive(true)
                .build();
        return toResponse(departmentRepository.save(department));
    }

    public void delete(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        department.setIsActive(false);
        departmentRepository.save(department);
    }

    private DepartmentResponse toResponse(Department d) {
        return new DepartmentResponse(d.getId(), d.getName(), d.getDescription(), d.getIsActive());
    }
}
