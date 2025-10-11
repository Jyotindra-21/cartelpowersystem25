import { IPolicySection } from "@/schemas/settingsSchema";
import { fetchPolicySection } from "@/services/settings.services";
import { IApiResponse } from "@/types/ApiResponse";
export const dynamic = 'force-dynamic';

export default async function TermsConditions() {
  const [policyRes] = await Promise.all([
    fetchPolicySection() as Promise<IApiResponse<IPolicySection>>,
  ]);
  const { data: policy } = policyRes;
  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dangerouslySetInnerHTML={{ __html: policy?.termsAndConditions || "" }} />
      {/* <div
        class="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div
          class="bg-gradient-to-r from-primary to-black/90 p-8 text-center"
        >
          <div class="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text text-white h-5 w-5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>

          </div>
          <h1 class="text-3xl font-bold text-white">Terms &amp; Conditions</h1>
          <p class="mt-2 text-blue-100">Effective Date: June 28, 2023</p>
        </div>

        <div
          class="p-8 md:p-10"
        >
          <section
            class="mb-8"
          >
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text text-blue-600 w-5 h-5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
              1. Introduction
            </h2>
            <p class="text-gray-600 leading-relaxed">
              Welcome to <strong>Cartel Power System</strong> {`("Company", "we", "us", or "our"). These Terms &amp; Conditions 
              govern your use of our website and the purchase of our ARD (Automatic Rescue Device) for lifts. 
              By accessing or using our services, you agree to be bound by these terms.`}
            </p>
          </section>

          <section
            class="mb-8"
          >
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pen-tool-icon lucide-pen-tool text-blue-600 w-5 h-5"><path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" /><path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" /><path d="m2.3 2.3 7.286 7.286" /><circle cx="11" cy="11" r="2" /></svg>
              2. Products & Services
            </h2>
            <ul class="list-disc pl-5 text-gray-600 space-y-2">
              <li>All ARD devices are manufactured to industry standards</li>
              <li>Product specifications may change without notice</li>
              <li>We reserve the right to limit quantities</li>
            </ul>
          </section>

          <section
            class="mb-8"
          >
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart-icon lucide-shopping-cart text-blue-600 w-5 h-5"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
              3. Ordering Process
            </h2>
            <div class="space-y-4">
              <p class="text-gray-600 leading-relaxed">
                All orders are subject to product availability. We may refuse any order for any reason.
              </p>
              <div class="bg-blue-50 p-4 rounded-lg">
                <h3 class="font-medium text-blue-700 mb-2">Pricing</h3>
                <p class="text-gray-600">
                  Prices are subject to change without notice. We are not responsible for typographical errors.
                </p>
              </div>
            </div>
          </section>

          <section
            class="mb-8"
          >
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-icon lucide-shield text-blue-600"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
              4. Warranty & Liability
            </h2>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-medium text-gray-700 mb-2">Limited Warranty</h3>
              <p class="text-gray-600 mb-3">
                Our products come with a 12-month limited warranty covering manufacturing defects.
              </p>
              <h3 class="font-medium text-gray-700 mb-2">Limitation of Liability</h3>
              <p class="text-gray-600">
                Cartel Power System shall not be liable for any indirect, incidental, or consequential damages.
              </p>
            </div>
          </section>

          <section
            class="mb-8"
          >
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text text-blue-600 h-5 w-5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
              5. Intellectual Property
            </h2>
            <p class="text-gray-600 leading-relaxed">
              All content on our website, including logos, designs, and product specifications, are our exclusive property.
            </p>
          </section>

          <section
            class="mb-8"
          >
            <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert text-blue-600 w-5 h-5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
              6. Governing Law
            </h2>
            <p class="text-gray-600 leading-relaxed">
              These terms shall be governed by the laws of [Your Country/State] without regard to conflict of law principles.
            </p>
          </section>

          <section
            class="mt-12 bg-gray-50 p-6 rounded-xl"
          >
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
            <div class="space-y-4">
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail-icon lucide-mail text-blue-600 mt-1 mr-3 flex-shrink-0 w-5 h-5"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
                <div>
                  <h3 class="font-medium text-gray-700">Email</h3>
                  <p class="text-gray-600">legal@cartelpowersystem.com</p>
                </div>
              </div>
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-icon lucide-phone text-blue-600 mt-1 mr-3 flex-shrink-0 w-5 h-5"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg>
                <div>
                  <h3 class="font-medium text-gray-700">Phone</h3>
                  <p class="text-gray-600">+1 (555) 987-6543</p>
                </div>
              </div>
              <div class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin text-blue-600 mt-1 mr-3 flex-shrink-0 w-5 h-5"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                <div>
                  <h3 class="font-medium text-gray-700">Address</h3>
                  <p class="text-gray-600">123 Industrial Park, Lift City, LC 12345</p>
                </div>
              </div>
            </div>
          </section>

          <div
            class="mt-8 p-4 bg-blue-50 rounded-lg text-center"
          >
            <p class="text-gray-700 font-medium">
              By using our website or purchasing our products, you acknowledge that you have read and agree to these Terms &amp; Conditions.
            </p>
          </div>
        </div>
      </div> */}
    </>
  );
}