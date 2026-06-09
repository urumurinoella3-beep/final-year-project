package rw.rra.dqims.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import rw.rra.dqims.dto.request.AddCommentRequest;
import rw.rra.dqims.dto.request.CreateIssueRequest;
import rw.rra.dqims.dto.request.UpdateIssueRequest;
import rw.rra.dqims.dto.response.ApiResponse;
import rw.rra.dqims.dto.response.IssueCommentResponse;
import rw.rra.dqims.dto.response.IssueResponse;
import rw.rra.dqims.service.IssueService;

@RestController
@RequestMapping("/api/v1/issues")
public class IssueController {
    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @GetMapping
    public ResponseEntity<Page<IssueResponse>> getIssues(Pageable pageable) {
        return ResponseEntity.ok(issueService.getIssues(pageable));
    }

    @PostMapping
    public ResponseEntity<IssueResponse> createIssue(@Valid @RequestBody CreateIssueRequest request) {
        return ResponseEntity.ok(issueService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IssueResponse> updateIssue(@PathVariable Long id, @RequestBody UpdateIssueRequest request) {
        return ResponseEntity.ok(issueService.update(id, request));
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('ADMIN','HOD')")
    public ResponseEntity<IssueResponse> closeIssue(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.close(id));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<IssueCommentResponse>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.getComments(id));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse> addComment(@PathVariable Long id, @Valid @RequestBody AddCommentRequest request) {
        issueService.addComment(id, request.content());
        return ResponseEntity.ok(new ApiResponse(true, "Comment added"));
    }
}
