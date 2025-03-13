
export function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="max-w-lg">
        <p className="mb-4">
          Get in touch with our support team:
        </p>
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Email</h2>
            <p>support@fts.com</p>
          </div>
          <div>
            <h2 className="font-semibold">Phone</h2>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}