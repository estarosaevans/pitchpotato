// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tjwhzcbufhgwiaocftok.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqd2h6Y2J1Zmhnd2lhb2NmdG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyMzY5OTMsImV4cCI6MjA1MTgxMjk5M30.cxCDZsW0IDB1exTq3_595xz7KQB-1qtOowotiOryPNE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);