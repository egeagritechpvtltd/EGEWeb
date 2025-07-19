import { Link } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';

const Privacy = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <PageTitle title="Privacy Policy" />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: May 27, 2024</p>
        </div>

        <div className="prose max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information that you provide directly to us, such as when you create an account, subscribe to our
              newsletter, or contact us. The types of information we may collect include your name, email address, phone
              number, and any other information you choose to provide.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-2">We may use the information we collect for various purposes, including to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Send you newsletters, promotions, and other marketing communications</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not share your personal information with third parties except as described in this Privacy Policy or with
              your consent. We may share information with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Service providers who perform services on our behalf</li>
              <li>Law enforcement or other government officials, in response to a verified request</li>
              <li>Other parties in connection with a company transaction, such as a merger or sale</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized
              access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or
              electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Your Choices</h2>
            <p className="text-gray-600 mb-4">
              You may update, correct, or delete information about you at any time by contacting us at the email address
              below. You can opt out of receiving promotional emails from us by following the instructions in those emails.
              If you opt out, we may still send you non-promotional communications, such as those about your account or our
              ongoing business relations.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Changes to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time. If we make material changes, we will notify you by
              revising the date at the top of the policy and, in some cases, we may provide you with additional notice
              (such as adding a statement to our homepage or sending you a notification).
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@egeagritech.com" className="text-primary hover:underline">
                privacy@egeagritech.com
              </a>
              .
            </p>
            <div className="mt-6">
              <Link
                to="/terms"
                className="text-primary hover:underline inline-flex items-center"
              >
                View our Terms of Service
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

export default Privacy;
