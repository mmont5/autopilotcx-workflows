#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyLearningTables() {
  console.log('🔍 Verifying Continuous Learning Engine Tables...\n');

  const expectedTables = [
    'rapid_learning',
    'domain_expertise',
    'knowledge_sources',
    'industry_knowledge',
    'business_processes',
    'customer_interactions',
    'technical_details',
    'regulatory_compliance',
    'continuous_learning_insights',
    'platform_analytics',
    'recommendations',
    'learning_feedback',
    'learning_performance',
    'analytics_timeseries',
    'domain_knowledge',
    'knowledge_base',
    'learning_analytics',
    'shared_knowledge'
  ];

  const results = [];

  for (const tableName of expectedTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        results.push({ table: tableName, status: '❌ ERROR', error: error.message });
      } else {
        results.push({ table: tableName, status: '✅ EXISTS', count: data?.length || 0 });
      }
    } catch (err) {
      results.push({ table: tableName, status: '❌ NOT FOUND', error: err.message });
    }
  }

  // Display results
  console.log('📊 Table Verification Results:\n');
  
  let successCount = 0;
  let errorCount = 0;

  results.forEach(result => {
    const status = result.status;
    const table = result.table.padEnd(30);
    
    if (status === '✅ EXISTS') {
      console.log(`${table} ${status}`);
      successCount++;
    } else {
      console.log(`${table} ${status} - ${result.error}`);
      errorCount++;
    }
  });

  console.log('\n📈 Summary:');
  console.log(`✅ Successfully created: ${successCount} tables`);
  console.log(`❌ Failed to create: ${errorCount} tables`);

  if (errorCount === 0) {
    console.log('\n🎉 ALL CONTINUOUS LEARNING ENGINE TABLES CREATED SUCCESSFULLY!');
    console.log('🚀 The learning engine database schema is now ready!');
  } else {
    console.log('\n⚠️  Some tables failed to create. Check the errors above.');
  }

  // Test inserting sample data
  console.log('\n🧪 Testing sample data insertion...');
  
  try {
    const { data, error } = await supabase
      .from('continuous_learning_insights')
      .insert({
        insight_id: 'test-insight-001',
        domain_id: 'test-domain',
        insight_type: 'pattern',
        insight_data: { test: 'data' },
        confidence: 0.95,
        source: 'test'
      });

    if (error) {
      console.log('❌ Sample data insertion failed:', error.message);
    } else {
      console.log('✅ Sample data insertion successful!');
    }
  } catch (err) {
    console.log('❌ Sample data insertion failed:', err.message);
  }
}

verifyLearningTables().catch(console.error); 