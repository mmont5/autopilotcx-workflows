#!/usr/bin/env node

/**
 * Test script for SEO Content Creation Services
 * Tests both keyword-scout and hashtag-miner services
 */

const axios = require('axios');

const KEYWORD_SCOUT_URL = 'http://localhost:8700';
const HASHTAG_MINER_URL = 'http://localhost:8710';

const testTopic = 'pickleball';

async function testKeywordScout() {
  console.log('🔍 Testing Keyword Scout Service...');
  
  try {
    // Test trending keywords
    const keywordsResponse = await axios.post(`${KEYWORD_SCOUT_URL}/api/trending-keywords`, {
      topic: testTopic,
      language: 'en',
      country: 'US',
      limit: 5,
      includeSearchVolume: true,
      includeCompetition: true,
      includeCPC: true
    });

    console.log('✅ Keywords API Response:', {
      success: keywordsResponse.data.success,
      keywordsFound: keywordsResponse.data.data?.keywords?.length || 0,
      topic: keywordsResponse.data.data?.topic
    });

    // Test content creation
    const contentResponse = await axios.post(`${KEYWORD_SCOUT_URL}/api/content-creation`, {
      topic: testTopic,
      selectedKeywords: [testTopic, `${testTopic} tips`],
      selectedHashtags: [`#${testTopic}`, `#${testTopic}life`],
      platforms: ['facebook', 'instagram', 'twitter'],
      contentTypes: ['post', 'blog'],
      tone: 'professional',
      language: 'en'
    });

    console.log('✅ Content Creation API Response:', {
      success: contentResponse.data.success,
      platformsGenerated: Object.keys(contentResponse.data.data?.generatedContent || {}).length
    });

  } catch (error) {
    console.error('❌ Keyword Scout Service Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

async function testHashtagMiner() {
  console.log('🏷️ Testing Hashtag Miner Service...');
  
  try {
    // Test trending hashtags
    const hashtagsResponse = await axios.post(`${HASHTAG_MINER_URL}/api/trending-hashtags`, {
      topic: testTopic,
      platforms: ['twitter', 'instagram'],
      limit: 5,
      includeEngagementVolume: true,
      timeframe: '7d',
      language: 'en',
      country: 'US'
    });

    console.log('✅ Hashtags API Response:', {
      success: hashtagsResponse.data.success,
      hashtagsFound: hashtagsResponse.data.data?.hashtags?.length || 0,
      topic: hashtagsResponse.data.data?.topic
    });

    // Test hashtag analysis
    const analysisResponse = await axios.post(`${HASHTAG_MINER_URL}/api/hashtag-analysis`, {
      hashtags: [`#${testTopic}`, `#${testTopic}life`],
      platforms: ['twitter', 'instagram'],
      timeframe: '7d',
      includeSentiment: true,
      includeRelatedHashtags: true
    });

    console.log('✅ Hashtag Analysis API Response:', {
      success: analysisResponse.data.success,
      analysesCount: analysisResponse.data.data?.analyses?.length || 0
    });

    // Test hashtag recommendations
    const recommendationsResponse = await axios.post(`${HASHTAG_MINER_URL}/api/hashtag-recommendations`, {
      topic: testTopic,
      industry: 'sports',
      targetAudience: 'fitness enthusiasts',
      platforms: ['twitter', 'instagram'],
      limit: 5,
      includeEngagementVolume: true
    });

    console.log('✅ Hashtag Recommendations API Response:', {
      success: recommendationsResponse.data.success,
      recommendedCount: recommendationsResponse.data.data?.recommendedHashtags?.length || 0
    });

  } catch (error) {
    console.error('❌ Hashtag Miner Service Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

async function testHealthChecks() {
  console.log('🏥 Testing Health Checks...');
  
  try {
    const keywordHealth = await axios.get(`${KEYWORD_SCOUT_URL}/health`);
    console.log('✅ Keyword Scout Health:', keywordHealth.data);

    const hashtagHealth = await axios.get(`${HASHTAG_MINER_URL}/health`);
    console.log('✅ Hashtag Miner Health:', hashtagHealth.data);

  } catch (error) {
    console.error('❌ Health Check Error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting SEO Content Creation Services Tests...\n');
  
  await testHealthChecks();
  console.log('');
  
  await testKeywordScout();
  console.log('');
  
  await testHashtagMiner();
  console.log('');
  
  console.log('✨ SEO Services Testing Complete!');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testKeywordScout,
  testHashtagMiner,
  testHealthChecks,
  runTests
}; 