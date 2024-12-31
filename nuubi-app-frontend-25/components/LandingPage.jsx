import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import ShopifyBuyButton from "./ShopifyBuyButton"; // Make sure the path is correct
import { globalStyles } from "../styles/global";

const LandingPage = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>
          10 Week Data Science Program
        </Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Invest in yourself for the New Year, with our Special NYE Offer!
        </Text>
        <Text style={styles.subtitle}>
          Upskill and launch your career in data science and data analytics. No
          technical experience required. Beginner friendly.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Upskill in Data Science?</Text>
        <Text style={styles.sectionText}>
          This 10-week Data Science program is designed to give you the skills
          to succeed in the rapidly growing field of data science. Learn R &
          Python from an experienced data science professor.
        </Text>

        <Text style={styles.sectionText}>
          - **High Demand**: Data science is one of the most in-demand skills in
          today's job market, with companies across all industries seeking
          skilled professionals.{"\n"}- **Lucrative Career Opportunities**: Data
          scientists and analysts often earn competitive salaries, with
          opportunities to grow into senior and leadership roles.{"\n"}-
          **Career Versatility**: Skills in data science can be applied in
          fields like healthcare, finance, marketing, education, and more,
          opening doors to diverse career paths.{"\n"}- **Future-Proof Your
          Career**: As technology advances, data literacy is becoming essential
          for career growth in a variety of roles.{"\n"}- **Make an Impact**:
          Data science allows you to solve real-world problems, make data-driven
          decisions, and drive innovation in your industry.{"\n"}- **Boost Your
          Resume**: Adding data science to your skill set shows employers your
          commitment to growth and your ability to adapt to emerging trends.
          {"\n"}- **Learn Problem-Solving**: Gain the ability to analyze data
          effectively, spot trends, and make decisions that impact business
          outcomes.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What You Get:</Text>
        <Text style={styles.sectionText}>
          - Preliminary mastery of R and Python for use in Data Science.{"\n"}-
          Flexible program that you can complete on your own time, at your own
          pace, while juggling other commitments.{"\n"}- Expert guidance from an
          experienced Master's of Data Science Professor with a PhD in Applied
          Mathematics.{"\n"}- Study Buddy matching for accountability and
          working together (optional).{"\n"}- Group Discussions, Q&A forums, and
          networking.{"\n"}- Participation analytics and final report of
          learning accomplishments.{"\n"}- Certificate of completion,
          professional reference, and LinkedIn recommendation upon successful
          completion and participation in the program.{"\n"}- All course
          materials and software required are included at this price or free to
          download.{"\n"}- Money-back guarantee if you are not 100% satisfied.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Objectives</Text>
        <Text style={styles.sectionText}>
          In this R/Python for Data Science Bootcamp, you'll learn the
          fundamentals of both programming languages and their applications in
          data analysis and visualization. By the end of the course, you'll be
          able to:
        </Text>

        <View style={styles.objectivesList}>
          <Text style={styles.objective}>
            1. **Data Manipulation with R & Python**: Master the art of data
            cleaning and wrangling with tools like `dplyr`, `tidyr`, and
            `pandas`.
          </Text>
          <Text style={styles.objective}>
            2. **Data Visualization**: Create insightful visualizations using
            `ggplot2` (R) and `matplotlib`/`seaborn` (Python) to communicate
            your data findings.
          </Text>
          <Text style={styles.objective}>
            3. **Functions & Programming**: Write reusable functions and
            automate tasks to save time and effort in data analysis.
          </Text>
          <Text style={styles.objective}>
            4. **Exploratory Data Analysis (EDA)**: Learn to explore datasets
            and extract key insights using summary statistics and basic data
            visualizations.
          </Text>
          <Text style={styles.objective}>
            5. **Problem-Solving with Code**: Apply your programming skills to
            solve real-world data problems and gain hands-on experience with
            Python and R.
          </Text>
          <Text style={styles.objective}>
            6. **Professional Development**: Earn a certificate of completion,
            plus a LinkedIn recommendation to enhance your resume and job
            applications.
          </Text>
          <Text style={styles.objective}>
            7. **Software Setup**: Learn how to set up and configure the
            required development environments (R, Python, Jupyter, RStudio) for
            data science tasks.
          </Text>
          <Text style={styles.objective}>
            8. **Importing Data**: Gain proficiency in importing data from
            various sources (CSV, Excel, APIs, databases) into R and Python for
            analysis.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prerequisites:</Text>
        <Text style={styles.sectionText}>
          - You are able to dedicate at least 5-10 hours per week.{"\n"}- You
          have access to a computer and internet.{"\n"}- You are interested in
          becoming a data scientist or data analyst.{"\n"}- You don't need any
          previous programming or technical experience—I will help you each step
          of the way!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Limited Time Offer Valid for 24 Hours!
        </Text>
        <Text style={styles.sectionText}>
          Discounted rates available for NYE. Set yourself up for success in the
          new year!
        </Text>
      </View>

      <View style={styles.pricingContainer}>
        {/* Basic Package */}
        <View style={styles.package}>
          <Text style={styles.packageTitle}>Basic</Text>
          <Text style={styles.packagePrice}>$85</Text>
          <Text style={styles.packageFeatures}>
            - Certificate of Completion{"\n"}- Access to course materials{"\n"}-
            Self-paced program{"\n"}
          </Text>
        </View>

        {/* Standard Package */}
        <View style={[styles.package, styles.highlightPackage]}>
          <Text style={styles.packageTitle}>Standard</Text>
          <Text style={styles.packagePrice}>$97</Text>
          <Text style={styles.packageFeatures}>
            - Certificate of Completion{"\n"}- LinkedIn Recommendation{"\n"}-
            Study Buddy Matching{"\n"}- Q&A Forums & Networking{"\n"}-
            Money-back Guarantee{"\n"}
          </Text>
        </View>

        {/* Premium Package */}
        <View style={styles.package}>
          <Text style={styles.packageTitle}>Premium</Text>
          <Text style={styles.packagePrice}>$297</Text>
          <Text style={styles.packageFeatures}>
            - All Standard Package Features{"\n"}- 5 Private Coaching Sessions
            {"\n"}- Personalized Career Advice{"\n"}- Exclusive Expert Q&A{"\n"}
          </Text>
        </View>
      </View>

      <View style={[styles.buyButtonContainer]}>
        <ShopifyBuyButton />
      </View>
      <View style={styles.guaranteeSection}>
        <Text style={styles.guaranteeText}>
          💸 Money-back guarantee | 🔒 Secure checkout through Shopify & PayPal
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Real Students Say</Text>
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
          <Text style={styles.reviewerName}>
            – Anonymous Data Science Student
          </Text>
        </View>

        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>
            “Dr. Wifvat was my professor for Fundamentals of Data Science, and
            she was amazing.”
          </Text>
          <Text style={styles.reviewerName}>
            – Anonymous Data Science Student
          </Text>
        </View>

        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>
            “Wifvat was an amazing professor who cares for the students'
            learning experience. She caters the class at their pace, not hers.”
          </Text>
          <Text style={styles.reviewerName}>– Anonymous Student</Text>
        </View>

        <View style={styles.testimonial}>
          <Text style={styles.testimonialText}>
            “I just have to say she is 10/10 best professor and truly cares
            about how students are doing.”
          </Text>
          <Text style={styles.reviewerName}>– Anonymous Student</Text>
        </View>
      </View>
      <View style={styles.aboutMeContainer}>
        <Image source={{ uri: "YOUR_PHOTO_URL" }} style={styles.profileImage} />
        <Text style={styles.aboutMeTitle}>About Me</Text>
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
          learning. As the founder and CEO of Nuubi, I lead the development of
          educational technologies that foster learning and collaboration.
          Whether you're a beginner or advancing your skills, I'm here to guide
          you every step of the way.
          {"\n\n"}I understand that traditional degree programs, with an average
          annual tuition of over $35,000, are not accessible to everyone. That's
          why I've created these programs to be affordable, flexible, and
          tailored to fit into your busy schedule and budget. Education should
          be a tool for empowerment, not a financial burden.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Have questions? Email me at kat@nuubi.app, and I will get back to you
          as soon as I can!
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
    marginTop: 10,
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
});

export default LandingPage;
