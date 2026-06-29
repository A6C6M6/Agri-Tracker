/* assets/js/settings-person-master.js
   Data-layer: Supabase CRUD & realtime for 'persons' table
   Assumes global `supabase` is available from assets/js/supabase-config.js
*/

const PM_TABLE = 'persons';

const PersonService = {
  async fetchAll() {
    const { data, error } = await supabase
      .from(PM_TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async create(person) {
    // person: { full_name, mobile, email, person_type, status }
    const { data, error } = await supabase
      .from(PM_TABLE)
      .insert([{ ...person }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, person) {
    const { data, error } = await supabase
      .from(PM_TABLE)
      .update({ ...person, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase
      .from(PM_TABLE)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async findDuplicate({ email, mobile }, ignoreId = null) {
    // check by email or mobile (if present). ignoreId used during update.
    let query = supabase.from(PM_TABLE).select('id, email, mobile');
    const filters = [];
    if (email) filters.push(`email.eq.${encodeURIComponent(email)}`);
    if (mobile) filters.push(`mobile.eq.${encodeURIComponent(mobile)}`);
    if (filters.length === 0) return null;

    // use or query
    const { data, error } = await supabase
      .from(PM_TABLE)
      .select('id, email, mobile')
      .or(filters.map(f => f.split('.').slice(0,2).join('.')).join(','));
    // The above .or(...) syntax uses supabase filter string; however to be robust do client-side filter:
    if (error) throw error;
    if (!data) return null;
    const dup = data.find(r => {
      if (ignoreId && r.id === ignoreId) return false;
      if (email && r.email && r.email.toLowerCase() === (email||'').toLowerCase()) return true;
      if (mobile && r.mobile && r.mobile === mobile) return true;
      return false;
    });
    return dup || null;
  },

  subscribe(onChange) {
    // Realtime subscription: INSERT, UPDATE, DELETE
    const channel = supabase
      .channel('public:persons')
      .on('postgres_changes', { event: '*', schema: 'public', table: PM_TABLE }, payload => {
        // payload: { eventType: 'INSERT'|'UPDATE'|'DELETE', new: {...}, old: {...} }
        onChange && onChange(payload);
      })
      .subscribe();
    return channel;
  },

  unsubscribe(channel) {
    if (!channel) return;
    supabase.removeChannel(channel);
  }
};
