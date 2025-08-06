'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import '../../styles/swagger-themes.css';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle';
import { suppressSwaggerWarnings } from '../../utils/suppressWarnings';

function ApiDocsContent() {
  const { theme } = useTheme();
  const [spec, setSpec] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Suppress React warnings from swagger-ui-react
  useEffect(() => {
    const cleanup = suppressSwaggerWarnings();
    return cleanup;
  }, []);

  useEffect(() => {
    const loadSpec = async () => {
      try {
        const response = await fetch('/api-docs/openapi.yaml');
        if (!response.ok) {
          throw new Error('Failed to load API specification');
        }
        
        // Use the spec URL directly
        setSpec('/api-docs/openapi.yaml');
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoading(false);
      }
    };

    loadSpec();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Documentation</h1>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' 
      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
      : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Header */}
      <div className={`${theme === 'dark' 
        ? 'bg-slate-800 border-b border-slate-700' 
        : 'bg-white border-b border-gray-200 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Negravis Oracle API
              </h1>
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Interactive API Documentation
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  API Status: Online
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Link
                  href="/"
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to App</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swagger UI Container */}
      <div className="api-docs-container">
        {spec && (
          <SwaggerUI
            url={spec}
            docExpansion="list"
            defaultModelsExpandDepth={1}
            defaultModelExpandDepth={1}
            displayOperationId={true}
            displayRequestDuration={true}
            filter={true}
            showExtensions={true}
            showCommonExtensions={true}
            tryItOutEnabled={true}
            onComplete={() => {
              console.log('Swagger UI loaded successfully');
            }}
            supportedSubmitMethods={['get', 'post', 'put', 'delete', 'patch']}
          />
        )}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .api-docs-container {
          padding: 0;
          background: ${theme === 'dark' ? '#0f172a' : '#fafafa'};
          min-height: calc(100vh - 100px);
        }

        /* Swagger UI Dark Theme Customization */
        .swagger-ui {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .swagger-ui .topbar {
          display: none;
        }

        .swagger-ui .scheme-container {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 16px;
          margin: 20px;
        }

        .swagger-ui .info {
          margin: 20px;
          padding: 20px;
          background: #1e293b;
          border-radius: 8px;
          border: 1px solid #334155;
        }

        .swagger-ui .info .title {
          color: #f8fafc;
          font-size: 2rem;
          font-weight: 700;
        }

        .swagger-ui .info .description {
          color: #cbd5e1;
          line-height: 1.6;
        }

        .swagger-ui .info .description h2 {
          color: #f8fafc;
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
        }

        .swagger-ui .opblock-tag {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 8px;
          margin: 10px 20px;
        }

        .swagger-ui .opblock-tag-section h3 {
          color: #f8fafc;
          font-weight: 600;
        }

        .swagger-ui .opblock {
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 8px;
          margin: 10px 0;
        }

        .swagger-ui .opblock.opblock-post {
          border-left: 4px solid #10b981;
        }

        .swagger-ui .opblock.opblock-get {
          border-left: 4px solid #3b82f6;
        }

        .swagger-ui .opblock-summary {
          background: #1e293b;
          border-bottom: 1px solid #334155;
        }

        .swagger-ui .opblock-summary-path {
          color: #60a5fa;
          font-weight: 600;
        }

        .swagger-ui .opblock-summary-description {
          color: #cbd5e1;
        }

        .swagger-ui .opblock-description-wrapper {
          background: #0f172a;
          color: #cbd5e1;
          padding: 16px;
        }

        .swagger-ui .parameters-container {
          background: #0f172a;
          padding: 16px;
        }

        .swagger-ui .parameter__name {
          color: #f8fafc;
          font-weight: 600;
        }

        .swagger-ui .parameter__type {
          color: #a78bfa;
        }

        .swagger-ui .parameter__description {
          color: #cbd5e1;
        }

        .swagger-ui .responses-wrapper {
          background: #0f172a;
          padding: 16px;
        }

        .swagger-ui .response-col_status {
          color: #f8fafc;
          font-weight: 600;
        }

        .swagger-ui .response-col_description {
          color: #cbd5e1;
        }

        .swagger-ui .btn {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          font-weight: 500;
          transition: background 0.2s;
        }

        .swagger-ui .btn:hover {
          background: #2563eb;
        }

        .swagger-ui .btn.try-out__btn {
          background: #10b981;
        }

        .swagger-ui .btn.try-out__btn:hover {
          background: #059669;
        }

        .swagger-ui .btn.execute {
          background: #dc2626;
        }

        .swagger-ui .btn.execute:hover {
          background: #b91c1c;
        }

        .swagger-ui input, .swagger-ui textarea, .swagger-ui select {
          background: #1e293b;
          color: #f8fafc;
          border: 1px solid #334155;
          border-radius: 6px;
        }

        .swagger-ui input:focus, .swagger-ui textarea:focus, .swagger-ui select:focus {
          border-color: #3b82f6;
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .swagger-ui .highlight-code {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 6px;
        }

        .swagger-ui pre {
          background: #1e293b;
          color: #f8fafc;
          border: 1px solid #334155;
          border-radius: 6px;
        }

        .swagger-ui .model-box {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 6px;
        }

        .swagger-ui .model .property {
          color: #cbd5e1;
        }

        .swagger-ui .model .property-type {
          color: #a78bfa;
        }

        /* Filter Input */
        .swagger-ui .filter-container input {
          background: #1e293b;
          color: #f8fafc;
          border: 1px solid #334155;
          border-radius: 6px;
          padding: 8px 12px;
        }

        /* Scrollbar */
        .swagger-ui ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .swagger-ui ::-webkit-scrollbar-track {
          background: #1e293b;
        }

        .swagger-ui ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }

        .swagger-ui ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}

export default function ApiDocsPage() {
  return (
    <ThemeProvider>
      <ApiDocsContent />
    </ThemeProvider>
  );
}