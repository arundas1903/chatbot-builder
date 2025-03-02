import React, { useState } from 'react';
import { ChartBarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

type Platform = 'CRM' | 'Ecommerce';
type SubPlatform = 'Zoho' | 'Salesforce' | 'Shopify' | 'Wordpress';

const Sidebar: React.FC = () => {
  const [selectedNav, setSelectedNav] = useState<'dashboard' | 'chatbot'>('dashboard');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [selectedSubPlatform, setSelectedSubPlatform] = useState<SubPlatform | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [chatbotName, setChatbotName] = useState('');

  const platforms: Record<Platform, SubPlatform[]> = {
    CRM: ['Zoho', 'Salesforce'],
    Ecommerce: ['Shopify', 'Wordpress']
  };

  return (
    <div className="w-64 bg-white shadow-sm h-full">
      <div className="p-4">
        <nav className="space-y-1">
          <button
            onClick={() => setSelectedNav('dashboard')}
            className={clsx(
              'flex items-center px-2 py-2 text-sm font-medium rounded-md w-full',
              selectedNav === 'dashboard'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <ChartBarIcon className="mr-3 h-6 w-6" />
            Dashboard
          </button>

          <button
            onClick={() => setSelectedNav('chatbot')}
            className={clsx(
              'flex items-center px-2 py-2 text-sm font-medium rounded-md w-full',
              selectedNav === 'chatbot'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <ChatBubbleLeftRightIcon className="mr-3 h-6 w-6" />
            Chatbot
          </button>
        </nav>

        {selectedNav === 'chatbot' && (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Chatbot Name</label>
              <input
                type="text"
                value={chatbotName}
                onChange={(e) => setChatbotName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter chatbot name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Category</label>
              <select
                value={selectedPlatform || ''}
                onChange={(e) => {
                  setSelectedPlatform(e.target.value as Platform);
                  setSelectedSubPlatform(null);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                <option value="CRM">CRM</option>
                <option value="Ecommerce">Ecommerce</option>
              </select>
            </div>

            {selectedPlatform && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Platform</label>
                <select
                  value={selectedSubPlatform || ''}
                  onChange={(e) => setSelectedSubPlatform(e.target.value as SubPlatform)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select a platform</option>
                  {platforms[selectedPlatform].map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedSubPlatform && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowConnectModal(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Connect to {selectedSubPlatform}
                </button>

                <button
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Publish Chatbot
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 