// ============================================
// Supabase Configuration
// ============================================
// غيّر هذه القيم من Supabase Dashboard

const SUPABASE_URL = 'https://kpvrwjopkbufxfwyyqem.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdnJ3am9wa2J1Znhmd3l5cWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMTcwMzEsImV4cCI6MjEwNDY5MzAzMX0.8-Rw_1fZsPlbFsuYNQ6wEsKqPRyYpwviiUUoYDogFVQ';
const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdnJ3am9wa2J1Znhmd3l5cWVtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTExNzAzMSwiZXhwIjoyMTA0NjkzMDMxfQ.9YLl3ZNHcC4t2j06c3G246Bo2M0TBSzX8Dd_1Xn1NU4';

// ============================================
// Supabase Client (بدون مكتبة خارجية)
// ============================================

class SupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
    this.headers = {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  // ===== SELECT =====
  async select(table, options = {}) {
    let query = `${this.url}/rest/v1/${table}?select=*`;
    
    if (options.where) {
      const conditions = Object.entries(options.where)
        .map(([key, value]) => `${key}=eq.${encodeURIComponent(value)}`)
        .join('&');
      query += `&${conditions}`;
    }
    
    if (options.order) {
      query += `&order=${options.order.column}.${options.order.ascending ? 'asc' : 'desc'}`;
    }
    
    if (options.limit) {
      query += `&limit=${options.limit}`;
    }

    const response = await fetch(query, { headers: this.headers });
    if (!response.ok) throw new Error(`Supabase error: ${response.status}`);
    return response.json();
  }

  // ===== INSERT =====
  async insert(table, data) {
    const response = await fetch(`${this.url}/rest/v1/${table}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Supabase error: ${response.status}`);
    return response.json();
  }

  // ===== UPDATE =====
  async update(table, data, where) {
    let query = `${this.url}/rest/v1/${table}`;
    
    if (where) {
      const conditions = Object.entries(where)
        .map(([key, value]) => `${key}=eq.${encodeURIComponent(value)}`)
        .join('&');
      query += `?${conditions}`;
    }

    const response = await fetch(query, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Supabase error: ${response.status}`);
    return response.json();
  }

  // ===== DELETE =====
  async delete(table, where) {
    let query = `${this.url}/rest/v1/${table}`;
    
    if (where) {
      const conditions = Object.entries(where)
        .map(([key, value]) => `${key}=eq.${encodeURIComponent(value)}`)
        .join('&');
      query += `?${conditions}`;
    }

    const response = await fetch(query, {
      method: 'DELETE',
      headers: this.headers
    });
    if (!response.ok) throw new Error(`Supabase error: ${response.status}`);
    return true;
  }

  // ===== UPSERT =====
  async upsert(table, data) {
    const response = await fetch(`${this.url}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        ...this.headers,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Supabase error: ${response.status}`);
    return response.json();
  }
}

// Export instance
const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
