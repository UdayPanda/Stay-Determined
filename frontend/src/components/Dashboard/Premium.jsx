import { useEffect } from "react";
import logo from "../../assets/Stay-determined-logo.png";

const Premium = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    const options = {
      key: "rzp_test_RGPPNLJuZdODGi",
      amount: 49900,
      currency: "INR",
      name: "VitaminM Premium",
      description: "Unlock Premium Features",
      image: logo,
      handler: function (response) {
        alert(
          `Payment Successful! Payment ID: ${response.razorpay_payment_id}`
        );
      },
      prefill: {
        name: "Uday Panda",
        email: "panda.webdeveloper@gmail.com",
        contact: "9752928289",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
          Premium Features
        </h1>
        <p className="text-slate-400 text-md lg:text-lg max-w-2xl mx-auto">
          Unlock exclusive features and enhance your productivity with our
          premium plan.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
        {/* Productivity Boost */}
        <div className="bg-white/10 p-6 rounded-xl border border-slate-700/50 shadow-lg hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold text-white mb-2">
            Productivity Boost
          </h3>
          <p className="text-slate-400 text-sm">
            Advanced time management tools to help you prioritize, focus, and
            achieve more every day.
          </p>
        </div>

        {/* Smart Analytics */}
        <div className="bg-white/10 p-6 rounded-xl border border-slate-700/50 shadow-lg hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold text-white mb-2">
            Smart Analytics
          </h3>
          <p className="text-slate-400 text-sm">
            Gain insights into your tasks, deadlines, and productivity trends
            with detailed reports.
          </p>
        </div>

        {/* Goal Tracking */}
        <div className="bg-white/10 p-6 rounded-xl border border-slate-700/50 shadow-lg hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold text-white mb-2">
            Goal Tracking
          </h3>
          <p className="text-slate-400 text-sm">
            Set personal or professional goals and monitor progress with
            real-time updates.
          </p>
        </div>

        {/* Team Collaboration */}
        <div className="bg-white/10 p-6 rounded-xl border border-slate-700/50 shadow-lg hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold text-white mb-2">
            Team Collaboration
          </h3>
          <p className="text-slate-400 text-sm">
            Share tasks, deadlines, and reports with your team for improved
            collaboration.
          </p>
        </div>

        {/* Integrations */}
        <div className="bg-white/10 p-6 rounded-xl border border-slate-700/50 shadow-lg hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold text-white mb-2">
            Seamless Integrations
          </h3>
          <p className="text-slate-400 text-sm">
            Connect with your favorite tools (Google Calendar, Slack, etc.) for
            a smooth workflow.
          </p>
        </div>

        {/* Custom Reminders */}
        <div className="bg-white/10 p-6 rounded-xl border border-slate-700/50 shadow-lg hover:shadow-2xl transition">
          <h3 className="text-lg font-semibold text-white mb-2">
            Custom Reminders
          </h3>
          <p className="text-slate-400 text-sm">
            Never miss an important task with personalized reminders and smart
            notifications.
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white mb-8 px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all"
      >
        Upgrade Now
      </button>

    {/* Pricing Section */}
    <div className="w-full max-w-4xl mx-auto text-center">
      <h2 className="text-2xl lg:text-4xl font-bold text-white mb-6">
        Simple & Transparent Pricing
      </h2>
      <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
        Get access to all premium features for just{" "}
        <span className="text-white font-semibold">₹499/year</span>.  
        That’s less than ₹42/month – one coffee for an entire month of productivity 🚀
      </p>

      <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 p-8 rounded-2xl shadow-2xl border border-slate-700/50 hover:scale-105 transition-transform">
        <h3 className="text-3xl font-bold text-white mb-4">₹499/year</h3>
        <p className="text-slate-200 mb-6">
          One affordable plan. Unlimited possibilities.
        </p>

        <ul className="text-slate-100 text-left max-w-md mx-auto space-y-3 mb-8">
          <li className="flex items-center gap-3">
            ✅ All Premium Features unlocked
          </li>
          <li className="flex items-center gap-3">
            ✅ Unlimited Tasks & Goal Tracking
          </li>
          <li className="flex items-center gap-3">
            ✅ Smart Analytics & Productivity Reports
          </li>
          <li className="flex items-center gap-3">
            ✅ Team Collaboration tools
          </li>
          <li className="flex items-center gap-3">
            ✅ Priority Customer Support
          </li>
          <li className="flex items-center gap-3">
            🎁 Free updates & new feature rollouts
          </li>
        </ul>

        <button
          onClick={handlePayment}
          className="bg-yellow-400 text-black px-10 py-4 rounded-lg font-semibold shadow-xl hover:bg-yellow-500 transition-all text-lg"
        >
          Start Annual Plan – ₹499
        </button>

        <p className="text-slate-300 text-sm mt-4 italic">
          💡 Limited-time offer – Lock this price today!
        </p>
      </div>
    </div>

    </div>
  );
};

export default Premium;
