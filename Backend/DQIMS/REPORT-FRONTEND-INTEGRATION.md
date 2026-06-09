# Report System - Frontend Integration Guide

## Overview

The DQIMS report system generates professional Excel reports for data validation and analysis. This guide provides complete integration instructions for connecting your frontend application to the backend report API.

## Key Changes

### ✅ What's Included
- **Excel Reports Only** - Professional, multi-sheet Excel workbooks with:
  - Summary sheet with metadata and statistics
  - Detailed issues sheet with all data fields
  - Statistics sheet with breakdowns
  - Activity log sheet with audit trail
  - Professional formatting and color coding
  - Urgent issue highlighting (issues open > 7 days)

### ❌ What's Removed
- CSV export (removed - Excel serves data validation needs)
- Word document generation (removed)
- PDF generation (removed)

## API Endpoints

### 1. Dashboard Statistics

**Endpoint:** `GET /api/v1/reports/dashboard-stats`

**Purpose:** Get real-time statistics for dashboard display

**Response:**
```json
{
  "totalIssues": 150,
  "openIssues": 45,
  "inProgressIssues": 30,
  "resolvedIssues": 50,
  "closedIssues": 25,
  "totalUsers": 42
}
```

**Frontend Integration:**
```javascript
// React/TypeScript Example
const fetchDashboardStats = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/reports/dashboard-stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const stats = await response.json();
    setDashboardData(stats);
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
  }
};
```

### 2. Generate Excel Report

**Endpoint:** `GET /api/v1/reports/generate-excel`

**Purpose:** Generate and download professional Excel report

**Query Parameters:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| department | string | No | Filter by department | `Finance` |
| status | string | No | Filter by status | `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` |
| startDate | ISO DateTime | No | Filter from date | `2024-01-01T00:00:00` |
| endDate | ISO DateTime | No | Filter to date | `2024-12-31T23:59:59` |

**Response:** Binary Excel file (.xlsx)

**Frontend Integration Examples:**

#### Example 1: Basic Download (No Filters)
```javascript
const downloadReport = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/v1/reports/generate-excel', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DQIMS-Report-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Failed to download report:', error);
  }
};
```

#### Example 2: Download with Filters
```javascript
const downloadFilteredReport = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.department) params.append('department', filters.department);
  if (filters.status) params.append('status', filters.status);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/reports/generate-excel?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to generate report');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DQIMS-Report-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Failed to download report:', error);
    alert('Failed to generate report. Please try again.');
  }
};

// Usage
downloadFilteredReport({
  department: 'Finance',
  status: 'OPEN',
  startDate: '2024-01-01T00:00:00',
  endDate: '2024-12-31T23:59:59'
});
```

#### Example 3: React Component with Loading State
```typescript
import React, { useState } from 'react';

interface ReportFilters {
  department?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

const ReportDownloader: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({});

  const handleDownload = async () => {
    setLoading(true);
    
    const params = new URLSearchParams();
    if (filters.department) params.append('department', filters.department);
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/reports/generate-excel?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Report generation failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DQIMS-Report-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('Report downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-downloader">
      <h2>Generate Excel Report</h2>
      
      <div className="filters">
        <select 
          value={filters.department || ''} 
          onChange={(e) => setFilters({...filters, department: e.target.value})}
        >
          <option value="">All Departments</option>
          <option value="Finance">Finance</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Operations">Operations</option>
        </select>
        
        <select 
          value={filters.status || ''} 
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        
        <input 
          type="datetime-local" 
          value={filters.startDate || ''} 
          onChange={(e) => setFilters({...filters, startDate: e.target.value + ':00'})}
          placeholder="Start Date"
        />
        
        <input 
          type="datetime-local" 
          value={filters.endDate || ''} 
          onChange={(e) => setFilters({...filters, endDate: e.target.value + ':00'})}
          placeholder="End Date"
        />
      </div>
      
      <button 
        onClick={handleDownload} 
        disabled={loading}
        className="download-btn"
      >
        {loading ? 'Generating Report...' : 'Download Excel Report'}
      </button>
    </div>
  );
};

export default ReportDownloader;
```

#### Example 4: Vue.js Component
```vue
<template>
  <div class="report-section">
    <h2>Generate Excel Report</h2>
    
    <div class="filters">
      <select v-model="filters.department">
        <option value="">All Departments</option>
        <option value="Finance">Finance</option>
        <option value="IT">IT</option>
        <option value="HR">HR</option>
      </select>
      
      <select v-model="filters.status">
        <option value="">All Statuses</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>
      
      <input type="datetime-local" v-model="filters.startDate" />
      <input type="datetime-local" v-model="filters.endDate" />
    </div>
    
    <button @click="downloadReport" :disabled="loading">
      {{ loading ? 'Generating...' : 'Download Excel Report' }}
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      filters: {
        department: '',
        status: '',
        startDate: '',
        endDate: ''
      }
    };
  },
  methods: {
    async downloadReport() {
      this.loading = true;
      
      const params = new URLSearchParams();
      if (this.filters.department) params.append('department', this.filters.department);
      if (this.filters.status) params.append('status', this.filters.status);
      if (this.filters.startDate) params.append('startDate', this.filters.startDate + ':00');
      if (this.filters.endDate) params.append('endDate', this.filters.endDate + ':00');
      
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/reports/generate-excel?${params.toString()}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (!response.ok) throw new Error('Failed to generate report');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DQIMS-Report-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        this.$toast.success('Report downloaded successfully!');
      } catch (error) {
        console.error('Download failed:', error);
        this.$toast.error('Failed to download report');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

## Excel Report Structure

The generated Excel file contains 4 sheets:

### Sheet 1: Summary
- **RRA Branding** - Professional header with organization name
- **Report Metadata** - Generation date, user, role, email
- **Applied Filters** - Shows which filters were applied
- **Summary Statistics** - Total issues, status breakdown, completion rate, average days open
- **Issues by Department** - Department-wise breakdown

### Sheet 2: Issues
- **Detailed Listing** - All issues with complete data
- **Columns:** ID, Title, Description, Status, Priority, Severity, Department, Reported By, Assigned To, Created Date, Updated Date
- **Formatting:** Alternating row colors for readability, bordered cells

### Sheet 3: Statistics
- **Issues by Status** - Count of issues in each status
- **Issues by Priority** - Priority distribution
- **Issues by Severity** - Severity distribution
- **Professional Tables** - Formatted with headers and borders

### Sheet 4: Activity Log
- **Audit Trail** - Complete activity tracking
- **Columns:** Issue ID, Title, Current Action, Status, Priority, Reported By, Assigned To, Last Updated, Days Open
- **Color Coding:** Issues open > 7 days highlighted in yellow
- **Legend:** Explains color coding system

## Error Handling

```javascript
const downloadReportWithErrorHandling = async (filters) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(
      `http://localhost:8080/api/v1/reports/generate-excel?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (response.status === 401) {
      throw new Error('Unauthorized. Please login again.');
    }
    
    if (response.status === 403) {
      throw new Error('You do not have permission to generate reports.');
    }
    
    if (response.status === 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    if (!response.ok) {
      throw new Error('Failed to generate report');
    }
    
    const blob = await response.blob();
    // ... download logic
    
  } catch (error) {
    console.error('Report generation error:', error);
    
    if (error.message.includes('Unauthorized')) {
      // Redirect to login
      window.location.href = '/login';
    } else {
      // Show user-friendly error
      alert(error.message);
    }
  }
};
```

## Testing

### Test Cases

1. **Basic Download**
   ```
   GET /api/v1/reports/generate-excel
   Expected: Excel file downloads with all issues
   ```

2. **Department Filter**
   ```
   GET /api/v1/reports/generate-excel?department=Finance
   Expected: Excel file with only Finance department issues
   ```

3. **Status Filter**
   ```
   GET /api/v1/reports/generate-excel?status=OPEN
   Expected: Excel file with only OPEN issues
   ```

4. **Date Range Filter**
   ```
   GET /api/v1/reports/generate-excel?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59
   Expected: Excel file with issues in date range
   ```

5. **Combined Filters**
   ```
   GET /api/v1/reports/generate-excel?department=IT&status=IN_PROGRESS&startDate=2024-01-01T00:00:00
   Expected: Excel file with IT department, IN_PROGRESS issues from 2024
   ```

## UI/UX Recommendations

### Report Generation Button
```jsx
<button 
  className="btn btn-primary"
  onClick={handleDownloadReport}
  disabled={loading}
>
  <i className="icon-download"></i>
  {loading ? 'Generating Report...' : 'Download Excel Report'}
</button>
```

### Filter Panel
```jsx
<div className="report-filters">
  <h3>Report Filters</h3>
  <div className="filter-group">
    <label>Department</label>
    <select onChange={handleDepartmentChange}>
      <option value="">All Departments</option>
      {/* ... */}
    </select>
  </div>
  {/* More filters */}
</div>
```

### Loading Indicator
```jsx
{loading && (
  <div className="loading-overlay">
    <div className="spinner"></div>
    <p>Generating your Excel report...</p>
  </div>
)}
```

## Security Considerations

1. **Authentication Required** - All report endpoints require valid JWT token
2. **Authorization** - Users can only generate reports for data they have access to
3. **Rate Limiting** - Consider implementing rate limiting for report generation
4. **File Size** - Large reports may take time to generate

## Performance Tips

1. **Use Filters** - Apply filters to reduce report size and generation time
2. **Loading States** - Always show loading indicators during report generation
3. **Error Handling** - Implement proper error handling and user feedback
4. **Caching** - Consider caching dashboard statistics for better performance

## Support

For issues or questions:
- Check backend logs: `Backend/DQIMS/logs/`
- Review API documentation: `Backend/DQIMS/REPORT-QUICK-START.md`
- Contact: DQIMS Development Team
