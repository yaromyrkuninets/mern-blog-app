export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-8 items-center">
        <div className="w-full">
          <img
            src="https://odessa-journal.com/public/storage/uploads/news/21043/21043.jpg"
            alt="Military tech illustration"
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl font-semibold text-[#4B5320] dark:text-gray-100 mb-6">
            About Mil Blog
          </h1>
          <div className="text-base text-gray-600 dark:text-gray-300 flex flex-col gap-6 leading-relaxed">
            <p>
              <span className="font-medium text-[#4B5320]">Mil Blog</span> is a
              digital space where military thinking meets modern technology. It
              explores the connection between software, defense, and real-world
              resilience.
            </p>
            <p>
              The blog covers a range of topics — from full-stack web
              development to how modern technologies are applied in military
              contexts, infrastructure, and tactical scenarios.
            </p>
            <p>
              Whether you're a developer, strategist, or someone passionate
              about defense innovation — you're welcome here. Engage with the
              content, share your thoughts, and be part of a mission-driven
              community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
