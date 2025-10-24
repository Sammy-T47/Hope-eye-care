import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ServicesManager() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    icon_name: "",
    display_order: 0,
    is_active: true,
  });

  // 🔹 Fetch all services on load
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching services:", error);
      alert("Error fetching services: " + error.message);
    } else {
      setServices(data);
    }
    setLoading(false);
  };

  // 🔹 Add new service
  const addService = async () => {
    if (!newService.title) return alert("Please enter a service title.");

    const { error } = await supabase.from("services").insert([newService]);

    if (error) {
      alert("Error adding service: " + error.message);
    } else {
      setNewService({
        title: "",
        description: "",
        icon_name: "",
        display_order: 0,
        is_active: true,
      });
      fetchServices();
    }
  };

  // 🔹 Update service
  const updateService = async () => {
    if (!editingService) return;

    const { error } = await supabase
      .from("services")
      .update({
        title: editingService.title,
        description: editingService.description,
        icon_name: editingService.icon_name,
        display_order: editingService.display_order,
        is_active: editingService.is_active,
      })
      .eq("id", editingService.id);

    if (error) {
      alert("Error updating service: " + error.message);
    } else {
      setEditingService(null);
      fetchServices();
    }
  };

  // 🔹 Delete service
  const deleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      alert("Error deleting service: " + error.message);
    } else {
      fetchServices();
    }
  };

  if (loading) return <p>Loading services...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Services Manager</h1>

      {/* ➕ Add New Service */}
      <div className="p-4 border rounded mb-6 bg-gray-50">
        <h2 className="font-semibold mb-2">Add New Service</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={newService.title}
            onChange={(e) =>
              setNewService({ ...newService, title: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Icon Name"
            value={newService.icon_name}
            onChange={(e) =>
              setNewService({ ...newService, icon_name: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Display Order"
            value={newService.display_order}
            onChange={(e) =>
              setNewService({
                ...newService,
                display_order: Number(e.target.value),
              })
            }
            className="border p-2 rounded"
          />
          <select
            value={newService.is_active ? "true" : "false"}
            onChange={(e) =>
              setNewService({
                ...newService,
                is_active: e.target.value === "true",
              })
            }
            className="border p-2 rounded"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <textarea
            placeholder="Description"
            value={newService.description}
            onChange={(e) =>
              setNewService({ ...newService, description: e.target.value })
            }
            className="border p-2 rounded col-span-2"
          />
        </div>
        <button
          onClick={addService}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Service
        </button>
      </div>

      {/* 📋 Existing Services Table */}
      <h2 className="font-semibold mb-2">Existing Services</h2>
      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Icon</th>
              <th className="border p-2">Order</th>
              <th className="border p-2">Active</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.title}</td>
                <td className="border p-2">{s.description}</td>
                <td className="border p-2">{s.icon_name}</td>
                <td className="border p-2">{s.display_order}</td>
                <td className="border p-2">
                  {s.is_active ? "✅" : "❌"}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => setEditingService(s)}
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteService(s.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✏️ Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-[500px]">
            <h2 className="font-semibold mb-4">Edit Service</h2>
            <input
              type="text"
              value={editingService.title}
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  title: e.target.value,
                })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              value={editingService.icon_name}
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  icon_name: e.target.value,
                })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <textarea
              value={editingService.description}
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  description: e.target.value,
                })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="number"
              value={editingService.display_order}
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  display_order: Number(e.target.value),
                })
              }
              className="border p-2 rounded w-full mb-2"
            />
            <select
              value={editingService.is_active ? "true" : "false"}
              onChange={(e) =>
                setEditingService({
                  ...editingService,
                  is_active: e.target.value === "true",
                })
              }
              className="border p-2 rounded w-full mb-2"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingService(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={updateService}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
