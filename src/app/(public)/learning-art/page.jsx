

export const metadata = {
    title: "LearningART | ScholarPASS - Tutoring with LearningART AI Platform",
    description: "LearningART | ScholarPASS - Tutoring with LearningART AI Platform",
};

const LearningArt = () => {
    return (
        <>
            <section className="p-6 bg- ">
                <div className="bg- text-center py-16">
                    {/* Icon and Heading Section */}
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-16 h-16 mx-auto rounded-lg flex items-center justify-center mb-6 shadow-lg">
                            <i className="text-white text-4xl">📚</i> {/* Placeholder for icon */}
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900">ScholarPASS LearningART</h1>
                        <p className="text-lg text-gray-500 mt-4">
                            Streamlining education through Assessment, Recommendation, and Training
                        </p>
                    </div>

                    {/* Cards Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16 px-6">
                        {/* Assessment Card */}
                        <div className="bg-white shadow-lg p-8 rounded-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-16 h-16 mx-auto rounded-full mb-4 flex items-center justify-center">
                                <i className="text-white text-3xl">📋</i> {/* Icon for Assessment */}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Assessment</h3>
                            <p className="text-gray-600 mt-2">
                                Evaluate knowledge and skills, identifying strengths and areas for improvement.
                            </p>
                        </div>

                        {/* Recommendation Card */}
                        <div className="bg-white shadow-lg p-8 rounded-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-16 h-16 mx-auto rounded-full mb-4 flex items-center justify-center">
                                <i className="text-white text-3xl">💡</i> {/* Icon for Recommendation */}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Recommendation</h3>
                            <p className="text-gray-600 mt-2">
                                Provide personalized learning recommendations based on assessment results.
                            </p>
                        </div>

                        {/* Training Card */}
                        <div className="bg-white shadow-lg p-8 rounded-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-16 h-16 mx-auto rounded-full mb-4 flex items-center justify-center">
                                <i className="text-white text-3xl">🎓</i> {/* Icon for Training */}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Training</h3>
                            <p className="text-gray-600 mt-2">
                                Deliver targeted materials to help students achieve their learning goals.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-6 pt-16">
                    {/* Live Tutors & AI LMS Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
                        {/* Live Tutors & Mentors Card */}
                        <div className="bg-white shadow-lg p-8 rounded-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="flex items-center mb-4">
                                <i className="text-blue-600 text-3xl mr-3">👨‍🏫</i>
                                <h3 className="text-xl font-bold text-gray-900">Live Tutors & Mentors</h3>
                            </div>
                            <ul className="list-none space-y-3 text-gray-600">
                                <li>
                                    <span className="text-green-500">✔</span> One-on-one sessions with expert tutors
                                </li>
                                <li>
                                    <span className="text-green-500">✔</span> Group study sessions facilitated by mentors
                                </li>
                                <li>
                                    <span className="text-green-500">✔</span> Personalized feedback and guidance
                                </li>
                                <li>
                                    <span className="text-green-500">✔</span> 24/7 support from AI and human experts
                                </li>
                            </ul>
                        </div>

                        {/* AI-Based LMS Card */}
                        <div className="bg-white shadow-lg p-8 rounded-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="flex items-center mb-4">
                                <i className="text-purple-600 text-3xl mr-3">📖</i>
                                <h3 className="text-xl font-bold text-gray-900">AI-Based LMS</h3>
                            </div>
                            <ul className="list-none space-y-3 text-gray-600">
                                <li>
                                    <span className="text-green-500">✔</span> Adaptive learning paths tailored to individual needs
                                </li>
                                <li>
                                    <span className="text-green-500">✔</span> Real-time progress tracking with predictive analytics
                                </li>
                                <li>
                                    <span className="text-green-500">✔</span> Interactive AI-guided quizzes and exercises
                                </li>
                                <li>
                                    <span className="text-green-500">✔</span> Personalized content recommendations
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Interactive Learning Features Section */}
                    <h2 className="text-3xl font-bold text-gray-900 text-center my-12 pt-16 ">
                        Interactive Learning Features
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                        {/* Feature 1 - AI Chat Support */}
                        <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <i className="text-gray-600 text-3xl">💬</i> {/* Placeholder icon */}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">AI Chat Support</h3>
                            <p className="text-gray-600 mt-2">Instant answers from our AI tutor</p>
                        </div>

                        {/* Feature 2 - Interactive Videos */}
                        <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <i className="text-gray-600 text-3xl">🎥</i> {/* Placeholder icon */}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Interactive Videos</h3>
                            <p className="text-gray-600 mt-2">Engaging lessons with adaptive pacing</p>
                        </div>

                        {/* Feature 3 - Audio Learning */}
                        <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <i className="text-gray-600 text-3xl">🎧</i> {/* Placeholder icon */}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Audio Learning</h3>
                            <p className="text-gray-600 mt-2">AI-generated content for on-the-go studying</p>
                        </div>

                        {/* Feature 4 - Quiz */}
                        <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <i className="text-gray-600 text-3xl">📝</i> {/* Placeholder icon */}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Quiz</h3>
                            <p className="text-gray-600 mt-2">Interactive quizzes to reinforce learning</p>
                        </div>

                        {/* Feature 5 - Group Class */}
                        <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <i className="text-gray-600 text-3xl">👥</i> {/* Placeholder icon */}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Group Class</h3>
                            <p className="text-gray-600 mt-2">Collaborative sessions with peers</p>
                        </div>

                        {/* Feature 6 - Local Labs */}
                        <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <i className="text-gray-600 text-3xl">🏫</i> {/* Placeholder icon */}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Local Labs</h3>
                            <p className="text-gray-600 mt-2">Hands-on sessions in nearby facilities</p>
                        </div>
                    </div>
                </div>
                <div className="bg- py-16">
                    {/* Testimonial Section */}
                    <div className="max-w-4xl mx-auto px-6 mb-16">
                        <div className="bg-purple-800 text-white p-8 rounded-lg shadow-lg text-center">
                            <i className="text-white text-4xl mb-4">⭐</i> {/* Star icon or placeholder */}
                            <blockquote className="text-xl italic mb-4">
                                ScholarPASS LearningART has revolutionized our students learning experience. The combination of AI-powered personalization and live tutor support has significantly boosted engagement and academic performance.
                            </blockquote>
                            <p className="font-semibold">
                                Dr. Emily Chen, Director of E-Learning Innovation
                            </p>
                        </div>
                    </div>

                    {/* Call to Action Section */}
                    <div className="max-w-3xl mx-auto px-6">
                        <div className="bg-white shadow-lg rounded-lg p-12 text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Experience Personalized Learning at Its Best
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Join thousands of students benefiting from AI-powered personalized courses and expert live tutoring with ScholarPASS LearningART.
                            </p>
                            <button className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300">
                                Start Your Free Trial
                            </button>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="mt-12 text-center text-sm text-gray-500">
                        <p>Empowering learners with the perfect blend of artificial intelligence and human expertise</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LearningArt;
