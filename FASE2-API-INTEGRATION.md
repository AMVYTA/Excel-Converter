# Fase 2 - Integrasi API Otomatis

Dokumentasi untuk implementasi integrasi API dengan aplikasi eksternal (Fase 2 development).

## Overview

Fase 2 akan menambahkan kemampuan untuk:
1. Mengambil data otomatis dari API Aplikasi Sumber
2. Mengkonversi data menggunakan template
3. Upload otomatis ke API Aplikasi Tujuan
4. Penjadwalan otomatis (cron jobs)

## Arsitektur Sistem

```
┌─────────────────┐
│  Aplikasi 1     │
│  (Source)       │
└────────┬────────┘
         │ API Fetch
         ↓
┌─────────────────────┐
│  Excel Converter    │
│  ┌───────────────┐  │
│  │  Scheduler    │  │
│  └───────┬───────┘  │
│          │          │
│  ┌───────↓───────┐  │
│  │  Converter    │  │
│  └───────┬───────┘  │
│          │          │
│  ┌───────↓───────┐  │
│  │  Template     │  │
│  │  Engine       │  │
│  └───────────────┘  │
└──────────┬──────────┘
           │ API Upload
           ↓
┌─────────────────┐
│  Aplikasi 2     │
│  (Target)       │
└─────────────────┘
```

## Module Structure

```javascript
backend/src/
├── integrations/
│   ├── app1/
│   │   ├── connector.js      // API connector untuk App 1
│   │   ├── mapper.js          // Data mapping dari App 1
│   │   └── config.js          // Configuration untuk App 1
│   │
│   ├── app2/
│   │   ├── connector.js      // API connector untuk App 2
│   │   ├── mapper.js          // Data mapping ke App 2
│   │   └── config.js          // Configuration untuk App 2
│   │
│   └── scheduler/
│       ├── cron.js            // Cron job scheduler
│       ├── queue.js           // Job queue management
│       └── worker.js          // Background worker
│
├── services/
│   ├── integrationService.js  // Orchestration service
│   └── notificationService.js // Email/notification service
│
└── controllers/
    └── integrationController.js // API endpoints
```

## API Connector Interface

### App1 Connector (Source)

```javascript
/**
 * App1 Connector
 * Mengambil data dari aplikasi sumber
 */

class App1Connector {
  constructor(config) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Fetch data dari App1
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} - Data records
   */
  async fetchData(params = {}) {
    try {
      const response = await this.client.get('/api/products', { params });
      return this.transformResponse(response.data);
    } catch (error) {
      throw new Error(`App1 fetch failed: ${error.message}`);
    }
  }

  /**
   * Transform response ke format standard
   * @param {Object} data - Raw API response
   * @returns {Array} - Standardized data
   */
  transformResponse(data) {
    // Transform sesuai struktur App1
    return data.items.map(item => ({
      productCode: item.code,
      productName: item.name,
      price: item.price,
      stock: item.stock,
      // ... fields lainnya
    }));
  }

  /**
   * Test connection
   * @returns {Promise<boolean>}
   */
  async testConnection() {
    try {
      await this.client.get('/api/health');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default App1Connector;
```

### App2 Connector (Target)

```javascript
/**
 * App2 Connector
 * Upload data ke aplikasi tujuan
 */

class App2Connector {
  constructor(config) {
    this.apiUrl = config.apiUrl;
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Upload data ke App2
   * @param {Array} data - Converted data
   * @returns {Promise<Object>} - Upload result
   */
  async uploadData(data) {
    try {
      const payload = this.preparePayload(data);
      const response = await this.client.post('/api/products/import', payload);
      return {
        success: true,
        count: data.length,
        response: response.data
      };
    } catch (error) {
      throw new Error(`App2 upload failed: ${error.message}`);
    }
  }

  /**
   * Prepare payload sesuai format App2
   * @param {Array} data - Converted data
   * @returns {Object} - API payload
   */
  preparePayload(data) {
    return {
      products: data.map(item => ({
        code: item.productCode,
        name: item.productName,
        price: parseFloat(item.price),
        quantity: parseInt(item.stock),
        // ... fields lainnya
      }))
    };
  }

  /**
   * Test connection
   * @returns {Promise<boolean>}
   */
  async testConnection() {
    try {
      await this.client.get('/api/health');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default App2Connector;
```

## Integration Service

```javascript
/**
 * Integration Service
 * Orchestrates the full integration flow
 */

import App1Connector from '../integrations/app1/connector.js';
import App2Connector from '../integrations/app2/connector.js';
import excelService from './excelService.js';
import templateService from './templateService.js';

class IntegrationService {
  constructor() {
    this.app1 = null;
    this.app2 = null;
  }

  /**
   * Initialize connectors
   */
  initialize(app1Config, app2Config) {
    this.app1 = new App1Connector(app1Config);
    this.app2 = new App2Connector(app2Config);
  }

  /**
   * Run full integration flow
   * @param {string} templateId - Template ID to use
   * @returns {Promise<Object>} - Integration result
   */
  async runIntegration(templateId) {
    try {
      // 1. Fetch data from App1
      console.log('Fetching data from App1...');
      const sourceData = await this.app1.fetchData();

      // 2. Get conversion template
      const template = await templateService.getTemplateById(templateId);

      // 3. Apply mapping and convert data
      console.log('Converting data...');
      const convertedData = excelService.applyMapping(sourceData, template);

      // 4. Upload to App2
      console.log('Uploading to App2...');
      const uploadResult = await this.app2.uploadData(convertedData);

      return {
        success: true,
        sourceRecords: sourceData.length,
        convertedRecords: convertedData.length,
        uploadResult: uploadResult
      };
    } catch (error) {
      console.error('Integration failed:', error);
      throw error;
    }
  }

  /**
   * Test all connections
   * @returns {Promise<Object>}
   */
  async testConnections() {
    const app1Status = await this.app1.testConnection();
    const app2Status = await this.app2.testConnection();

    return {
      app1: app1Status ? 'Connected' : 'Failed',
      app2: app2Status ? 'Connected' : 'Failed'
    };
  }
}

export default new IntegrationService();
```

## Scheduler (Cron Jobs)

```javascript
/**
 * Cron Scheduler
 * Automated scheduled integrations
 */

import cron from 'node-cron';
import integrationService from '../../services/integrationService.js';
import notificationService from '../../services/notificationService.js';

class Scheduler {
  constructor() {
    this.jobs = new Map();
  }

  /**
   * Schedule integration job
   * @param {string} jobId - Unique job ID
   * @param {string} cronExpression - Cron expression (e.g., '0 0 * * *')
   * @param {string} templateId - Template to use
   * @param {Object} config - Job configuration
   */
  scheduleJob(jobId, cronExpression, templateId, config = {}) {
    const job = cron.schedule(cronExpression, async () => {
      console.log(`Running scheduled job: ${jobId}`);

      try {
        const result = await integrationService.runIntegration(templateId);

        // Send success notification
        if (config.notifyOnSuccess) {
          await notificationService.sendEmail({
            to: config.email,
            subject: `Integration Success: ${jobId}`,
            body: `Successfully processed ${result.convertedRecords} records.`
          });
        }
      } catch (error) {
        console.error(`Job ${jobId} failed:`, error);

        // Send failure notification
        if (config.notifyOnFailure) {
          await notificationService.sendEmail({
            to: config.email,
            subject: `Integration Failed: ${jobId}`,
            body: `Error: ${error.message}`
          });
        }
      }
    });

    this.jobs.set(jobId, job);
    console.log(`Scheduled job ${jobId} with expression: ${cronExpression}`);
  }

  /**
   * Stop scheduled job
   */
  stopJob(jobId) {
    const job = this.jobs.get(jobId);
    if (job) {
      job.stop();
      this.jobs.delete(jobId);
      console.log(`Stopped job: ${jobId}`);
    }
  }

  /**
   * Get all active jobs
   */
  getActiveJobs() {
    return Array.from(this.jobs.keys());
  }
}

export default new Scheduler();
```

## API Endpoints (Fase 2)

### Integration Endpoints

```javascript
// POST /api/integrations/run
{
  "templateId": "uuid",
  "source": "app1",
  "target": "app2"
}

// POST /api/integrations/schedule
{
  "name": "Daily Product Sync",
  "cronExpression": "0 0 * * *",  // Daily at midnight
  "templateId": "uuid",
  "config": {
    "notifyOnSuccess": true,
    "notifyOnFailure": true,
    "email": "admin@example.com"
  }
}

// GET /api/integrations/schedules
// Response: List of scheduled jobs

// DELETE /api/integrations/schedules/:jobId
// Stop and remove scheduled job

// GET /api/integrations/test-connection
// Test connectivity to both apps
```

## Cron Expression Examples

```
# Setiap hari jam 00:00
0 0 * * *

# Setiap jam
0 * * * *

# Setiap 30 menit
*/30 * * * *

# Setiap Senin jam 09:00
0 9 * * 1

# Setiap hari kerja jam 08:00
0 8 * * 1-5

# Setiap tanggal 1 jam 00:00
0 0 1 * *
```

## Environment Variables (Fase 2)

```env
# App1 Configuration
APP1_API_URL=https://api.app1.com
APP1_API_KEY=your-api-key-here
APP1_TIMEOUT=30000

# App2 Configuration
APP2_API_URL=https://api.app2.com
APP2_API_KEY=your-api-key-here
APP2_TIMEOUT=30000

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
NOTIFICATION_EMAIL=admin@example.com

# Scheduler
ENABLE_SCHEDULER=true
TIMEZONE=Asia/Jakarta
```

## Testing Integration

```javascript
// Test connection
const result = await integrationService.testConnections();
console.log(result);
// { app1: 'Connected', app2: 'Connected' }

// Run manual integration
const result = await integrationService.runIntegration('template-uuid');
console.log(result);
// {
//   success: true,
//   sourceRecords: 100,
//   convertedRecords: 100,
//   uploadResult: { ... }
// }
```

## Error Handling

```javascript
try {
  await integrationService.runIntegration(templateId);
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    // Connection failed
  } else if (error.response?.status === 401) {
    // Authentication failed
  } else if (error.response?.status === 429) {
    // Rate limit exceeded
  } else {
    // Other errors
  }
}
```

## Monitoring & Logging

```javascript
// Log integration runs
{
  "timestamp": "2024-01-01T00:00:00Z",
  "jobId": "daily-sync",
  "templateId": "uuid",
  "status": "success",
  "sourceRecords": 150,
  "convertedRecords": 150,
  "duration": 5230,  // ms
  "errors": []
}
```

## Best Practices

1. **Rate Limiting**: Implementasi retry dengan exponential backoff
2. **Idempotency**: Pastikan upload bisa di-retry tanpa duplikasi
3. **Validation**: Validate data sebelum upload
4. **Monitoring**: Log semua aktivitas integrasi
5. **Notifications**: Email notification untuk success/failure
6. **Backup**: Simpan raw data sebelum konversi

## Deployment Considerations

1. **Queue System**: Gunakan Redis/Bull untuk job queue di production
2. **Worker Processes**: Multiple workers untuk parallel processing
3. **Monitoring**: Gunakan tools seperti PM2, New Relic, atau DataDog
4. **Secrets Management**: Gunakan vault untuk API keys (HashiCorp Vault, AWS Secrets Manager)

---

**Status**: Dokumentasi untuk fase development selanjutnya
