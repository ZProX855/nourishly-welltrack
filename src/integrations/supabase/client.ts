// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lxkowsyqeishluutfdfw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4a293c3lxZWlzaGx1dXRmZGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NTIyNjQsImV4cCI6MjA1NjEyODI2NH0.D6uaO9IsIOT-A2WK3VHbS8o1Tx4olaxYQeBeIGnD2VI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);