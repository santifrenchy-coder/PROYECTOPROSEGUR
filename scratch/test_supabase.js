const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://iwxxixyjaxenojckohml.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eHhpeHlqYXhlbm9qY2tvaG1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjEyMjMsImV4cCI6MjA5MjkzNzIyM30.NO3dG4HALVF81bXZoGRsiDxbwuYzi53pjNyGt4O85lA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
    console.log("Checking table 'leads'...");
    const { data, error } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error("Error checking table:", error.message);
        console.error("Details:", error.details);
        console.error("Hint:", error.hint);
    } else {
        console.log("Table 'leads' exists and is accessible.");
        console.log("Row count:", data ? data.length : 0);
    }
    
    // Try to list columns by fetching one row
    const { data: sample, error: sampleError } = await supabase
        .from('leads')
        .select('*')
        .limit(1);
        
    if (sampleError) {
        console.error("Error fetching sample row:", sampleError.message);
    } else if (sample && sample.length > 0) {
        console.log("Columns found in 'leads':", Object.keys(sample[0]));
    } else {
        console.log("No data found in 'leads' table yet.");
    }
}

testConnection();
