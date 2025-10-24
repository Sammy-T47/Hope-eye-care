'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  PlusCircle,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Save,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function FAQsManager() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  // Fetch FAQs
  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) console.error('Fetch error:', error);
    else setFaqs(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Add FAQ
  const addFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim())
      return alert('Please enter both question and answer');

    const { error } = await supabase.from('faqs').insert([
      {
        question: newQuestion,
        answer: newAnswer,
        display_order: faqs.length + 1,
        is_active: true,
      },
    ]);

    if (error) console.error('Insert error:', error);
    setNewQuestion('');
    setNewAnswer('');
    fetchFaqs();
  };

  // Delete FAQ
  const deleteFaq = async (id: number) => {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) console.error('Delete error:', error);
    fetchFaqs();
  };

  // Start editing
  const startEditing = (faq: any) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  // Save edited FAQ
  const saveEdit = async (id: number) => {
    const { error } = await supabase
      .from('faqs')
      .update({
        question: editQuestion,
        answer: editAnswer,
        updated_at: new Date(),
      })
      .eq('id', id);

    if (error) console.error('Update error:', error);
    setEditingId(null);
    fetchFaqs();
  };

  // Toggle active/inactive
  const toggleActive = async (id: number, isActive: boolean) => {
    const { error } = await supabase
      .from('faqs')
      .update({ is_active: !isActive, updated_at: new Date() })
      .eq('id', id);

    if (error) console.error('Toggle error:', error);
    fetchFaqs();
  };

  // Move FAQ up/down (reorder)
  const moveFaq = async (index: number, direction: 'up' | 'down') => {
    const newFaqs = [...faqs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newFaqs.length) return;

    // Swap display_order
    const temp = newFaqs[index].display_order;
    newFaqs[index].display_order = newFaqs[targetIndex].display_order;
    newFaqs[targetIndex].display_order = temp;

    // Update DB
    await supabase
      .from('faqs')
      .update({ display_order: newFaqs[index].display_order })
      .eq('id', newFaqs[index].id);

    await supabase
      .from('faqs')
      .update({ display_order: newFaqs[targetIndex].display_order })
      .eq('id', newFaqs[targetIndex].id);

    fetchFaqs();
  };

  if (loading) return <p>Loading FAQs...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">FAQs Manager</h1>
      <p className="text-gray-600 mb-6">
        Add, edit, delete, activate/deactivate, and reorder FAQs displayed on your website.
      </p>

      {/* Add FAQ */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h2 className="font-semibold mb-2">Add New FAQ</h2>
        <input
          type="text"
          placeholder="Question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        />
        <textarea
          placeholder="Answer"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="border rounded p-2 w-full mb-2"
          rows={3}
        />
        <button
          onClick={addFaq}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Add FAQ
        </button>
      </div>

      {/* List FAQs */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className={`p-4 border rounded-lg bg-white shadow-sm flex flex-col ${
              faq.is_active ? '' : 'opacity-60'
            }`}
          >
            {editingId === faq.id ? (
              <>
                <input
                  type="text"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  className="border p-2 rounded mb-2"
                />
                <textarea
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  className="border p-2 rounded mb-2"
                  rows={3}
                />
                <button
                  onClick={() => saveEdit(faq.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 self-start"
                >
                  <Save className="w-4 h-4" /> Save
                </button>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveFaq(index, 'up')}
                      className="p-2 text-gray-600 hover:text-blue-600"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFaq(index, 'down')}
                      className="p-2 text-gray-600 hover:text-blue-600"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleActive(faq.id, faq.is_active)}
                      className="p-2 text-gray-600 hover:text-yellow-600"
                    >
                      {faq.is_active ? (
                        <ToggleRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => startEditing(faq)}
                      className="p-2 text-gray-600 hover:text-green-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteFaq(faq.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{faq.answer}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
