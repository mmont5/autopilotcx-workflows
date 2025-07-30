-- Apply Webhook System Migration
-- Run this in your Supabase SQL Editor

-- Step 1: Drop all existing webhook-related functions and triggers
DROP TRIGGER IF EXISTS demo ON demo;
DROP TRIGGER IF EXISTS demo_created_webhook ON demo;
DROP TRIGGER IF EXISTS demo_webhook_trigger ON demo;

DROP FUNCTION IF EXISTS notify_demo_created();
DROP FUNCTION IF EXISTS notify_n8n_on_demo_insert();
DROP FUNCTION IF EXISTS trigger_demo_webhook(UUID);
DROP FUNCTION IF EXISTS trigger_demo_webhook(UUID, TEXT);
DROP FUNCTION IF EXISTS set_webhook_url(TEXT);

-- Step 2: Create a webhook configuration table
CREATE TABLE IF NOT EXISTS webhook_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create function to update webhook URL
CREATE OR REPLACE FUNCTION update_webhook_url(webhook_name TEXT, new_url TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Insert or update the webhook URL
    INSERT INTO webhook_config (name, url, updated_at)
    VALUES (webhook_name, new_url, NOW())
    ON CONFLICT (name) 
    DO UPDATE SET 
        url = EXCLUDED.url,
        updated_at = NOW();
    
    result := jsonb_build_object(
        'success', true,
        'message', 'Webhook URL updated successfully',
        'name', webhook_name,
        'url', new_url,
        'updated_at', NOW()
    );
    
    RAISE LOG 'Webhook URL updated: % = %', webhook_name, new_url;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create function to get webhook URL
CREATE OR REPLACE FUNCTION get_webhook_url(webhook_name TEXT)
RETURNS TEXT AS $$
DECLARE
    webhook_url TEXT;
BEGIN
    SELECT url INTO webhook_url 
    FROM webhook_config 
    WHERE name = webhook_name AND is_active = true;
    
    RETURN webhook_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create the main webhook notification function
CREATE OR REPLACE FUNCTION notify_demo_created()
RETURNS TRIGGER AS $$
DECLARE
    webhook_url TEXT;
    response_status INTEGER;
    response_body TEXT;
    webhook_name TEXT := 'demo_created';
BEGIN
    -- Get the webhook URL from configuration
    webhook_url := get_webhook_url(webhook_name);
    
    -- If no webhook URL is configured, log and return
    IF webhook_url IS NULL THEN
        RAISE LOG 'No webhook URL configured for %. Demo created but webhook not sent.', webhook_name;
        RETURN NEW;
    END IF;
    
    -- Send HTTP request to webhook
    SELECT 
        status,
        content
    INTO 
        response_status,
        response_body
    FROM 
        http_post(
            webhook_url,
            row_to_json(NEW)::text,
            'application/json'
        );
    
    -- Log the webhook attempt
    RAISE LOG 'Demo created webhook sent to %: status=%, response=%', 
        webhook_url, response_status, response_body;
    
    -- If webhook failed, log warning but don't fail the transaction
    IF response_status < 200 OR response_status >= 300 THEN
        RAISE WARNING 'Webhook failed with status %: %', response_status, response_body;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create manual webhook trigger function
CREATE OR REPLACE FUNCTION trigger_demo_webhook(demo_id UUID)
RETURNS JSONB AS $$
DECLARE
    demo_record demo%ROWTYPE;
    webhook_url TEXT;
    response_status INTEGER;
    response_body TEXT;
    result JSONB;
    webhook_name TEXT := 'demo_created';
BEGIN
    -- Get the demo record
    SELECT * INTO demo_record FROM demo WHERE id = demo_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Demo with id % not found', demo_id;
    END IF;
    
    -- Get the webhook URL
    webhook_url := get_webhook_url(webhook_name);
    
    IF webhook_url IS NULL THEN
        result := jsonb_build_object(
            'success', false,
            'error', 'No webhook URL configured',
            'demo_id', demo_id
        );
        RETURN result;
    END IF;
    
    -- Send HTTP request to webhook
    SELECT 
        status,
        content
    INTO 
        response_status,
        response_body
    FROM 
        http_post(
            webhook_url,
            row_to_json(demo_record)::text,
            'application/json'
        );
    
    -- Create result object
    result := jsonb_build_object(
        'success', response_status >= 200 AND response_status < 300,
        'status', response_status,
        'response', response_body,
        'webhook_url', webhook_url,
        'demo_id', demo_id
    );
    
    -- Log the webhook attempt
    RAISE LOG 'Manual demo webhook triggered for demo %: status=%, response=%', 
        demo_id, response_status, response_body;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create the trigger
CREATE TRIGGER demo_created_webhook
    AFTER INSERT ON demo
    FOR EACH ROW
    EXECUTE FUNCTION notify_demo_created();

-- Step 8: Insert the current NGROK webhook URL
INSERT INTO webhook_config (name, url, is_active)
VALUES (
    'demo_created', 
    'https://136a-2603-9001-9300-481f-34ca-2ef4-25fa-5d9b.ngrok-free.app/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31',
    true
)
ON CONFLICT (name) 
DO UPDATE SET 
    url = EXCLUDED.url,
    updated_at = NOW();

-- Step 9: Create function to test webhook
CREATE OR REPLACE FUNCTION test_webhook(webhook_name TEXT DEFAULT 'demo_created')
RETURNS JSONB AS $$
DECLARE
    webhook_url TEXT;
    test_data JSONB;
    response_status INTEGER;
    response_body TEXT;
    result JSONB;
BEGIN
    -- Get the webhook URL
    webhook_url := get_webhook_url(webhook_name);
    
    IF webhook_url IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'No webhook URL configured for ' || webhook_name
        );
    END IF;
    
    -- Create test data
    test_data := jsonb_build_object(
        'event', 'test',
        'timestamp', NOW(),
        'message', 'Webhook test from Supabase'
    );
    
    -- Send test request
    SELECT 
        status,
        content
    INTO 
        response_status,
        response_body
    FROM 
        http_post(
            webhook_url,
            test_data::text,
            'application/json'
        );
    
    -- Create result
    result := jsonb_build_object(
        'success', response_status >= 200 AND response_status < 300,
        'status', response_status,
        'response', response_body,
        'webhook_url', webhook_url,
        'test_data', test_data
    );
    
    RAISE LOG 'Webhook test for %: status=%, response=%', webhook_name, response_status, response_body;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create updated_at trigger for webhook_config
CREATE OR REPLACE FUNCTION update_webhook_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_webhook_config_updated_at
    BEFORE UPDATE ON webhook_config
    FOR EACH ROW
    EXECUTE FUNCTION update_webhook_config_updated_at();

-- Step 11: Grant permissions
GRANT SELECT, INSERT, UPDATE ON webhook_config TO authenticated;
GRANT EXECUTE ON FUNCTION update_webhook_url(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_webhook_url(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION trigger_demo_webhook(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION test_webhook(TEXT) TO authenticated;

-- Step 12: Verify the setup
DO $$
BEGIN
    RAISE LOG 'Webhook system setup complete';
    RAISE LOG 'Current webhook URL: %', get_webhook_url('demo_created');
END $$;

-- Step 13: Test the webhook (optional - uncomment to test)
-- SELECT test_webhook('demo_created'); 