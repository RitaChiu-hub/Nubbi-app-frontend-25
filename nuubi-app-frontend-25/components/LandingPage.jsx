import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import ShopifyBuyButton from "./ShopifyBuyButton"; // Make sure the path is correct
import { globalStyles } from "../styles/global";

const LandingPage = ({ navigation }) => {
  const [expanded, setExpanded] = useState(null); // Track the expanded question

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>
          10 Week Data Science Bootcamp
        </Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  const toggleAnswer = (index) => {
    setExpanded(expanded === index ? null : index); // Toggle answer visibility
  };

  const faqData = [
    {
      question: "What will I learn in this program?",
      answer: (
        <>
          By the end of this program, you'll gain:
          {"\n\n"}
          <Text style={styles.boldText}>1. Data Manipulation:</Text> Skills to
          clean and wrangle data with tools like `dplyr`, `pandas`, and `tidyr`.
          {"\n"}
          <Text style={styles.boldText}>2. Data Visualization:</Text> Expertise
          in creating impactful visualizations using `ggplot2`, `matplotlib`,
          and `seaborn`.{"\n"}
          <Text style={styles.boldText}>3. Programming Fundamentals:</Text> The
          ability to write reusable functions and automate data workflows.
          {"\n"}
          <Text style={styles.boldText}>
            4. Exploratory Data Analysis:
          </Text>{" "}
          Techniques for uncovering insights with summary statistics and
          visualizations.{"\n"}
          <Text style={styles.boldText}>
            5. Problem-Solving with Code:
          </Text>{" "}
          Hands-on experience solving real-world data challenges.{"\n"}
          <Text style={styles.boldText}>
            6. Software Setup & Importing Data:
          </Text>{" "}
          Knowledge of configuring tools (RStudio, Jupyter) and importing data
          from CSV, Excel, APIs, and databases.
        </>
      ),
    },
    {
      question: "Who do I contact with questions?",
      answer: (
        <Text>
          You can reach Dr. Kathryn Wifvat directly at:{" "}
          <Text style={styles.email}>kat@nuubi.com</Text>
        </Text>
      ),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Invest in yourself this New Year!</Text>
        <Text style={styles.subtitle}>
          10x your career with upskilling in data science and data analytics at
          a tenth of the cost. No technical experience required.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What You Receive:</Text>
        <View style={styles.sectionText}>
          <Text style={styles.sectionText}>
            - Learn R and Python from a PhD-educated Data Science professor.
          </Text>
          <Text style={styles.sectionText}>
            - Complete the program at your own pace, on your own time, while
            managing other commitments.
          </Text>
          <Text style={styles.sectionText}>
            - Access to group discussions, Q&A forums, and networking
            opportunities.
          </Text>
          <Text style={styles.sectionText}>
            - Certificate of completion, and for Standard or Premium you also
            receive a professional reference and LinkedIn recommendation.
          </Text>
          <Text style={styles.sectionText}>
            - All required materials and software are included or free to
            download.
          </Text>
          <Text style={styles.sectionText}>
            - 100% satisfied or your money back.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prerequisites:</Text>
        <Text style={styles.sectionText}>
          - You have access to a computer and internet.{"\n"}- You are
          interested in becoming a data scientist or data analyst.{"\n"}- You
          don't need any previous programming or technical experience—I will
          help you each step of the way!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Limited Time Offer Valid This Weekend Only
        </Text>
        <Text style={styles.sectionText}>
          Secure one of the remaining spots at the discounted price before
          Monday.
        </Text>
      </View>

      <View style={styles.pricingContainer}>
        {/* Basic Package */}
        <View style={styles.package}>
          <Text style={styles.packageTitle}>Basic</Text>
          <Text style={styles.packagePrice}>$85</Text>
          <Text style={styles.packageFeatures}>
            - Self-paced program{"\n"}- Access to course community{"\n"}-
            Certificate of Completion{"\n"}- Q&A Forums and group discussions
            {"\n"}- Premium data science curriculum{"\n"}
          </Text>
        </View>

        {/* Standard Package */}
        <View style={[styles.package, styles.highlightPackage]}>
          <Text style={styles.packageTitle}>Standard</Text>
          <Text style={styles.packagePrice}>$97</Text>
          <Text style={styles.packageFeatures}>
            - All Basic Package Features{"\n"}- LinkedIn Recommendation{"\n"}-
            Study Buddy Matching{"\n"}- 48 hour support for all your questions
            {"\n"}
          </Text>
        </View>

        {/* Premium Package */}
        <View style={styles.package}>
          <Text style={styles.packageTitle}>Premium</Text>
          <Text style={styles.packagePrice}>$297</Text>
          <Text style={styles.packageFeatures}>
            - All Standard Package Features{"\n"}- Four 30 minute 1-on-1
            Tutoring Sessions {"("}$200 Value{")"}
            {"\n"}
          </Text>
        </View>
      </View>

      <View style={[styles.buyButtonContainer]}>
        <ShopifyBuyButton />
      </View>

      <View style={styles.guaranteeSection}>
        <Text style={styles.guaranteeText}>
          💸 Money-back guarantee if not 100% satisfied | 🔒 Secure checkout
          through Shopify
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Real Student Testimonials:</Text>
        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>
            “Dr. Wifvat is an outstanding instructor with high-level knowledge,
            patience, and such kind attention to her students and their success.
            She is unbelievably responsive, and very approachable and helpful
            naturally and when asked. I was beyond impressed with how very
            willing to help, work through errors, or provide compassionate
            support through frustrating times she was throughout the course,
            start to finish! She was very motivating and supportive of all
            students' success. I wish I could take more classes with her. She
            has my highest recommendation as an instructor. If not for her, I am
            not sure I would have made it through.”
          </Text>
        </View>

        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>
            “Dr. Wifvat was my professor for Fundamentals of Data Science, and
            she was amazing.”
          </Text>
        </View>

        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>
            “Wifvat was an amazing professor who cares for the students'
            learning experience. She caters the class at their pace, not hers.”
          </Text>
        </View>

        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>
            “I just have to say she is 10/10 best professor and truly cares
            about how students are doing.”
          </Text>
        </View>
      </View>

      {/* FAQ Section */}
      <View style={styles.faqSection}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions:</Text>

        {faqData.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity onPress={() => toggleAnswer(index)}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
            </TouchableOpacity>

            {expanded === index && (
              <View style={styles.faqAnswerContainer}>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.aboutMeContainer}>
        <Image
          source={require("../assets/onboarding/headshotzoom2.png")}
          style={styles.profileImage}
        />
        <Text style={styles.aboutMeTitle}>About Your Instructor</Text>
        <Text style={styles.aboutMeText}>
          Hi, I'm Dr. Kathryn Wifvat, and I've had the privilege of teaching
          over 2,000 students, ranging from introductory R programming to
          Master's-level Data Science. I've taught at top institutions like
          Arizona State University, Merrimack College, and the University of the
          Cumberlands. With a PhD in Applied Mathematics from Arizona State
          University, I'm passionate about making education accessible and
          empowering individuals to upskill in technology.
          {"\n\n"}
          My expertise includes Python, R, SQL, data visualization, and machine
          learning. As the founder and CEO of Nuubi, I am working on the
          developing software that fosters learning and collaboration. Whether
          you're a beginner or advancing your skills, I'm here to guide you
          every step of the way.
          {"\n\n"}I understand that traditional degree programs, with classes
          costing about $2000, are not accessible to everyone. That's why I've
          created these programs to be affordable, flexible, and tailored to fit
          into your busy schedule and budget.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  aboutMeContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  subheaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // Optional: Set the color for better contrast
    marginBottom: 5, // Adds space between the subheader and its description
  },
  aboutMeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  aboutMeText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    lineHeight: 24,
  },
  buyButtonContainer: {
    marginTop: 30,
    alignItems: "center",
    width: "100%",
    display: "flex", // Use flex to allow items to be displayed side by side
    justifyContent: "center", // Ensure proper alignment of items
    flexDirection: "row", // Items should be placed in a row
    flexWrap: "wrap", // Allow wrapping for smaller screens
  },
  objectivesList: {
    marginTop: 10,
  },
  objective: {
    fontSize: 16, // Increased font size for better readability
    color: "#666",
    marginBottom: 20, // Increased bottom margin for better spacing
    lineHeight: 24, // Increased line height to create more space between lines
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#999",
  },
  testimonial: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  testimonialText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  reviewerName: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginTop: 10,
    textAlign: "right",
  },
  aboutSection: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  guaranteeSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  guaranteeText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  pricingContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  package: {
    width: "30%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  highlightPackage: {
    borderColor: "#007bff",
    backgroundColor: "#e6f7ff",
  },
  packageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  packageFeatures: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  faqSection: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginTop: 20,
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  faqItem: {
    marginBottom: 15,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#2482AA",
  },
  faqAnswerContainer: {
    marginBottom: 10,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
  boldText: {
    fontWeight: "bold",
  },
  email: {
    color: "#2482AA",
    fontWeight: "bold",
  },
});

export default LandingPage;
