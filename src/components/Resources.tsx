'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, BookOpen, HelpCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';


interface FAQ {
  id: string | number;
  question: string;
  answer: string;
  created_at?: string;
}

interface BlogPost {
  id: string | number;
  title: string;
  summary: string;
  is_published: boolean;
  created_at?: string;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 px-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-gray-600 leading-relaxed">{answer}</div>
      )}
    </div>
  );
}

export default function Resources() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ Fetch FAQs
        const { data: faqData, error: faqError } = await supabase
          .from('faqs')
          .select('id, question, answer')
          .order('id', { ascending: true });

        if (faqError) console.error('FAQ fetch error:', faqError);
        else setFaqs(faqData || []);

        // ✅ Fetch Blog Posts (only published)
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('id, title, summary, is_published, created_at')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (postError) console.error('Blog fetch error:', postError);
        else setArticles(postData || []);
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <section className="py-20 text-center text-gray-600">
        Loading patient resources...
      </section>
    );

  return (
    <section id="resources" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Patient Resources
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Educational materials and answers to common questions
          </p>
        </div>

        {/* Articles */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm">{article.summary}</p>
            </div>
          ))}

          {articles.length === 0 && (
            <p className="col-span-3 text-center text-gray-500">
              No published blog posts yet.
            </p>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 p-2 rounded-lg">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {faqs.map((faq) => (
              <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
            ))}

            {faqs.length === 0 && (
              <p className="p-6 text-gray-500 text-center">
                No FAQs available yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
