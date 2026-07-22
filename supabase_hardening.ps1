# -----------------------------------------------------------------
# supabase_hardening.ps1 – One‑click Supabase hardening
# -----------------------------------------------------------------
# 1️⃣ Set the required environment variables (access token & project ref)
$Env:SUPABASE_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtaXVtdmpxcXhpa2diYWFlYW9tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzAwNDE3OCwiZXhwIjoyMDk4NTgwMTc4fQ.DawzYFP-Cf2Z3a21tA71DJtnDu8vOpfgu7QvzNnCpNI"
$Env:SUPABASE_PROJECT_REF = "vmiumvjqqxikgbaaeaom"

# 2️⃣ Link the local folder to the remote Supabase project (creates .supabase/config)
supabase link --project-ref $Env:SUPABASE_PROJECT_REF

# 3️⃣ Push the migration file that contains the hardening policies
supabase db push

# -----------------------------------------------------------------
# OPTIONAL – add the owner user via the Supabase Auth REST endpoint.
# This step uses the service‑role key (same token above) and requires curl.
# Uncomment the block below if you want the script to create the user automatically.
# -----------------------------------------------------------------
<# 
$ownerEmail    = "watasha620@gmail.com"
$ownerPassword = "hu$tlehard"

curl -X POST "https://$Env:SUPABASE_PROJECT_REF.supabase.co/auth/v1/signup" `
     -H "apikey: $Env:SUPABASE_ACCESS_TOKEN" `
     -H "Content-Type: application/json" `
     -d "{ `"email`": `"$ownerEmail`", `"password`": `"$ownerPassword`" }"
#>

Write-Host "`nSupabase hardening complete. Verify the owner can sign in and that public sign‑ups are disabled in the dashboard."