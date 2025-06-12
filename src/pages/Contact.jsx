import { Mail, MessageSquareHeart } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-10">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold flex items-center gap-2">
          <Mail className="text-orange-500" /> Contact Us
        </h1>

        <p className="text-gray-700 text-lg">
          Interested in building your own store? Have questions, feedback, or a feature
          request?
        </p>

        <p className="text-gray-700">
          We're here to help. Send a message and let us know what you're looking for.
        </p>

        <div className="mt-6 p-4 rounded-xl bg-gray-100 shadow-sm flex items-start gap-3">
          <MessageSquareHeart className="text-rose-500 mt-1" />
          <p className="text-gray-600 text-sm">
            Bonus: if you like this layout, you can have something just like it — or
            better. 😉
          </p>
        </div>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea
            placeholder="What are you looking for?"
            rows={5}
            className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-white font-semibold rounded px-4 py-2 hover:bg-orange-600 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
