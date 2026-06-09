# 🎨 Frontend Integration Guide - DQIMS Reports

## Quick Start for Frontend Developers

This guide shows you how to integrate DQIMS report generation into your frontend application.

---

## 📋 Available Endpoints

### Base URL
```
http://localhost:8080/api/v1/reports
```

### Endpoints

1. **Dashboard Statistics** - `GET /dashboard-stats`
2. **Generate Report** - `GET /generate?format={excel|csv}&filters...`

---

## 🔐 Authentication

All endpoints require Bearer token authentication:

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 📊 1. Dashboard Statistics

### Endpoint
```
GET /api/v1/reports/dashboard-stats
```

### Response
```json
{
  "totalIssues": 13,
  "openIssues": 3,
  "inProgressIssues": 4,
  "resolvedIssues": 3,
  "closedIssues": 3,
  "totalUsers": 31
}
```

### React Example
```javascript
import { useState, useEffect } from 'react';

function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/v1/reports/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <h3>Total Issues</h3>
        <p>{stats.totalIssues}</p>
      </div>
      <div className="stat-card">
        <h3>Open Issues</h3>
        <p>{stats.openIssues}</p>
      </div>
      <div className="stat-card">
        <h3>In Progress</h3>
        <p>{stats.inProgressIssues}</p>
      </div>
      <div className="stat-card">
        <h3>Resolved</h3>
        <p>{stats.resolvedIssues}</p>
      </div>
      <div className="stat-card">
        <h3>Closed</h3>
        <p>{stats.closedIssues}</p>
      </div>
    </div>
  );
}
```

---

## 📥 2. Download Reports

### Endpoint
```
GET /api/v1/reports/generate?format={excel|csv}&filters...
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| format | string | Yes | `excel` or `csv` |
| department | string | No | Filter by department name |
| status | string | No | Filter by status (OPEN, IN_PROGRESS, RESOLVED, CLOSED) |
| startDate | datetime | No | Filter from date (ISO 8601 format) |
| endDate | datetime | No | Filter to date (ISO 8601 format) |

### React Component - Complete Example

```javascript
import React, { useState } from 'react';

function ReportDownloader() {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  
  const downloadReport = async (format) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const params = new URLSearchParams({ format });
      
      if (filters.department) params.append('department', filters.department);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      // Fetch report
      const response = await fetch(
        `http://localhost:8080/api/v1/reports/generate?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      // Get filename from headers
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : `report.${format === 'excel' ? 'xlsx' : 'csv'}`;
      
      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('Report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="report-downloader">
      <h2>Generate Reports</h2>
      
      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Department:</label>
          <select 
            value={filters.department}
            onChange={(e) => setFilters({...filters, department: e.target.value})}
          >
            <option value="">All Departments</option>
            <option value="Finance">Finance</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Operations">Operations</option>
            <option value="Customs">Customs</option>
            <option value="VAT">VAT</option>
            <option value="Compliance">Compliance</option>
            <option value="Data Management">Data Management</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Start Date:</label>
          <input 
            type="datetime-local"
            value={filters.startDate}
            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
          />
        </div>
        
        <div className="filter-group">
          <label>End Date:</label>
          <input 
            type="datetime-local"
            value={filters.endDate}
            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
          />
        </div>
      </div>
      
      {/* Download Buttons */}
      <div className="download-buttons">
        <button 
          onClick={() => downloadReport('excel')}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Generating...' : '📊 Download Excel Report'}
        </button>
        
        <button 
          onClick={() => downloadReport('csv')}
          disabled={loading}
          className="btn btn-success"
        >
          {loading ? 'Generating...' : '📄 Export to CSV'}
        </button>
      </div>
    </div>
  );
}

export default ReportDownloader;
```

### CSS Styling

```css
.report-downloader {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.report-downloader h2 {
  margin-bottom: 20px;
  color: #0070C0;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.filter-group select,
.filter-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.download-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #0070C0;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #005a9e;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
}
```

---

## 🎯 Simple Usage Examples

### Download All Issues (Excel)
```javascript
const downloadAllIssues = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(
    'http://localhost:8080/api/v1/reports/generate?format=excel',
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'report.xlsx';
  a.click();
};
```

### Download Finance Department (CSV)
```javascript
const downloadFinanceCSV = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(
    'http://localhost:8080/api/v1/reports/generate?format=csv&department=Finance',
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'finance-data.csv';
  a.click();
};
```

### Download Open Issues (Excel)
```javascript
const downloadOpenIssues = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(
    'http://localhost:8080/api/v1/reports/generate?format=excel&status=OPEN',
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'open-issues.xlsx';
  a.click();
};
```

---

## 🌐 Angular Example

```typescript
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-report-downloader',
  templateUrl: './report-downloader.component.html'
})
export class ReportDownloaderComponent {
  loading = false;
  filters = {
    department: '',
    status: '',
    startDate: '',
    endDate: ''
  };
  
  constructor(private http: HttpClient) {}
  
  downloadReport(format: 'excel' | 'csv') {
    this.loading = true;
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    // Build query params
    let params = `format=${format}`;
    if (this.filters.department) params += `&department=${this.filters.department}`;
    if (this.filters.status) params += `&status=${this.filters.status}`;
    if (this.filters.startDate) params += `&startDate=${this.filters.startDate}`;
    if (this.filters.endDate) params += `&endDate=${this.filters.endDate}`;
    
    this.http.get(
      `http://localhost:8080/api/v1/reports/generate?${params}`,
      { headers, responseType: 'blob', observe: 'response' }
    ).subscribe({
      next: (response) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1].replace(/"/g, '')
          : `report.${format === 'excel' ? 'xlsx' : 'csv'}`;
        
        const blob = response.body;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error downloading report:', error);
        alert('Failed to download report');
        this.loading = false;
      }
    });
  }
}
```

---

## 🎨 Vue.js Example

```vue
<template>
  <div class="report-downloader">
    <h2>Generate Reports</h2>
    
    <!-- Filters -->
    <div class="filters">
      <div class="filter-group">
        <label>Department:</label>
        <select v-model="filters.department">
          <option value="">All Departments</option>
          <option value="Finance">Finance</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Status:</label>
        <select v-model="filters.status">
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
    </div>
    
    <!-- Buttons -->
    <div class="download-buttons">
      <button @click="downloadReport('excel')" :disabled="loading" class="btn btn-primary">
        {{ loading ? 'Generating...' : '📊 Download Excel' }}
      </button>
      <button @click="downloadReport('csv')" :disabled="loading" class="btn btn-success">
        {{ loading ? 'Generating...' : '📄 Export CSV' }}
      </button>
    </div>
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
    async downloadReport(format) {
      this.loading = true;
      
      try {
        const token = localStorage.getItem('token');
        
        const params = new URLSearchParams({ format });
        if (this.filters.department) params.append('department', this.filters.department);
        if (this.filters.status) params.append('status', this.filters.status);
        if (this.filters.startDate) params.append('startDate', this.filters.startDate);
        if (this.filters.endDate) params.append('endDate', this.filters.endDate);
        
        const response = await fetch(
          `http://localhost:8080/api/v1/reports/generate?${params}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (!response.ok) throw new Error('Failed to generate report');
        
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition
          ? contentDisposition.split('filename=')[1].replace(/"/g, '')
          : `report.${format === 'excel' ? 'xlsx' : 'csv'}`;
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        
        this.$message.success('Report downloaded successfully!');
      } catch (error) {
        console.error('Error:', error);
        this.$message.error('Failed to download report');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

---

## ✅ Testing Checklist

- [ ] Can fetch dashboard statistics
- [ ] Can download Excel report (all issues)
- [ ] Can download CSV export (all issues)
- [ ] Can filter by department
- [ ] Can filter by status
- [ ] Can filter by date range
- [ ] Can combine multiple filters
- [ ] Loading state works correctly
- [ ] Error handling works
- [ ] File downloads with correct name
- [ ] Excel file has 4 sheets
- [ ] CSV file is properly formatted

---

## 🐛 Common Issues

### Issue: CORS Error
**Solution:** Backend has `@CrossOrigin(origins = "*")` enabled. If still getting CORS errors, check your backend is running on port 8080.

### Issue: 401 Unauthorized
**Solution:** Make sure you're sending the Bearer token in the Authorization header.

### Issue: File not downloading
**Solution:** Check browser console for errors. Make sure response is blob type.

### Issue: Wrong filename
**Solution:** Backend sends filename in Content-Disposition header. Make sure you're reading it correctly.

---

## 📞 Support

If you need help:
1. Check backend is running: `http://localhost:8080/api/v1/reports/dashboard-stats`
2. Check token is valid
3. Check browser console for errors
4. Check network tab in browser dev tools

---

**Last Updated:** May 6, 2026  
**Backend Port:** 8080  
**Formats:** Excel, CSV  
**Authentication:** Bearer Token
