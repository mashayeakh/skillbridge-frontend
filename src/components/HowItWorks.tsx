import React from "react";

const StepCard = ({ step, title, children }: { step: string; title: string; children?: React.ReactNode }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-8 w-full transform-gpu transition-transform duration-300 flex flex-col justify-between min-h-64">
            <div className="text-center">
                <div className="text-sm font-medium text-green-500">{step}</div>
                <h3 className="mt-3 text-2xl font-semibold text-gray-900">{title}</h3>
            </div>

            <div className="transition-opacity duration-300  flex-1 flex items-center justify-center">{children}</div>
        </div>
    );
};

export default function HowItWorks() {
    return (
        <section className="py-8 ">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
                <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                    A simple 3-step process to get you connected with expert tutors.
                </p>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <StepCard step="Step 1" title="CHOOSE YOUR TUTOR">
                        <div className="rounded-md  p-4">
                            <div className="bg-white rounded-md p-4">
                                <div className="flex flex-col items-center gap-4">
                                    <img
                                        src="https://static1.wyzantcdn.com/homepage/step1.svg"
                                        alt="Choose your tutor"
                                        className="mx-auto h-40 w-auto"
                                    />
                                    <div className="w-full">
                                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                                        <div className="h-2 bg-gray-100 rounded w-1/2" />
                                    </div>
                                    <div className="text-yellow-500">★★★★★</div>
                                </div>
                            </div>
                        </div>
                    </StepCard>

                    <StepCard step="Step 2" title="SCHEDULE A SESSION">
                        <div className="rounded-md  p-4">
                            <div className="bg-white rounded-md p-4">
                                <div className="flex flex-col items-center gap-4">
                                    <img
                                        src="https://static1.wyzantcdn.com/homepage/step3.svg"
                                        alt="Schedule a session"
                                        className="mx-auto h-40 w-auto"
                                    />
                                    <div className="text-sm text-gray-700">Select a time that works for you and confirm.</div>
                                </div>
                            </div>
                        </div>
                    </StepCard>

                    <StepCard step="Step 3" title="START LEARNING">
                        <div className="rounded-mdp-4">
                            <div className="bg-white rounded-md  p-4">
                                <div className="flex flex-col items-center gap-4">
                                    <img
                                        src="https://static1.wyzantcdn.com/homepage/step2.svg"
                                        alt="Schedule a session"
                                        className="mx-auto h-40 w-auto"
                                    />
                                    <div className="text-sm text-gray-700">Join the session and get personalized guidance.</div>
                                </div>
                            </div>
                        </div>
                    </StepCard>

                    {/* <StepCard step="Step 3" title="START LEARNING">
                        <div className="rounded-md bg-gray-50 p-4">Join the session and get personalized guidance.</div>
                    </StepCard> */}
                </div>
            </div>
        </section>
    );
}
