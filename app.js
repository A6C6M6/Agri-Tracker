// Replace with your Supabase Project URL and Anon Key
const SUPABASE_URL = "https://icdppzjhqpskmtertrbv.supabase.co";
const SUPABASE_ANON_KEY = "eeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZHBwempocXBza210ZXJ0cmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNzM1NzQsImV4cCI6MjA5Njg0OTU3NH0.BLfuw0HOZO6hT3C4Xm0tdi_W4fE-_quJhYvqE6Yhl2I";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  alert(error ? error.message : "Signup successful!");
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  alert(error ? error.message : "Login successful!");
}
