import * as React from "react";
import { View, Text, ScrollView } from "react-native";
import { globalStyles } from "../../styles/global";

export default function AccessibilityScreen({ navigation }) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={globalStyles.h3HeadingWhite}>Accessibility Statement</Text>
      ),
      headerTitleAlign: "center",
    });
  }, [navigation]);

  return (
    <ScrollView
      style={{
        backgroundColor: "#fbfbfb",
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          backgroundColor: "#fbfbfb",
          margin: 16,
        }}
      >
        {/* Intro */}
        <Text style={globalStyles.headingText}>Nuubi Accessibility Statement</Text>
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.bodyRegular}>
          At Nuubi, accessibility is central to our mission of creating inclusive,
          engaging, and equitable learning experiences for all students. We are
          committed to ensuring that everyone, including individuals with
          disabilities, can access and use Nuubi’s products and services
          effectively.
        </Text>

        {/* Standards and Commitment */}
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.headingText}>Standards and Commitment</Text>
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.bodyRegular}>
          Nuubi aims to conform to the Web Content Accessibility Guidelines (WCAG){" "}
          2.1 Level AA standards and Section 508 requirements. These
          internationally recognized guidelines define how to make digital content
          more accessible to people with visual, auditory, motor, and cognitive
          impairments.
        </Text>
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.bodyRegular}>
          Accessibility is integrated into our design and engineering process and
          reviewed regularly to ensure compatibility with assistive technologies.
        </Text>

        {/* Testing and Continuous Improvement */}
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.headingText}>
          Testing and Continuous Improvement
        </Text>
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.bodyRegular}>
          Nuubi’s web and mobile interfaces are developed using React Native and
          modern web technologies designed to support:
        </Text>
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.bodyRegular}>
          • Screen reader compatibility (tested with VoiceOver for web and iOS;{" "}
          TalkBack for Android)
        </Text>
        <Text style={globalStyles.bodyRegular}>
          • Keyboard navigation
        </Text>
        <Text style={globalStyles.bodyRegular}>
          • Sufficient color contrast
        </Text>
        <Text style={globalStyles.bodyRegular}>
          • Scalable text and responsive layouts
        </Text>
        <Text style={globalStyles.bodyRegular}>
          • Clear and consistent navigation and labeling
        </Text>
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.bodyRegular}>
          Accessibility testing is conducted on an ongoing basis using automated
          tools (such as WAVE by WebAIM) and manual evaluations. Findings are
          logged and prioritized in Nuubi’s issue-tracking system. Critical
          accessibility issues are resolved as quickly as possible, and all fixes
          are verified before subsequent releases.
        </Text>

        {/* Accessibility Team and Responsibility */}
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.headingText}>
          Accessibility Team and Responsibility
        </Text>
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.bodyRegular}>
          Accessibility is a shared responsibility across the Nuubi team. Product
          design, engineering, and QA teams all receive guidance on WCAG
          compliance. Oversight of accessibility reviews and conformance tracking
          is managed directly by the Nuubi leadership team.
        </Text>

        {/* Reporting Accessibility Issues */}
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.headingText}>
          Reporting Accessibility Issues
        </Text>
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.bodyRegular}>
          We take full responsibility for maintaining accessibility standards and
          welcome feedback from our users and institutional partners. If you
          encounter an accessibility barrier while using Nuubi, please contact us
          at:
        </Text>
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.bodyRegular}>support@nuubi.com</Text>
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.bodyRegular}>
          Messages received through this channel are automatically routed to the
          appropriate team member for review and resolution. We aim to acknowledge
          reports within two business days and provide a resolution or update as
          soon as possible.
        </Text>

        {/* No Additional Cost for Accessibility */}
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.headingText}>
          No Additional Cost for Accessibility
        </Text>
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.bodyRegular}>
          Accessibility improvements and remediation are part of Nuubi’s core
          development and maintenance. Partner institutions will not incur
          additional costs, commitments, or fees for accessibility-related updates
          or support.
        </Text>

        {/* Ongoing Work */}
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.headingText}>Ongoing Work</Text>
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.bodyRegular}>
          Nuubi is in the process of completing a formal Accessibility Conformance
          Report (VPAT) based on the WCAG 2.1 Level AA standards. Preliminary
          internal audits indicate strong alignment with accessibility
          requirements, and we continue refining areas for improvement.
        </Text>
        <View style={{ margin: 5 }} />
        <Text style={globalStyles.bodyRegular}>
          We remain committed to transparency and continuous progress so that
          Nuubi is usable, inclusive, and empowering for all learners.
        </Text>

        {/* Last updated */}
        <View style={{ margin: 10 }} />
        <Text style={globalStyles.bodyRegular}>
          Last updated: October 25, 2025
        </Text>
        <View style={{ margin: 15 }} />
      </View>
    </ScrollView>
  );
}