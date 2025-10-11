import { IPolicySection } from "@/schemas/settingsSchema";
import { fetchPolicySection } from "@/services/settings.services";
import { IApiResponse } from "@/types/ApiResponse";
export const dynamic = 'force-dynamic';

export default async function PrivacyPolicy() {
    const [policyRes] = await Promise.all([
        fetchPolicySection() as Promise<IApiResponse<IPolicySection>>,
    ]);
    const { data: policy } = policyRes;
    return (
        <>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dangerouslySetInnerHTML={{ __html: policy?.privacyPolicy || "" }} />
            {/* <div

                class="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
            >
                <div
                    class="bg-gradient-to-r from-primary to-black/90 p-8 text-center"
                >
                    <div class="flex justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-icon lucide-shield text-secondary text-5xl"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
                    </div>
                    <h1 class="text-3xl font-bold text-white">Privacy Policy</h1>
                    <p class="mt-2 text-blue-100">Last Updated: June 28, 2023</p>
                </div>
                <div
                    class="p-8 md:p-10"
                >
                    <section
                        class="mb-8"
                    >
                        <h2 class="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
                        <p class="text-gray-600 leading-relaxed">
                            Welcome to <strong>Cartel Power System</strong> {`("we," "our," or "us"). We are committed to protecting
                            your privacy and ensuring the security of your personal data. This Privacy Policy
                            explains how we collect, use, disclose, and safeguard your information when you
                            interact with our website, products, or services related to the sale and manufacturing`}
                            of <strong>ARD (Automatic Rescue Device) for lifts</strong>.
                        </p>
                    </section>

                    <section
                        class="mb-8"
                    >
                        <h2 class="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
                        <p class="text-gray-600 mb-4 leading-relaxed">
                            We may collect the following types of information:
                        </p>
                        <div class="bg-blue-50 p-4 rounded-lg mb-4">
                            <h3 class="font-medium text-blue-700 mb-2">Personal Information</h3>
                            <ul class="list-disc pl-5 text-gray-600 space-y-1">
                                <li>Name, email address, phone number, and company details</li>
                                <li>Billing and shipping details (for purchases)</li>
                                <li>Technical and usage data (IP address, browser type)</li>
                            </ul>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="font-medium text-gray-700 mb-2">Non-Personal Information</h3>
                            <ul class="list-disc pl-5 text-gray-600 space-y-1">
                                <li>Anonymous usage statistics</li>
                                <li>Cookies and tracking technologies</li>
                            </ul>
                        </div>
                    </section>

                    <section
                        class="mb-8"
                    >
                        <h2 class="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Your Information</h2>
                        <p class="text-gray-600 leading-relaxed">
                            We use the collected data for:
                        </p>
                        <ul class="list-disc pl-5 text-gray-600 mt-2 space-y-1">
                            <li>Processing orders and providing customer support</li>
                            <li>Improving our products and services</li>
                            <li>Sending marketing communications (with your consent)</li>
                            <li>Complying with legal obligations</li>
                        </ul>
                    </section>

                    <section
                        class="mb-8"
                    >
                        <h2 class="text-2xl font-semibold text-gray-800 mb-4">4. Data Security</h2>
                        <p class="text-gray-600 leading-relaxed">
                            We implement <strong>industry-standard security measures</strong> (encryption, access controls)
                            to protect your data from unauthorized access or breaches.
                        </p>
                    </section>

                    <section
                        class="mt-12 bg-gray-50 p-6 rounded-xl"
                    >
                        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
                        <div class="space-y-4">
                            <div class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail-icon lucide-mail text-blue-600 mt-1 mr-3 flex-shrink-0"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
                                <div>
                                    <h3 class="font-medium text-gray-700">Email</h3>
                                    <p class="text-gray-600">privacy@cartelpowersystem.com</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-icon lucide-phone text-blue-600 mt-1 mr-3 flex-shrink-0"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg>
                                <div>
                                    <h3 class="font-medium text-gray-700">Phone</h3>
                                    <p class="text-gray-600">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin text-blue-600 mt-1 mr-3 flex-shrink-0"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
                                <div>
                                    <h3 class="font-medium text-gray-700">Address</h3>
                                    <p class="text-gray-600">123 Industrial Park, Lift City, LC 12345</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div> */}
        </>
    );
}