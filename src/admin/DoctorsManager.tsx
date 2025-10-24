'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

interface Doctor {
  id: number;
  name: string;
  title: string;
  qualification: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function DoctorsManager() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    title: '',
    qualification: '',
    description: '',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch all doctors
  async function fetchDoctors() {
    setLoading(true);
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) console.error('Error fetching doctors:', error);
    else setDoctors(data || []);
    setLoading(false);
  }

  // Add a new doctor
  async function addDoctor() {
    const { error } = await supabase.from('doctors').insert([newDoctor]);
    if (error) console.error('Error adding doctor:', error);
    else {
      setNewDoctor({
        name: '',
        title: '',
        qualification: '',
        description: '',
        display_order: 0,
        is_active: true,
      });
      fetchDoctors();
    }
  }

  // Update an existing doctor
  async function updateDoctor() {
    if (!editingDoctor) return;
    const { error } = await supabase
      .from('doctors')
      .update({
        name: editingDoctor.name,
        title: editingDoctor.title,
        qualification: editingDoctor.qualification,
        description: editingDoctor.description,
        display_order: editingDoctor.display_order,
        is_active: editingDoctor.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingDoctor.id);

    if (error) console.error('Error updating doctor:', error);
    else {
      setEditingDoctor(null);
      fetchDoctors();
    }
  }

  // Delete doctor
  async function deleteDoctor(id: number) {
    const { error } = await supabase.from('doctors').delete().eq('id', id);
    if (error) console.error('Error deleting doctor:', error);
    else fetchDoctors();
  }

  // Reorder doctors (move up or down)
  async function reorderDoctor(id: number, direction: 'up' | 'down') {
    const index = doctors.findIndex((d) => d.id === id);
    if (index === -1) return;

    const newOrder = [...doctors];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index].display_order;
    newOrder[index].display_order = newOrder[targetIndex].display_order;
    newOrder[targetIndex].display_order = temp;

    await Promise.all(
      newOrder.map((doc) =>
        supabase.from('doctors').update({ display_order: doc.display_order }).eq('id', doc.id)
      )
    );

    fetchDoctors();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Doctors Manager</h1>
      <p className="text-gray-600 mb-6">Manage your medical team here.</p>

      {/* Add New Doctor */}
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-3">Add New Doctor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Name"
            value={newDoctor.name}
            onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
          />
          <Input
            placeholder="Title"
            value={newDoctor.title}
            onChange={(e) => setNewDoctor({ ...newDoctor, title: e.target.value })}
          />
          <Input
            placeholder="Qualification"
            value={newDoctor.qualification}
            onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={newDoctor.description}
            onChange={(e) => setNewDoctor({ ...newDoctor, description: e.target.value })}
          />
        </div>
        <Button onClick={addDoctor} className="mt-4">
          Add Doctor
        </Button>
      </div>

      {/* Doctors Table */}
      {loading ? (
        <p>Loading doctors...</p>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Title</th>
                <th className="p-3">Qualification</th>
                <th className="p-3">Description</th>
                <th className="p-3">Active</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="border-t">
                  <td className="p-3">{doctor.name}</td>
                  <td className="p-3">{doctor.title}</td>
                  <td className="p-3">{doctor.qualification}</td>
                  <td className="p-3">{doctor.description}</td>
                  <td className="p-3">
                    {doctor.is_active ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <Button size="sm" onClick={() => setEditingDoctor(doctor)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteDoctor(doctor.id)}>
                      Delete
                    </Button>
                    <Button size="sm" onClick={() => reorderDoctor(doctor.id, 'up')}>
                      ↑
                    </Button>
                    <Button size="sm" onClick={() => reorderDoctor(doctor.id, 'down')}>
                      ↓
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-3">Edit Doctor</h2>
            <Input
              placeholder="Name"
              value={editingDoctor.name}
              onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
            />
            <Input
              placeholder="Title"
              className="mt-2"
              value={editingDoctor.title}
              onChange={(e) => setEditingDoctor({ ...editingDoctor, title: e.target.value })}
            />
            <Input
              placeholder="Qualification"
              className="mt-2"
              value={editingDoctor.qualification}
              onChange={(e) => setEditingDoctor({ ...editingDoctor, qualification: e.target.value })}
            />
            <Input
              placeholder="Description"
              className="mt-2"
              value={editingDoctor.description}
              onChange={(e) => setEditingDoctor({ ...editingDoctor, description: e.target.value })}
            />
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={editingDoctor.is_active}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, is_active: e.target.checked })}
              />
              <label>Active</label>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setEditingDoctor(null)}>
                Cancel
              </Button>
              <Button onClick={updateDoctor}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
