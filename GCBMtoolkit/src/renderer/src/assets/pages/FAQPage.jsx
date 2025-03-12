import React from 'react';

function FAQPage() {
  return (
    <div className="flex flex-col p-4">
      <div className="hero bg-gradient-to-r rounded-lg from-green-400 via-blue-500 to-purple-600 text-white py-12">
        <h1 className="text-3xl font-bold text-center">Frequently Asked Questions (FAQ)</h1>
        <p className="text-center text-lg mt-4">Find answers to the most common questions about the GCBM tool.</p>
      </div>

      <div className="mt-4 h-[calc(100vh-260px)] overflow-y-auto space-y-3">
        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold">What is GCBM?</h3>
          <p className="text-sm">
            GCBM (Generic Carbon Budget Model) is a tool designed to help forest managers assess and manage forest
            carbon stocks and fluxes.
          </p>
        </div>

        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold">How do I get started with GCBM?</h3>
          <p className="text-sm">
            Visit the "Carbon Models" section to start your simulation. You can also check out the installation guide in
            the "Useful Resources" section.
          </p>
        </div>

        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold">How do I install GCBM?</h3>
          <p className="text-sm">
            You can find detailed installation instructions in the "GCBM Installation Guide" PDF in the "Useful Resources"
            section.
          </p>
        </div>

        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Can I customize the model?</h3>
          <p className="text-sm">
            Yes, the tool allows users to adjust parameters for specific forest management activities. Check the user
            manual for more info.
          </p>
        </div>

        <div className="bg-white shadow-lg p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Where can I find support for GCBM?</h3>
          <p className="text-sm">
            For support, visit the "Resources" section or use our support form on the website. We're happy to assist!
          </p>
        </div>

        {/* Additional FAQ items can be added here */}
      </div>
    </div>
  );
}

export default FAQPage;
