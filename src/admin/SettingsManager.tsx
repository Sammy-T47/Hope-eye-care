'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface ClinicInfo {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<ClinicInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  // 🧩 Fetch all settings
  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clinic_info')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching settings:', error);
    } else {
      setSettings(data || []);
    }
    setLoading(false);
  };

  // 🧠 Update an existing record
  const handleUpdate = async (id: string, value: string) => {
    setSaving(true);
    const { error } = await supabase
      .from('clinic_info')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      alert('Error updating setting: ' + error.message);
    } else {
      fetchSettings();
    }
    setSaving(false);
  };

  // ➕ Add new setting
  const handleAdd = async () => {
    if (!newKey.trim() || !newValue.trim()) {
      alert('Please enter both key and value');
      return;
    }

    const { error } = await supabase.from('clinic_info').insert([
      {
        key: newKey.trim(),
        value: newValue.trim(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      alert('Error adding setting: ' + error.message);
    } else {
      setNewKey('');
      setNewValue('');
      fetchSettings();
    }
  };

  // ❌ Delete a setting
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;
    const { error } = await supabase.from('clinic_info').delete().eq('id', id);
    if (error) alert('Error deleting: ' + error.message);
    else fetchSettings();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clinic Settings</h1>
      <p className="text-gray-600 mb-6">
        Manage clinic information such as phone, email, address, and hours.
      </p>

      {loading ? (
        <p className="text-gray-500">Loading settings...</p>
      ) : (
        <div className="space-y-4">
          {settings.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border p-3 rounded-md bg-white shadow-sm"
            >
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  {item.key}
                </label>
                <Input
                  value={item.value}
                  onChange={(e) =>
                    setSettings((prev) =>
                      prev.map((s) =>
                        s.id === item.id ? { ...s, value: e.target.value } : s
                      )
                    )
                  }
                  className="w-full"
                />
              </div>

              <Button
                onClick={() => handleUpdate(item.id, item.value)}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>

              <Button
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          ))}

          {/* Add new setting */}
          <div className="border p-4 rounded-lg bg-blue-50 mt-6">
            <h2 className="text-lg font-semibold mb-3">Add New Setting</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Key (e.g. phone)"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value (e.g. +2348148753835)"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleAdd}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
