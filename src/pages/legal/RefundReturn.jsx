import { Link } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';

const RefundReturn = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <PageTitle title="Refund & Return Policy" />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund & Return Policy</h1>
          <p className="text-lg text-gray-600">Last updated: August 1, 2025</p>
        </div>

        <div className="prose max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Returns</h2>
            <p className="text-gray-600 mb-4">
              We want you to be completely satisfied with your purchase. If you're not satisfied with your order, you may return most items within 7 days of delivery for a full refund or exchange.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Eligibility for Returns</h2>
            <p className="text-gray-600 mb-2">To be eligible for a return, your item must be:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Unused and in the same condition as you received it</li>
              <li>In its original packaging with all tags attached</li>
              <li>Accompanied by the original receipt or proof of purchase</li>
            </ul>
            <p className="text-gray-600">
              Perishable goods, personalized items, and items marked as final sale are not eligible for return.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How to Initiate a Return</h2>
            <p className="text-gray-600 mb-2">To initiate a return, please follow these steps:</p>
            <ol className="list-decimal pl-6 text-gray-600 space-y-2 mb-4">
              <li>Contact our customer support at <a href="mailto:returns@egeorganic.com" className="text-green-600 hover:underline">returns@egeorganic.com</a> within 7 days of receiving your order</li>
              <li>Provide your order number and reason for return</li>
              <li>Our team will provide you with return instructions and a return authorization number</li>
              <li>Package the item securely with the original packaging and include all original contents</li>
              <li>Ship the package to the provided return address</li>
            </ol>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Refund Process</h2>
            <p className="text-gray-600 mb-2">Once we receive your return, we will:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Inspect the returned item(s)</li>
              <li>Process the refund to your original payment method</li>
              <li>Send you a confirmation email once the refund has been processed</li>
            </ul>
            <p className="text-gray-600">
              Please allow 5-7 business days for the refund to appear in your account after we process it.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Return Shipping</h2>
            <p className="text-gray-600 mb-4">
              Customers are responsible for return shipping costs unless the return is due to our error (e.g., wrong item shipped, defective product). We recommend using a trackable shipping service and purchasing shipping insurance.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Damaged or Defective Items</h2>
            <p className="text-gray-600 mb-4">
              If you receive a damaged or defective item, please contact us immediately at <a href="mailto:support@egeorganic.com" className="text-green-600 hover:underline">support@egeorganic.com</a> with photos of the damaged product and packaging. We will arrange for a replacement or refund at no additional cost to you.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Exchanges</h2>
            <p className="text-gray-600 mb-4">
              We currently do not offer direct exchanges. If you need a different item, please return the original item for a refund and place a new order for the item you want.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600">
              If you have any questions about our refund and return policy, please contact us at{' '}
              <a href="mailto:support@egeorganic.com" className="text-green-600 hover:underline">
                    egeagritechpvtltd@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundReturn;
