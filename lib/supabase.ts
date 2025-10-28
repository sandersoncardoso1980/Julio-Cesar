import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lvkbbtfcsxpjxlezfrwp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a2JidGZjc3hwanhsZXpmcndwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTI5NjcsImV4cCI6MjA3MDU4ODk2N30.SPnPUp4pXBAuXqfquV4TiBUkD5JYqM2SKq6-njM5Er0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
