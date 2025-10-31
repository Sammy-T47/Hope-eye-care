'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, BookOpen, HelpCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  content?: string;
  is_published: boolean;
  created_at?: string;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 px-7 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 pr-4 text-[17px] tracking-tight">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-7 pb-6 text-gray-600 leading-[1.7] text-[15px]">{answer}</div>
      )}
    </div>
  );
}

function ArticleModal({ article, onClose }: { article: BlogPost; onClose: () => void }) {
  const formatContent = (content: string) => {
    const processInlineFormatting = (text: string) => {
      const parts: (string | JSX.Element)[] = [];
      let lastIndex = 0;
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;

      while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="font-bold text-gray-900">
            {match[1]}
          </strong>
        );
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      return parts.length > 0 ? parts : text;
    };

    return content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null;

      // H1 headers (# Header)
      if (paragraph.startsWith('# ')) {
        const text = paragraph.slice(2);
        return (
          <h1 key={index} className="text-3xl font-bold text-gray-900 mt-10 mb-5 tracking-tight border-b-2 border-blue-600 pb-3">
            {text}
          </h1>
        );
      }

      // H2 headers (## Header)
      if (paragraph.startsWith('## ')) {
        const text = paragraph.slice(3);
        return (
          <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4 tracking-tight">
            {text}
          </h2>
        );
      }

      // H3 headers (### Header or **Header** on its own line)
      if (paragraph.startsWith('### ') || (paragraph.startsWith('**') && paragraph.endsWith('**') && paragraph.length < 100)) {
        const text = paragraph.startsWith('###') ? paragraph.slice(4) : paragraph.slice(2, -2);
        return (
          <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3 tracking-tight">
            {text}
          </h3>
        );
      }

      // Bullet points
      if (paragraph.startsWith('• ') || paragraph.startsWith('- ')) {
        const text = paragraph.slice(2).trim();
        return (
          <li key={index} className="ml-6 mb-2 text-gray-700 leading-[1.8] text-[16px] list-disc">
            {processInlineFormatting(text)}
          </li>
        );
      }

      // Numbered lists
      if (paragraph.match(/^\d+\.\s/)) {
        return (
          <li key={index} className="ml-6 mb-2 text-gray-700 leading-[1.8] text-[16px] list-decimal">
            {processInlineFormatting(paragraph.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }

      // Regular paragraphs with inline formatting
      return (
        <p key={index} className="mb-4 text-gray-700 leading-[1.8] text-[16px]">
          {processInlineFormatting(paragraph)}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 relative">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-7 rounded-t-2xl flex justify-between items-start">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90 tracking-wide">Patient Resource</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">{article.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {article.content ? (
            <div className="prose prose-lg max-w-none">
              {formatContent(article.content)}
            </div>
          ) : (
            <p className="text-gray-600 text-[15px]">Content not available.</p>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 p-7 rounded-b-2xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors tracking-wide"
          >
            Close Article
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Resources() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [loadingArticle, setLoadingArticle] = useState(false);

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
          .select('id, title, summary, content, is_published, created_at')
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

  const handleArticleClick = async (article: BlogPost) => {
    if (article.content) {
      setSelectedArticle(article);
    } else {
      setLoadingArticle(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('content')
          .eq('id', article.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching article content:', error);
        } else if (data) {
          const fullArticle = { ...article, content: data.content };
          setSelectedArticle(fullArticle);
        }
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoadingArticle(false);
      }
    }
  };

  if (loading)
    return (
      <section className="py-20 text-center text-gray-600 text-[15px]">
        Loading patient resources...
      </section>
    );

  return (
    <section id="resources" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-5 tracking-tight">
            Patient Resources
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 italic" style={{ fontFamily: "'Lora', serif" }}>
            Educational materials and answers to common questions
          </p>
        </div>

        {/* Articles */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {articles.map((article) => (
            <button
              key={article.id}
              onClick={() => handleArticleClick(article)}
              disabled={loadingArticle}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 p-7 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[19px] font-semibold text-gray-900 mb-3 tracking-tight">
                {article.title}
              </h3>
              <p className="text-gray-600 text-[15px] leading-[1.6] mb-4 font-light">{article.summary}</p>
              <span className="text-blue-600 font-medium text-sm tracking-wide">Read More →</span>
            </button>
          ))}

          {articles.length === 0 && (
            <p className="col-span-3 text-center text-gray-500 text-[15px]">
              No published blog posts yet.
            </p>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-7">
            <div className="bg-blue-600 p-2 rounded-lg">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {faqs.map((faq) => (
              <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
            ))}

            {faqs.length === 0 && (
              <p className="p-6 text-gray-500 text-center text-[15px]">
                No FAQs available yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </section>
  );
}
