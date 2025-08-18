
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import DeveloperImage from "../../assets/fire.png";

export default function About() {
  return (
    <div className="bg-[#95999d93] text-[#2C2627] min-h-screen px-6 py-12">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-[#FF6347]">
            Empowering Productivity Everywhere
          </h1>
          <p className="mt-6 text-[#2C2627] max-w-lg">
            A modern productivity companion to manage your daily schedule, tasks, plans, and expenses with built-in analytics
            to help you grow smarter every day.
          </p>
          <div className="mt-6">
            <Button className="bg-[#FF745C] hover:bg-[#FF6347] transition-all">Get Started</Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 mt-12 md:mt-0"
        >
          <img
            src={DeveloperImage}
            alt="Developer"
            className="w-80 h-80 rounded-full object-cover shadow-lg mx-auto"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="mt-24 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-[#FF745C] mb-8 text-center">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            'Task Management',
            'Daily Scheduling',
            'Expense Tracker',
            'Analytics Dashboard'
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
            >
              <Card className="bg-white text-black text-center p-4 shadow-xl rounded-2xl">
                <CardContent>
                  <h3 className="font-semibold text-xl">{feature}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="mt-24 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#FF745C] mb-4">Technology Stack</h2>
        <p className="text-[#2C2627] mb-6">
          Built using modern and efficient technologies for optimal performance.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-lg font-medium">
          <span className="bg-[#FF6347] px-4 py-2 rounded-full text-white">React.js</span>
          <span className="bg-[#FF6347] px-4 py-2 rounded-full text-white">Tailwind CSS</span>
          <span className="bg-[#FF6347] px-4 py-2 rounded-full text-white">React-Redux</span>
          <span className="bg-[#FF6347] px-4 py-2 rounded-full text-white">Node.js</span>
          <span className="bg-[#FF6347] px-4 py-2 rounded-full text-white">MongoDB</span>
          <span className="bg-[#FF6347] px-4 py-2 rounded-full text-white">Express.js</span>
          <span className="bg-[#FF6347] px-4 py-2 rounded-full text-white">Redix</span>
          <span className="bg-[#FF6347] px-4 py-2 rounded-full text-white">Fireabse</span>
          <span className="bg-[#FF6347] px-4 py-2 rounded-full text-white">Google OAuth</span>
          <span className="bg-[#FF6347] px-4 py-2 rounded-full text-white">JWT</span>
        </div>
      </section>

      {/* About Developer Section */}
       <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#FF745C] mb-4">Meet the Developer</h2>
            <p className="text-lg text-[#2C2627]">
              Passionate about creating tools that enhance productivity and simplify daily workflows
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  {/* <User className="w-16 h-16 text-white" /> */}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Uday Panda</h3>
                  <p className="text-slate-600 mb-4">
                    Full-stack developer with a passion for creating intuitive productivity solutions. Experienced in
                    modern web technologies and user-centered design principles.
                  </p>
                  <div className="flex justify-center md:justify-start gap-4">
                    <Button variant="outline" size="sm" className="group bg-transparent">
                      {/* <Github className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> */}
                      GitHub
                    </Button>
                    <Button variant="outline" size="sm" className="group bg-transparent">
                      {/* <Linkedin className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> */}
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="group bg-transparent">
                      {/* <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> */}
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Newsletter / Footer CTA */}
       <section className="bg-gradient-to-r from-[#FF745C] via-[#FF6347] to-[#2C2627] py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Boost Your Productivity?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who have transformed their daily workflow with our comprehensive productivity suite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 group">
              Get in touch
              {/* <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /> */}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
