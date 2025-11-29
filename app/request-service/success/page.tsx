import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Request Submitted Successfully!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your service request. We have received your information
            and will contact you shortly to discuss the details.
          </p>
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>What happens next?</strong>
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>We&apos;ll review your request within 24 hours</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>You&apos;ll receive a confirmation email</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Our team will reach out to discuss next steps</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <Link
              href="/"
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all font-semibold"
            >
              Back to Home
            </Link>
            <Link
              href="/services"
              className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all font-semibold"
            >
              View All Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
