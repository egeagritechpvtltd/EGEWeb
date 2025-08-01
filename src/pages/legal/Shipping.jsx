import { Link } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';

const Shipping = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <PageTitle title="Shipping Policy" />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Policy</h1>
          <p className="text-lg text-gray-600">Last updated: August 1, 2025</p>
        </div>

        <div className="prose max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Shipping Areas</h2>
            <p className="text-gray-600 mb-4">
              We currently ship our products to all major cities and towns across India. We are continuously expanding our delivery network to serve more locations.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Delivery Timeframe</h2>
            <p className="text-gray-600 mb-2">Standard delivery times:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Metro cities: 2-4 business days</li>
              <li>Other major cities: 3-6 business days</li>
              <li>Tier 2 & 3 cities: 5-8 business days</li>
              <li>Remote areas: 7-10 business days</li>
            </ul>
            <p className="text-gray-600">
              Please note that these are estimated delivery times and actual delivery may vary due to factors beyond our control such as weather conditions, transportation delays, or other unforeseen circumstances.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Order Processing</h2>
            <p className="text-gray-600 mb-4">
              Orders are typically processed within 24-48 hours of order placement. You will receive an order confirmation email with tracking information once your order has been shipped.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Shipping Charges</h2>
            <p className="text-gray-600 mb-2">Shipping charges are calculated based on:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Delivery location</li>
              <li>Order weight and dimensions</li>
              <li>Delivery speed selected</li>
            </ul>
            <p className="text-gray-600">
              Free shipping may be available for orders above a certain value. Please check our website for current promotions.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Order Tracking</h2>
            <p className="text-gray-600 mb-4">
              Once your order has been shipped, you will receive a tracking number via email and SMS. You can use this tracking number to monitor your package's delivery status on our website or the courier partner's website.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Undeliverable Packages</h2>
            <p className="text-gray-600 mb-4">
              In case a package is returned to us due to an incorrect address, recipient not available, or refusal to accept delivery, we will contact you to arrange for reshipment. Additional shipping charges may apply for reshipping.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Damaged or Lost Packages</h2>
            <p className="text-gray-600 mb-4">
              If your package arrives damaged or is lost in transit, please contact our customer support team immediately. We will work with our shipping partners to resolve the issue as quickly as possible.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600">
              If you have any questions about our shipping policy, please contact us at{' '}
              <a href="mailto:egeagritechpvtltd@gmail.com" className="text-green-600 hover:underline">
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

export default Shipping;
