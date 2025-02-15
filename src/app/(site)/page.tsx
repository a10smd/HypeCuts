export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold">Welcome to HypeCuts</h1>
      <a
        href="/upload"
        className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Upload Video
      </a>
    </div>
  );
}
