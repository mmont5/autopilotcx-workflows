# Knowledge Base API Specification

This document defines the API for programmatically accessing the AutopilotCX knowledge base, enabling AI agents to retrieve accurate, up-to-date information for user support.

## 🎯 API Overview

### Purpose
- Provide AI agents with programmatic access to knowledge base content
- Enable real-time information retrieval for user support
- Support semantic search and context-aware responses
- Maintain data consistency and version control

### Base URL
```
https://api.autopilotcx.app/kb/v1
```

### Authentication
```http
Authorization: Bearer {api_key}
Content-Type: application/json
```

## 📚 Core Endpoints

### Search Knowledge Base
```http
GET /search
```

**Parameters:**
- `query` (string, required): Search query
- `category` (string, optional): Limit to specific category
- `tier` (string, optional): User tier level (launch, grow, scale, agency, enterprise)
- `industry` (string, optional): Industry context (healthcare, real-estate, small-business)
- `limit` (integer, optional): Maximum results (default: 10)
- `offset` (integer, optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "kb_001",
        "title": "How to Set Up AI Agents",
        "category": "getting-started",
        "subcategory": "ai-agents-setup",
        "content": "Step-by-step guide for setting up AI agents...",
        "excerpt": "Learn how to configure your first AI agent...",
        "tags": ["ai-agents", "setup", "configuration"],
        "tier": ["launch", "grow", "scale"],
        "industry": ["healthcare", "real-estate", "small-business"],
        "last_updated": "2025-01-20T10:00:00Z",
        "relevance_score": 0.95
      }
    ],
    "total": 25,
    "has_more": true
  }
}
```

### Get Article by ID
```http
GET /articles/{article_id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "kb_001",
    "title": "How to Set Up AI Agents",
    "category": "getting-started",
    "subcategory": "ai-agents-setup",
    "content": "Full article content in markdown format...",
    "metadata": {
      "author": "AutopilotCX Team",
      "created": "2025-01-15T09:00:00Z",
      "last_updated": "2025-01-20T10:00:00Z",
      "version": "1.2",
      "read_time": "5 minutes"
    },
    "related_articles": ["kb_002", "kb_003"],
    "tags": ["ai-agents", "setup", "configuration"],
    "tier": ["launch", "grow", "scale"],
    "industry": ["healthcare", "real-estate", "small-business"]
  }
}
```

### Get Category Structure
```http
GET /categories
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "getting-started",
        "name": "Getting Started",
        "description": "Essential guides for new users",
        "subcategories": [
          {
            "id": "account-setup",
            "name": "Account Setup",
            "article_count": 15
          },
          {
            "id": "platform-basics",
            "name": "Platform Basics",
            "article_count": 12
          }
        ]
      }
    ]
  }
}
```

### Get Articles by Category
```http
GET /categories/{category_id}/articles
```

**Parameters:**
- `subcategory` (string, optional): Filter by subcategory
- `tier` (string, optional): Filter by user tier
- `industry` (string, optional): Filter by industry
- `limit` (integer, optional): Maximum results
- `offset` (integer, optional): Pagination offset

## 🔍 Advanced Search

### Semantic Search
```http
POST /search/semantic
```

**Request Body:**
```json
{
  "query": "My AI agent is not responding to customer messages",
  "context": {
    "user_tier": "grow",
    "industry": "healthcare",
    "user_experience": "intermediate",
    "current_issue": "customer_support"
  },
  "filters": {
    "category": ["troubleshooting", "ai-agents"],
    "priority": "high"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "kb_045",
        "title": "AI Agent Not Responding - Troubleshooting Guide",
        "relevance_score": 0.98,
        "confidence": "high",
        "solution_steps": [
          "Check agent status in dashboard",
          "Verify agent training and knowledge base",
          "Review escalation rules"
        ],
        "escalation_needed": false
      }
    ],
    "suggested_actions": [
      "Check agent configuration",
      "Review recent changes",
      "Test agent responses"
    ]
  }
}
```

### Context-Aware Search
```http
POST /search/context
```

**Request Body:**
```json
{
  "user_context": {
    "tier": "scale",
    "industry": "healthcare",
    "current_page": "dashboard",
    "recent_actions": ["created_workflow", "added_integration"],
    "error_messages": ["API rate limit exceeded"]
  },
  "query": "How to handle API rate limits"
}
```

## 🚨 Troubleshooting API

### Get Troubleshooting Solutions
```http
GET /troubleshooting/solutions
```

**Parameters:**
- `issue_type` (string, required): Type of issue
- `error_code` (string, optional): Specific error code
- `platform` (string, optional): Platform component
- `severity` (string, optional): Issue severity

**Response:**
```json
{
  "success": true,
  "data": {
    "issue": {
      "type": "api_rate_limit",
      "severity": "medium",
      "description": "API rate limit exceeded"
    },
    "solutions": [
      {
        "id": "sol_001",
        "title": "Implement Rate Limiting",
        "steps": [
          "Check current API usage",
          "Implement exponential backoff",
          "Add request queuing"
        ],
        "estimated_time": "15 minutes",
        "difficulty": "intermediate"
      }
    ],
    "prevention": [
      "Monitor API usage regularly",
      "Implement proper caching",
      "Use webhooks when possible"
    ]
  }
}
```

### Get Diagnostic Information
```http
POST /troubleshooting/diagnose
```

**Request Body:**
```json
{
  "symptoms": [
    "Posts not publishing",
    "Error message: 'Rate limit exceeded'",
    "Social media connection failed"
  ],
  "user_context": {
    "tier": "grow",
    "platform": "social-media",
    "recent_changes": ["added_new_account"]
  }
}
```

## 📊 Analytics & Insights

### Get Popular Articles
```http
GET /analytics/popular
```

**Parameters:**
- `timeframe` (string, optional): Time period (day, week, month)
- `category` (string, optional): Filter by category
- `limit` (integer, optional): Number of results

### Get Search Analytics
```http
GET /analytics/searches
```

**Parameters:**
- `timeframe` (string, optional): Time period
- `query_type` (string, optional): Type of search

### Submit Feedback
```http
POST /feedback
```

**Request Body:**
```json
{
  "article_id": "kb_001",
  "user_id": "user_123",
  "rating": 5,
  "helpful": true,
  "comment": "This solved my problem perfectly!",
  "issue_resolved": true
}
```

## 🔄 Real-Time Updates

### WebSocket Connection
```javascript
const ws = new WebSocket('wss://api.autopilotcx.app/kb/v1/updates');

ws.onmessage = function(event) {
  const update = JSON.parse(event.data);
  if (update.type === 'article_updated') {
    // Refresh cached article
    refreshArticle(update.article_id);
  }
};
```

### Subscribe to Updates
```http
POST /updates/subscribe
```

**Request Body:**
```json
{
  "categories": ["troubleshooting", "ai-agents"],
  "keywords": ["rate limit", "authentication"],
  "webhook_url": "https://your-agent.com/webhook"
}
```

## 🛡️ Security & Rate Limiting

### Rate Limits
- **Search API**: 100 requests per minute
- **Article Retrieval**: 500 requests per minute
- **Analytics API**: 50 requests per minute
- **WebSocket**: 10 concurrent connections

### Authentication
```http
GET /auth/validate
Authorization: Bearer {api_key}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "permissions": ["read", "search", "analytics"],
    "rate_limits": {
      "search": "100/minute",
      "articles": "500/minute"
    }
  }
}
```

## 📋 Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 60 seconds.",
    "details": {
      "limit": 100,
      "reset_time": "2025-01-20T10:01:00Z"
    }
  }
}
```

### Common Error Codes
- `INVALID_API_KEY`: Authentication failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `ARTICLE_NOT_FOUND`: Article doesn't exist
- `INVALID_QUERY`: Search query is invalid
- `PERMISSION_DENIED`: Insufficient permissions

## 🔧 Integration Examples

### JavaScript Integration
```javascript
class KnowledgeBaseAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.autopilotcx.app/kb/v1';
  }

  async search(query, context = {}) {
    const response = await fetch(`${this.baseURL}/search/semantic`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        context
      })
    });
    
    return response.json();
  }

  async getArticle(articleId) {
    const response = await fetch(`${this.baseURL}/articles/${articleId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    return response.json();
  }
}
```

### Python Integration
```python
import requests

class KnowledgeBaseAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://api.autopilotcx.app/kb/v1'
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def search(self, query, context=None):
        url = f"{self.base_url}/search/semantic"
        data = {'query': query}
        if context:
            data['context'] = context
        
        response = requests.post(url, headers=self.headers, json=data)
        return response.json()
    
    def get_article(self, article_id):
        url = f"{self.base_url}/articles/{article_id}"
        response = requests.get(url, headers=self.headers)
        return response.json()
```

## 📈 Performance Optimization

### Caching Strategy
- **Article Content**: Cache for 1 hour
- **Search Results**: Cache for 15 minutes
- **Category Structure**: Cache for 24 hours
- **Analytics Data**: Cache for 1 hour

### Best Practices
1. **Use Semantic Search**: For complex queries
2. **Implement Caching**: Reduce API calls
3. **Handle Rate Limits**: Implement exponential backoff
4. **Monitor Usage**: Track API consumption
5. **Update Regularly**: Keep cached data fresh

---

*This API specification enables AI agents to provide accurate, up-to-date support by accessing the comprehensive AutopilotCX knowledge base programmatically.* 