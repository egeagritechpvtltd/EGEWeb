import { Link } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';

const Terms = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <PageTitle title="Terms of Service" />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">Last updated: May 27, 2024</p>
        </div>

        <div className="prose max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              Welcome to EGE Agritech. These Terms of Service ("Terms") govern your access to and use of our website
              and services (collectively, the "Service").
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Use of Our Service</h2>
            <p className="text-gray-600 mb-4">
              You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>In any way that violates any applicable law or regulation</li>
              <li>To transmit any advertising or promotional material without our prior written consent</li>
              <li>To impersonate or attempt to impersonate EGE Agritech or any other person or entity</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of
              EGE Agritech and its licensors. Our trademarks and trade dress may not be used in connection with any product
              or service without the prior written consent of EGE Agritech.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              In no event shall EGE Agritech, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable
              for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of
              profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability
              to access or use the Service.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Changes to Terms</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to modify these Terms at any time. We will provide notice of any changes by updating the
              "Last updated" date at the top of these Terms. Your continued use of the Service after any such changes
              constitutes your acceptance of the new Terms.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:info@egeagritech.com" className="text-primary hover:underline">
                info@egeagritech.com
              </a>
              .
            </p>
            <div className="mt-6">
              <Link
                to="/privacy"
                className="text-primary hover:underline inline-flex items-center"
              >
                View our Privacy Policy
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
